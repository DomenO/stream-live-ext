import * as React from 'react';
import ReactDOM from 'react-dom';

import {App} from './App';
import {Message} from '../models/message';
import {runtimeStore, ActionType} from './runtime-store';


ReactDOM.render(<App />, document.getElementById('root'));

chrome.runtime.onMessage.addListener(
    (msg: Message) => runtimeStore.dispatch({type: ActionType.response, ...msg})
)