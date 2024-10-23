import React from 'react'

const ArrowDown = ({ color, active, ...props }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                transition: '0.2s',
                // this work arround is because the arrow looks like
                // it's shifting on the bottom when it's rotated
                marginBottom: '-2px',
                transform: active ? 'rotate(180deg) translateY(2px)' : 'none'
            }}
            {...props}
        >
            <path
                d="M14.625 6L9.21213 11.4129C9.09497 11.53 8.90503 11.53 8.78787 11.4129L3.375 6"
                stroke={active ? '#000000' : '#B7B7B7'}
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default ArrowDown
