import * as React from 'react';


interface IconProps {
    name: IconName;
    className?: string;
}

const url = '/assets/icons.svg';

export type IconName = 
    'spinner'
    | 'people'
    | 'time'
    | 'star-outline'
    | 'star-fill'
    | 'notification'
    | 'notification-off'
    | 'repeat';

export default function Icon(props: IconProps) {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            className={[
                'icon',
                `icon-${props.name}`,
                props.className
            ].join(' ')}
        >
            <use xlinkHref={`${url}#icon-${props.name}`} />
        </svg>
    );
}