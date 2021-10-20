/**
 * Chunx Template Constructor
 * @param {DOMstring} htmlString 
 * @param {object} props 
 * @param {function} controller 
 * @returns chunx template
 */
const chunx = (htmlString, props = {}, controller = () => {}) => {
    return () => chunxInstance(htmlString, props, controller);
}
/**
 * Chunx Instance Constructor
 * @param {DOMstring} htmlString 
 * @param {object} props
 * @param {function} controller 
 * @returns chunx instance
 */
const chunxInstance = (htmlString, props = {}, controller = () => {}) => {
    if(!htmlString || typeof htmlString != 'string'){
        throw Error(`chunx require argument 'htmlString' of type string but got ${typeof htmlString}.`);
    }
    if(!window.chunx) window.chunx = {};
    const element = document.createElement('div');
    // https://jsmates.com/blog/generating-simple-unique-identifier-using-javascript
    element.ref = `elem${Date.now().toString(36)+Math.random().toString(36).substr(2)}`;
    console.log(element.ref);
    element.innerHTML = htmlString;
    element._variables = props;
    element._functions = {};
    element._updateEvents = {};
    element._subComponents = {};
    element._propagateUpdate = () => {};
    /**
     * Add or update a trackable variable to element
     * @param {string} name 
     * @param {any} value 
     */
    element.set = (name, value) => {
        if(typeof name !== 'string'){
            throw Error(`set failed: argument 'variableName' expected string but got ${typeof name}.`);
        }
        if(!element._updateEvents[name]){        
            element._updateEvents[name] = [];
        }
        if(value instanceof HTMLElement){
            element._includeChild(value);
        }
        element._variables[name] = value;
        element._updateEvents[name].forEach((callback) => {
            callback();
        });
        element._reRender();
    };
    /**
     * Add function to element that can be called by name from HTML template
     * @param {string} name 
     * @param {function} value 
     */
    element.setFn = (fnName, fnValue) => {
        if(typeof fnName !== 'string'){
            throw Error(`setFn failed: argument 'fnName' expected string but got ${typeof fnName}.`);
        }
        if(typeof fnValue !== 'function'){
            throw Error(`setFn failed: argument 'fnValue' expected function but got ${typeof fnValue}.`);
        }
        const key = `${element.ref}::${fnName}`;
        window.chunx[key] = fnValue;
        element._functions[fnName] = key;
        element._reRender();
    };
    /**
     * Track a variable and provide a callback function onchange
     * @param {string} variableName 
     * @param {function} callbackFn 
     */
    element.track = (variableName, callbackFn) => {
        if(typeof variableName !== 'string'){
            throw Error(`track failed: argument 'variableName' expected string but got ${typeof variableName}.`);
        }
        if(typeof callbackFn !== 'function'){
            throw Error(`track failed: argument 'callbackFn' expected function but got ${typeof callbackFn}.`);
        }
        if(!element._variables[variableName]){
            throw Error(`track failed: variable with name '${variableName}' does not exist.`);
        }
        if(!element._updateEvents[variableName]) element._updateEvents[variableName] = [];
        element._updateEvents[variableName].push(callbackFn);
    };
    /**
     * Getter for tracked variables
     * @param {string} variableName 
     * @returns variable
     */
    element.get = (variableName) => {
        if(typeof variableName !== 'string'){
            throw Error(`get failed: argument 'variableName' expected string but got ${typeof variableName}.`);
        }
        return element._variables[variableName];
    };
    /**
     * Declare a computed variable that re-evaluates when tracked variables are updated
     * @param {string} name 
     * @param {array<string>} tracked 
     * @param {function} computeFn 
     */
    element.computedVar = (name, tracked = [], computeFn = () => null) => {
        element.set(name, computeFn());
        tracked.forEach((varName) => {
            element.track(varName, () => {
                element.set(name, computeFn());
            });
        });
    };
    /**
     * Return element with updated props
     * @param {object} vars 
     * @returns chunx element
     */
    element.withVars = (vars = {}) => {
        Object.keys(vars).forEach((key) => {
            element.set(key, vars[key]);
        });
        return element;
    };
    /**
     * Initializes an instance of a chunx template and attaches to parent
     * @param {chunx template} component 
     * @param {object} data 
     * @returns htmlString
     */
    element.template = (component, data = {}) => {
        if(!(component() instanceof HTMLElement)){
            throw Error(`repeat: expected function argument 'component' that returns type HTMLElement but got ${typeof component()}.`);
        }
        if(typeof data !== 'object'){
            throw Error(`repeat: argument 'dataArray' expected array of type object but got ${typeof data}.`);
        }
        const rendered = component().withVars(data);
        element._includeChild(rendered);
        return `<${rendered.ref}/>`;
    }
    /**
     * Repeat a chunx template applying properties to each from dataArray and attach to parent
     * @param {chunx template} component 
     * @param {array<object>} data 
     * @returns htmlString
     */
    element.repeat = (component, dataArray = []) => {
        if(!(component() instanceof HTMLElement)){
            throw Error(`repeat: expected function argument 'component' that returns type HTMLElement but got ${typeof component()}.`);
        }
        return dataArray.map((data) => {
            if(typeof data !== 'object'){
                throw Error(`repeat: argument 'dataArray' expected array of type object but got ${typeof data}.`);
            }
            const rendered = component().withVars(data);
            element._includeChild(rendered);
            return `<${rendered.ref}/>`;
        }).join('\n');
    }
    element._reRender = () => {
        let renderedHtmlString = `${htmlString}`;
        Object.keys(element._variables).forEach((variableName) => {
            const toFind = new RegExp(`{{${variableName}}}`, 'g');
            renderedHtmlString = renderedHtmlString.replace(toFind, element._variables[variableName]);
        });
        Object.keys(element._subComponents).forEach((componentId) => {
            renderedHtmlString = renderedHtmlString.replace(`<${componentId}/>`, element._subComponents[componentId].innerHTML);
        });
        Object.keys(element._functions).forEach((fnName) => {
            renderedHtmlString = renderedHtmlString.replace(`{{${fnName}()}}`, `window.chunx['${element._functions[fnName]}']()`);
        });
        element.innerHTML = renderedHtmlString;
        element._propagateUpdate();
    };
    element._includeChild = (child) => {
        child._propagateUpdate = element._reRender;
        element._subComponents[child.ref] = child;
    };
    element._reRender();
    controller({
        get: element.get,
        set: element.set,
        setFn: element.setFn,
        track: element.track,
        computedVar: element.computedVar,
        template: element.template,
        repeat: element.repeat,
    });
    return element;
}

/**
 * Attaches root element to DOM
 * @param {string} id 
 * @param {chunx template} rootComponent 
 */
const attachRootElement = (id, rootComponent) => {
    const instance = rootComponent();
    if(typeof id !== 'string'){
        throw Error(`attachRootElement requires argument 'id' of type string but got ${typeof id}.`);
    }
    if(!(instance instanceof HTMLElement)){
        throw Error(`attachRootElement requires function argument 'rootComponent' that returns type HTMLElement but got ${typeof instance}.`);
    }
    const root = document.getElementById(id);
    if(!root){
        throw Error(`attachRootElement: Failed to attach root. No DOM elements found with id: ${id}.`);
    }
    root.appendChild(instance);
}

export { chunx, attachRootElement };