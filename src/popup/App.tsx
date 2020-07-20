import * as React from 'react';
import {useState, useEffect} from 'react';

import {MessageType} from '../models/message';
import {Channel} from '../models/сhannel';
import {runtimeMessageStore, sendRuntimeMessage} from './runtime-message-store';

import ListChannels from './ListChannels';
import Settings from './Settings';
import Icon from './Icon';


enum Tab {
    live,
    offline,
    settings
}

interface Navigation {
    text: string;
    tab: Tab;
    component: JSX.Element;
}

export default function App() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [currentTab, setCurrentTab] = useState<Tab>(Tab.live);
    const [loading, setLoading] = useState<boolean>(true);

    const navigation: Navigation[] = [
        {
            text: 'Live',
            tab: Tab.live,
            component: <ListChannels filterBy="online" channels={channels} />
        },
        {
            text: 'Offline',
            tab: Tab.offline,
            component: <ListChannels filterBy="offline" channels={channels} />
        },
        {
            text: 'Settings',
            tab: Tab.settings,
            component: <Settings />
        }
    ]

    useEffect(() => {
        runtimeMessageStore.dispatch(
            sendRuntimeMessage({event: MessageType.requestChannels})
        );
    }, []);

    runtimeMessageStore.subscribe(() => {
        const currentState = runtimeMessageStore.getState();

        switch (currentState.event) {
            case MessageType.listChannels:
                setLoading(false);
                setChannels(currentState.data);
                break;

            case MessageType.unauthorized:
                setLoading(false);
                setCurrentTab(Tab.settings);
                break;

            case MessageType.authorize:
                setLoading(true);
                setCurrentTab(Tab.live);
    
                runtimeMessageStore.dispatch(
                    sendRuntimeMessage({event: MessageType.requestChannels})
                );
                break;
        }
    });

    return (<>
        <nav className="navigation">
            {
                navigation.map(btn =>
                    <button
                        className="navigation__button button__live"
                        disabled={currentTab === btn.tab}
                        onClick={() => setCurrentTab(btn.tab)}
                    >
                        {btn.text}
                    </button>
                )
            }
        </nav>

        {
            loading ?
                <div className="loading"><Icon name="spinner" className="loading__icon" /></div> :
                navigation.find(nav => nav.tab === currentTab).component
        }
    </>);
}