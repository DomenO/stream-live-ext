import * as React from 'react';


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
                            <img className="stream-item__icon" alt="people" src="/assets/people.svg" />
                            {props.viewers}
                        </span>
                    }
                    {
                        props.upTime &&
                        <span className="stream-item__up-time">
                            <img className="stream-item__icon" alt="time" src="/assets/time.svg" />
                            {props.upTime}
                        </span>
                    }
                </section>
            </section>
        </a>
    );
}