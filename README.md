# Chunx
Simple "no-frills" Front-End Web Component Framework featuring:
- Reusable template components
- Automatic re-render on component variable changes
- Single dependency with no additional build time

"No building, No compiling, Just `chunx.js`"


# Docs

## Getting Started

Place `chunx.js` somewhere in your project directory

## Chunx Constructor
This function is used to define all of your re-usable components, or "chunx" and returns a function that when called returns an instance of the chunx.
```js
/**
 * Chunx Template Constructor
 * @param {DOMstring} htmlString 
 * @param {object} props 
 * @param {function} controller 
 * @returns chunx template
 */
chunx(htmlString, props = {}, controller = () => {})
```

## Chunx Props
Props are tracked variables that are declared within the constructor. Each variable name should be a key in the props object with an initial value.

```js
const component = chunx(
    /* html */
    `<div>{{someVariable}}</div>`,

    /* props */
    {
        someVariable: 1
    }
);
```

Note: variables can also be declared within the controller using the injected set() function.

## Chunx Controller
The Chunx component controller is a function that contains all of the component's logic. The logic is implemented using chunx component methods that are passed to the function in an object which you can destructure to cherry pick only the methods you need.

```js
const component = chunx(
    /* html */
    `<div>{{someVariable}}</div>`,

    /* props */
    {
        someVariable: 1
    },

    /* controller */
    ({get, set, setFn, track, computedVar, template, repeat}) => {
        // add component logic here
        set('someVariable', 2);
    }
);

```

The available methods passed to the controller are:

`get, set, setFn, track, computedVar, template, repeat`

```js
/**
 * Getter for tracked variables
 * @param {string} variableName 
 * @returns variable
 */
get(variableName)
```
```js
/**
 * Add or update a trackable variable to element
 * @param {string} name 
 * @param {any} value 
 */
set(name, value)
```
```js
/**
 * Add function to element that can be called by name from HTML template
 * @param {string} fnName 
 * @param {function} fnValue 
 */
setFn(fnName, fnValue)
```
```js
/**
 * Track a variable and provide a callback function onchange
 * @param {string} variableName 
 * @param {function} callbackFn 
 */
track(variableName, callbackFn)
```
```js
/**
 * Declare a computed variable that re-evaluates when tracked variables are updated
 * @param {string} name 
 * @param {array<string>} tracked 
 * @param {function} computeFn 
 */
computedVar(name, tracked = [], computeFn = () => null)
```
```js
/**
 * Initializes an instance of a chunx template and attaches to parent
 * @param {chunx template} component 
 * @param {object} data 
 * @returns htmlString
 */
template(component, data = {})
```
```js
/**
 * Repeat a chunx template applying properties to each from dataArray and attach to parent
 * @param {chunx template} component 
 * @param {array<object>} dataArray 
 * @returns htmlString
 */
repeat(component, dataArray = [])
```

You can find examples of the controller functions in the section below.

# Examples

## Creating root component and attaching to DOM
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>Hello World</h1>
    </div>
`);

// attach root element to dom
attachRootElement('root', rootComponent);
```
./index.html
```html
<!DOCTYPE html>
<html>
    <head>
        <script type="module" src='index.js'></script>
    </head>
    <body>
        <div id='root'></div>
    </body>
</html>
```

## Declaring template variables by passing props
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
    </div>`,

    /* props */
    {
        myGreeting: 'Hello World'
    }
);

// attach root element to dom
attachRootElement('root', rootComponent);
```
Resulting computed HTML:
```html
<div>
    <h1>Hello World</h1>
</div>
```

## Declaring template variables with controller
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
    </div>`,

    /* props */ {},
    
    /* controller */
    ({set}) => {
        set('myGreeting', 'Hello World');
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

## Getting template variables
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
    </div>`,

    /* props */ {},

    /* controller */
    ({get, set}) => {
        set('myGreeting', 'Hello World');

        console.log(get('myGreeting')); // prints "Hello World"
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

## Declaring functions that can be referenced in template
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        
        <button onclick={{changeGreeting()}}>
            Change Greeting
        </button>
    </div>`,

    /* props */ {},

    /* controller */
    ({set, setFn}) => {
        set('myGreeting', 'Hello World');

        // function referenced in template as {{changeGreeting()}}
        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

## Tracking variables and adding callbacks
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        
        <button onclick={{changeGreeting()}}>
            Change Greeting
        </button>
    </div>`,

    /* props */ {},

    /* controller */
    ({set, setFn, track}) => {
        set('myGreeting', 'Hello World');

        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });

        // executes provided callback every time set('myGreeting', newVal) is called
        track('myGreeting', () => {
            alert('My title changed!');
        });
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

## Computed variables
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        
        <button onclick={{changeGreeting()}}>
            Change Greeting
        </button>

        <p>{{result}}</p>
    </div>`,

    /* props */ {},

    /* controller */
    ({set, get, setFn, computedVar}) => {
        set('myGreeting', 'Hello World');

        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });

        // computed variables are used in template as normal variables
        // but they are re-calculated when tracked variables change
        // example: 'result' will be re-calculated whenever 'myGreeting' changes
        computedVar('result', // variable name
                    ['myGreeting'], // array of variables to track
                    /* function used to compute value */
                    () => get('myGreeting') === 'Hello World' ? 'Nice!' : 'Awww...';
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

## Adding subcomponents (children)

./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';
import mySubcomponent from './components/mySubcomponent.js'

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        {{paragraph}}
    </div>`,

    /* props */ {},

    /* controller */
    ({set, template}) => {
        // init subcomponent as component variable using template() method
        set('paragraph', template(mySubcomponent, /* props (optional) */ { myText: 'What\'s up?' }));
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

./components/mySubcomponent.js
```js
import { chunx } from 'chunx.js';

const mySubcomponent = chunx(/* html */`<p>{{myText}}</p>`);

export default mySubcomponent;
```

Resulting computed HTML:
```html
<div>
    <h1>Hello World</h1>
    <p>What's up?</p>
</div>
```

## Adding subcomponents as computed variables (tracked children)
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';
import mySubcomponent from './components/mySubcomponent.js'

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        {{paragraph}}
    </div>`,

    /* props */ {},

    /* controller */
    ({get, set, setFn, template, computedVar}) => {
        set('myGreeting', 'Hello World');

        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });

        // init subcomponent as component as tracked variable
        computedVar('paragraph', ['myGreeting'],
                () => template(mySubcomponent, { myText: get('myGreeting') }));
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

./components/mySubcomponent.js
```js
import { chunx } from 'chunx.js';

const mySubcomponent = chunx(/* html */`<p>My greeting is: {{myText}}.</p>`);

export default mySubcomponent;
```

## Adding repeated subcomponents using props from data array

./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';
import mySubcomponent from './components/mySubcomponent.js'

const rootComponent = chunx(
    /* html */`
    <ul>
        {{listItems}}
    </ul>`,

    /* props */ {},

    /* controller */
    ({get, set, repeat}) => {
        // declare array of objects where objects contain props to be passed
        set('dataArray', [1,2,3,4,5].map(num => {number: num}));

        // declare variable as repeated subcomponent using dataArray as props
        set('listItems', repeat(mySubcomponent, get('dataArray')));
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```
./components/mySubcomponent.js
```js
import { chunx } from 'chunx.js';

const mySubcomponent = chunx(/* html */`<li>Item #{{number}}</li>`);

export default mySubcomponent;
```

Resulting computed HTML:
```html
<ul>
    <li>Item #1</li>
    <li>Item #2</li>
    <li>Item #3</li>
    <li>Item #4</li>
    <li>Item #5</li>
</ul>
```

## Adding repeated subcomponents as computed variable
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';
import mySubcomponent from './components/mySubcomponent.js'

const rootComponent = chunx(
    /* html */`
    <ul>
        {{listItems}}
    </ul>
    <button onclick="{{addItem()}}">add item</button>`,

    /* props */ {},

    /* controller */
    ({get, set, setFn, computedVar, repeat}) => {
        // declare array of objects where objects contain props to be passed
        set('dataArray', [1,2,3,4,5].map(num => {number: num}));

        // declare function to add new item to data array with next number in sequence
        setFn('addItem', () => {
            const array = get('dataArray');
            set('dataArray', [...array, { number: array[array.length-1].number+1 }]);
        });

        // 'listItems' will be re-rendered when dataArray changes (add item button clicked)
        computedVar('listItems', ['dataArray'],
            () => repeat(mySubcomponent, get('dataArray')));
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

./components/mySubcomponent.js
```js
import { chunx } from 'chunx.js';

const mySubcomponent = chunx(/* html */`<li>Item #{{number}}</li>`);

export default mySubcomponent;
```

# Tips

For html string syntax highlighting in VS Code use plugin `tobermory.es6-string-html`
And make sure html strings are preceded by `/* html */` such as 
```js
const mySubcomponent = chunx(/* html */`<li>Item #{{number}}</li>`);
```