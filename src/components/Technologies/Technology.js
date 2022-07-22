import React from 'react';
import { css } from '@emotion/css'

const Technology = ({ title, icon }) => {
    return (
        <div className={css`
            max-width: 309px;
            height: 179px;
            background: #FAFAFF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            span {
                text-transform: uppercase;
                color: #3B4754;
                font-size: 18px;
                display: inline-block;
                font-family: 'Josefin Sans', sans-serif;
                font-weight: 600;
                margin-top: 1.2rem;
            }
        `}>
            {icon}
            <span>{title}</span>         
        </div>
    );
}

export default Technology;