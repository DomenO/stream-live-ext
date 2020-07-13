import * as React from 'react';

import {Icon} from './Icon';


export interface PropItemChannel {
    link: string;
    logo: string;
    title: string;
    viewers?: string;
    upTime?: string;
}

export function ItemChannel(props: PropItemChannel) {
    return (
        <a className="stream-item" href={props.link} target="_blank">
            <img className="stream-item__logo" src={props.logo} alt="logo" />
            <section className="stream-item__content">
                <span className="stream-item__title">{props.title}</span>
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