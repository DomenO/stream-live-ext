import * as React from 'react';


type IconName = 'spinner' | 'people' | 'time';

interface IconProps {
    name: IconName;
    className?: string;
}

const url = '/assets/icons.svg';

export function Icon(props: IconProps) {
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