import { chunx } from '../../chunx.js';

// shorthand "dumb" reusable component
const listItem = chunx(/*html*/`<li>Item {{number}}</li>`);

const mySubComponent = chunx(/*html*/`
    <p>
        It's been {{myExpression}}!
    </p>
    <button onclick="{{switch()}}">Switch</button>
    <br>
    <h2>{{listName}}</h2>
    <ul> 
        {{listItems}}
    </ul>
    <button onclick="{{addItem()}}">Add Item</button>
    `,
    /* props= */
    {dataArray: [{number: 1}]},
    /* controller= */
    ({get, set, setFn, track, computedVar, template, repeat}) => {
        /**
         * myExpression logic 
         */
        set('myExpression', 'real');
        // declaring functions that can be referenced in html snippet
        setFn('switch', () => {
            set('myExpression', get('myExpression') === 'real' ? 'fake' : 'real');
        });
        // tracking variable changes and executing callback
        track('myExpression', () => {
            alert('myExpression changed!');
        });

        /**
         * listItems logic 
         */
        // declaring a computed variable that changes when tracked variables change
        computedVar(/* name= */       'listItems',
                    /* tracked= */    ['dataArray'],
                    /* computeFn= */  () => repeat(listItem, get('dataArray')));
        setFn('addItem', () => {
            const array = get('dataArray');
            set('dataArray', [...array, { number: array[array.length-1].number+1 }]);
        });
    });

export default mySubComponent;