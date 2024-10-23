import React from 'react'

const Checked = ({ color = '#4260F2', ...props }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="18" height="18" rx="6" fill={color} />
            <path
                d="M5.7998 9.70001L8.03105 11.3873C8.25695 11.5582 8.5795 11.5074 8.74207 11.2755L12.2998 6.20001"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default Checked
