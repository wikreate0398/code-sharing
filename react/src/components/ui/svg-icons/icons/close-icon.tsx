import React from 'react'

const CloseIcon = ({ color = '#9499A4', size = 20 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15 15L5 5"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="square"
                strokeLinejoin="round"
            />
            <path
                d="M5 15L15 5"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="square"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default CloseIcon
