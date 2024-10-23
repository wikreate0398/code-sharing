import React from 'react';

const SendIcon = ({active, ...props}) => {
    let color = active ? "#4260F2" : "#BBC0CB"
    return (
        <svg {...props} style={{cursor: 'pointer'}} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.2 9.00007L1.79999 1.80005L3.94053 7.32655L9.75581 8.27034C10.584 8.40461 10.584 9.59592 9.75581 9.73019L3.94053 10.6736L1.79999 16.2001L16.2 9.00007Z"
                stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M16.2 9.00007L1.79999 1.80005L3.94053 7.32655L9.75581 8.27034C10.584 8.40461 10.584 9.59592 9.75581 9.73019L3.94053 10.6736L1.79999 16.2001L16.2 9.00007Z"
                fill={color}/>
        </svg>

    );
};

export default SendIcon;