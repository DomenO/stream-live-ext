import * as React from 'react';
import {useState, useEffect} from 'react';
import {Provider} from 'react-redux';

import {MessageType} from '../models/message';
import {runtimeMessageStore, sendRuntimeMessageAction} from './runtime-message-store';
import {channelsStore, setChannelsAction} from './channels-store';

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
    const [currentTab, setCurrentTab] = useState<Tab>(Tab.live);
    const [loading, setLoading] = useState<boolean>(true);

    const navigation: Navigation[] = [
        {
            text: 'Live',
            tab: Tab.live,
            component: (
                <Provider store={channelsStore}>
                    <ListChannels filterBy="online" />
                </Provider>
            )
        },
        {
            text: 'Offline',
            tab: Tab.offline,
            component: (
                <Provider store={channelsStore}>
                    <ListChannels filterBy="offline" />
                </Provider>
            )
        },
        {
            text: 'Settings',
            tab: Tab.settings,
            component: <Settings />
        }
    ]

    useEffect(() => {
        runtimeMessageStore.dispatch(
            sendRuntimeMessageAction({event: MessageType.requestChannels})
        );
    }, []);

    runtimeMessageStore.subscribe(() => {
        const runtimeMessagState = runtimeMessageStore.getState();

        switch (runtimeMessagState.event) {
            case MessageType.listChannels:
                setLoading(false);
                channelsStore.dispatch(
                    setChannelsAction(runtimeMessagState.data)
                )
                break;

            case MessageType.unauthorized:
                setLoading(false);
                setCurrentTab(Tab.settings);
                break;

            case MessageType.authorize:
                setLoading(true);
                setCurrentTab(Tab.live);
    
                runtimeMessageStore.dispatch(
                    sendRuntimeMessageAction({event: MessageType.requestChannels})
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