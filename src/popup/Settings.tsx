import * as React from 'react';
import {useState, FormEvent, ChangeEvent} from 'react';

import {MessageType} from '../models/message';
import {runtimeMessageStore, sendRuntimeMessage} from './runtime-message-store';


export default function Settings() {
    const [state, setState] = useState<{[K: string]: string}>();
    const [error, setError] = useState<boolean>(false);
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        setState({[name]: value});
    }
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        runtimeMessageStore.dispatch(
            sendRuntimeMessage({
                event: MessageType.accountLogin,
                data: state.accountName
            })
        );

        event.preventDefault();
    }

    runtimeMessageStore.subscribe(() => {
        const currentState = runtimeMessageStore.getState();

        if (currentState.event === MessageType.error) {
            setError(true);
        }
    });

    return (
        <main className="settings">
            <form className="settings__form" onSubmit={handleSubmit}>
                <div className="settings__inputs">
                    <input 
                        className="form__input"
                        type="text"
                        name="accountName"
                        placeholder="Twitch account name..."
                        onChange={handleInputChange}
                    />
                    <input className="form__submit" type="submit" value="Import" />
                </div>
                {error && <div className="form__error">Account not found</div>}
            </form>
        </main>
    );
}