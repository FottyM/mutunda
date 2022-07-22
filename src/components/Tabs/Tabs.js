import React, { useState } from 'react';
import { css } from '@emotion/css'

const Tabs = ({children}) => {
    const [activeTabIndex, setActiveTabIndex ] = useState(0)
    const activeTab = children ? children[activeTabIndex] : []

    if (!children) return null
    return (
        <div className={css`
            display: grid;
            grid-template-columns: 0.4fr 1.5fr;
            width: 100%;
            padding: 1rem 15rem;
            max-width: 1800px;
            justify-content: center;
        `}>
            <div className={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 1rem;
            `}>
                { children.map((tab, index) => (
                    <div className={css`
                        display: block;
                        flex: 1;
                        padding: 2rem 20px;
                        font-size: 1.2rem;
                        border: 0;
                        cursor: pointer;
                        font-family: 'Raleway', sans-serif;
                        font-weight: 500;
                        border-left: 5px solid #7e849e;

                        ${activeTabIndex === index && `
                            transition: border 0.2s;
                            border-left: 5px solid #9ce5cc;
                            color: #9ce5cc;
                        `}
                    `}
                    onClick={() => { setActiveTabIndex(index)}}
                    key={index}
                    >
                        {tab.props.title}
                    </div>
                ))}
            </div>
            <div className={css`
                padding: 10px;
                max-width: 872px;

                h3 {
                    font-size: 1.6rem;
                    line-height: 0.6;
                }

                p {
                    font-size: 20px;
                    line-height: 1.4;
                }
            `}>
                {activeTab.props.children}
            </div>
            
        </div>
    );
}

export default Tabs;