import * as React from 'react';
import {useState, useEffect} from 'react';

import Icon from './Icon';


export enum ChannelEventType {
    favorite
}

export interface PropItemChannel {
    id: string;
    link: string;
    logo: string;
    title: string;
    viewers?: string;
    upTime?: string;
    favorite?: boolean;
    onChange?: (id: string, event: ChannelEventType) => void;
}

export default function ItemChannel(props: PropItemChannel) {
    const [favorite, setFavorite] = useState<boolean>(false);

    useEffect(() => setFavorite(props.favorite), []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: ChannelEventType) => {
        setFavorite(!favorite);
        props.onChange(props.id, type);
        event.preventDefault();
    }

    return (
        <a className="stream-item" href={props.link} target="_blank">
            <img className="stream-item__logo" src={props.logo} alt="logo" />
            <section className="stream-item__content">
                <section className="stream-item__top">
                    <span className="stream-item__title">{props.title}</span>
                    <div className="stream-item__controls">
                        <button className="stream-item__button" onClick={e => handleClick(e, ChannelEventType.favorite)}>
                            <Icon name={favorite ? "star-fill" : "star-outline"} />
                        </button>
                    </div>
                </section>
                <section className="stream-item__bottom">
                    {
                        props.viewers &&
                        <span className="stream-item__viewers">
                            <Icon name="people" className="stream-item__icon" />
                            {props.viewers}
                        </span>
                    }
                    {
                        props.upTime &&
                        <span className="stream-item__up-time">
                            <Icon name="time" className="stream-item__icon" />
                            {props.upTime}
                        </span>
                    }
                </section>
            </section>
        </a>
    );
}