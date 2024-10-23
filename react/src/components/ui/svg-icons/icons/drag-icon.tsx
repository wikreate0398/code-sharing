import React from 'react'

const DragIcon = (props) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="5.50004" cy="3.0001" r="1.00004" fill="#9EA2B2" />
            <circle cx="5.50004" cy="8.00001" r="1.00004" fill="#9EA2B2" />
            <circle cx="5.50004" cy="13.0001" r="1.00004" fill="#9EA2B2" />
            <circle cx="10.5" cy="8.00001" r="1.00004" fill="#9EA2B2" />
            <circle cx="10.5" cy="3.0001" r="1.00004" fill="#9EA2B2" />
            <circle cx="10.5" cy="13.0001" r="1.00004" fill="#9EA2B2" />
        </svg>
    )
}

export default DragIcon
