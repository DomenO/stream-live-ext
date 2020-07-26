import * as React from 'react';
import ReactDOM from 'react-dom';

import {Message} from '../models/message';
import {runtimeMessageStore, getRuntimeMessageAction,} from './runtime-message-store';

import App from './App';


ReactDOM.render(<App />, document.getElementById('root'));

chrome.runtime.onMessage.addListener(
    (msg: Message) => runtimeMessageStore.dispatch(getRuntimeMessageAction(msg))
)