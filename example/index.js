import { chunx, attachRootElement } from '../chunx.js';
import mySubComponent from './components/mySubComponent.js';

const rootComponent = chunx(/*html*/`
    <div>
        <h1>{{myTitle}}</h1>
        {{paragraph}}
    </div>
    `,
    /* props= */
    {myTitle: 'Hello World'}, // passing props through constructor
    /* controller= */
    ({get, set, setFn, track, computedVar, template, repeat}) => {
        set('paragraph', template(mySubComponent, {listName: 'my list'})); // adding props after chunx created
    });

// attach root element to dom
attachRootElement('root', rootComponent());