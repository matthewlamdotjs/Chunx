** Disclaimer: for educational purposes, not performance optimized **

# Chunx
Simple "no-frills" Front-End Web Component Framework featuring:
- Reusable template components
- Automatic re-render on component variable changes
- Single dependency with no additional build time

I wanted to experiment with creating my own front-end framework, so I did it in "chunx" :)

## Table of Contents
1. [Docs](#docs)
    1. [Getting Started](#gettingstarted)
    2. [Chunx Constructor](#chunxconstructor)
    3. [Chunx Props](#chunxprops)
    4. [Chunx Controller](#chunxcontroller)
2. [Examples](#examples)
    1. [Creating root component and attaching to DOM](#example1)
    2. [Declaring template variables by passing props](#example2)
    3. [Declaring template variables with controller](#example3)
    4. [Getting template variables](#example4)
    5. [Declaring functions that can be referenced in template](#example5)
    6. [Tracking variables and adding callbacks](#example6)
    7. [Computed variables](#example7)
    8. [Adding subcomponents (children)](#example8)
    9. [Adding subcomponents as computed variables (tracked children)](#example9)
    10. [Adding repeated subcomponents using props from data array](#example10)
    11. [Adding repeated subcomponents as computed variable](#example11)
3. [Tips](#tips)

<div id="docs"></div>

# Docs

<div id="gettingstarted"></div>

## Getting Started

Place `chunx.js` somewhere in your project directory

<div id="chunxconstructor"></div>

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

<div id="chunxprops"></div>

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

<div id="chunxcontroller"></div>

## Chunx Controller
The Chunx component controller is a function that contains all of the component's logic. The logic is implemented using chunx component methods that are passed to the function in an object. This is done so you can destructure the object and cherry pick only the methods you need.

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

<div id="examples"></div>

# Examples<a name="examples"></a>

<div id="example1"></div>

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

<div id="example2"></div>

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

<div id="example3"></div>

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

<div id="example4"></div>

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

<div id="example5"></div>

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

        // Declare a function that can be referenced in html attributes:
        //
        // Declaring this function with setFn(fnName, fnValue) allows
        // the function to be referenced in template as {{changeGreeting()}}
        // within html attributes that accept javascript functions as values
        // such as `onclick`.
        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

Note: referencing functions declared with setFn() will not actually call the function and display its returned value.

This means if you have a function `setFn('myName', () => { return 'matt' }` and reference it like this `<h1>{{myName()}}<h1/>` it will NOT render `<h1>matt<h1/>` but instead print a global reference to the function. If you want the output of the function to display on screen wherever it is referenced in the template see [computed variables](#example7).

<div id="example6"></div>

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

        // Track changes to the variable myGreeting:
        //
        // `track(variableName, callback)` listens for calls to set() and
        // executes callback when variable <variableName> changed using set().
        track('myGreeting', () => {
            alert('My title changed!');
        });
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

<div id="example7"></div>

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

        // Computed variables are used in template as normal variables
        // but they are re-calculated when tracked variables change.
        // example: 'result' will be re-calculated whenever 'myGreeting' changes
        computedVar('result',       // variable name
                    ['myGreeting'], // array of variables to track
                    /* function used to compute value */
                    () => get('myGreeting') === 'Hello World' ? 'Nice!' : 'Awww...';
    });
);

// attach root element to dom
attachRootElement('root', rootComponent);
```

<div id="example8"></div>

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
        // Init subcomponent as component variable:
        //
        // `template(component, props)` creates an instance of the component with props,
        // links it to the current component as its parent, and returns an element reference
        // that can be stored in a variable used in the template to render the subcomponent.
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

<div id="example9"></div>

## Adding subcomponents as computed variables (tracked children)
./index.js
```js
import { chunx, attachRootElement } from 'chunx.js';
import mySubcomponent from './components/mySubcomponent.js'

const rootComponent = chunx(
    /* html */`
    <div>
        <h1>{{myGreeting}}</h1>
        
        <button onclick={{changeGreeting()}}>
            Change Greeting
        </button>

        {{paragraph}}
    </div>`,

    /* props */ {},

    /* controller */
    ({get, set, setFn, template, computedVar}) => {
        set('myGreeting', 'Hello World');

        setFn('changeGreeting', () => {
            set('myGreeting', 'Goodbye World');
        });

        // Initialize subcomponent as a computed variable:
        //
        // Chunx will automatically re-calculate computedVar 'paragraph'
        // using the function provided when variable 'myGreeting' is changed.
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

<div id="example10"></div>

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

        // Declare variable as repeated subcomponent using dataArray as props:
        //
        // `repeat()` will repeat mySubcomponent get('dataArray').length times
        // with each copy using the data at its respective index in the array
        // as its props.
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

<div id="example11"></div>

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
        // Declare array of objects where objects contain props to be passed
        set('dataArray', [1,2,3,4,5].map(num => {number: num}));

        // Declare function to add new item to data array with next number in sequence
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

# Tips<div id="tips"/>

For html string syntax highlighting in VS Code use plugin `tobermory.es6-string-html`
And make sure html strings are preceded by `/* html */` such as 
```js
const mySubcomponent = chunx(/* html */`<li>Item #{{number}}</li>`);
```
