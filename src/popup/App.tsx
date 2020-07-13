import * as React from 'react';
import {useState, useEffect} from 'react';

import {ListChannels} from './ListChannels';
import {runtimeStore, ActionType} from './runtime-store';
import {MessageType} from '../models/message';
import {Channel} from '../models/сhannel';
import {Settings} from './Settings';
import {Icon} from './Icon';


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

export function App() {
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
        runtimeStore.dispatch({
            type: ActionType.request,
            event: MessageType.requestChannels
        });
    }, []);

    runtimeStore.subscribe(() => {
        const currentState = runtimeStore.getState();

        if (currentState.event === MessageType.listChannels) {
            setLoading(false);
            setChannels(currentState.data);
        }

        else if (currentState.event === MessageType.unauthorized) {
            setLoading(false);
            setCurrentTab(Tab.settings);
        }

        else if (currentState.event === MessageType.authorize) {
            setLoading(true);
            setCurrentTab(Tab.live);

            runtimeStore.dispatch({
                type: ActionType.request,
                event: MessageType.requestChannels
            });
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