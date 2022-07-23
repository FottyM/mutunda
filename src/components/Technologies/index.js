import React from 'react';
import { css } from '@emotion/css'
import Technology from './Technology'
import Docker from '../../imgs/docker.svg'
import ReactIcon from '../../imgs/react.svg'
import SQL from '../../imgs/SQL.svg'
import Jest from '../../imgs/jest.svg'
import Redis from '../../imgs/redis.svg'
import NodeIcon from '../../imgs/node.svg'
import OCLIF from '../../imgs/OCLIF.svg'
import JSIcon from '../../imgs/javascript.svg'

const arr = [
    {
      id: 1,
      title: "Docker",
      icon: <Docker />,
    },
    {
      id: 2,
      title: "React(Native)",
      icon: <ReactIcon />,
    },
    {
      id: 3,
      title: "SQL",
      icon: <SQL />,
    },
    {
      id: 4,
      title: "Jest & Mocha",
      icon: <Jest />,
    },
    {
      id: 5,
      title: "Redis",
      icon: <Redis />,
    },
    {
      id: 6,
      title: "Node",
      icon: <NodeIcon />,
    },
    {
      id: 7,
      title: "OCLIF & Commander",
      icon: <OCLIF />,
    },
    {
      id: 8,
      title: "Javascript/TS",
      icon: <JSIcon />,
    }
  ]

const Technologies = () => {
    return (
      <>
      <h3 className={css`
            text-align: center;
            font-family: 'Josefin Sans', sans serif;
            font-size: 1.5rem;
            line-height: 1;
            font-weight: 600;
            text-transform: uppercase;
        `}>Technologies</h3>
        <div className={css`
            display: grid;
            grid-template-columns: repeat(4, minmax(100px, 309px));
            grid-template-rows: repeat(2, 1fr);
            justify-content: center;
            gap: 20px;
            align-items: center;

            @media (max-width: 767.98px) {
              grid-template-columns: repeat(2, minmax(100px, 309px));
            }
        `}>
            {arr.map(({ id, title, icon}) => (
                <Technology 
                    key={id}
                    title={title}
                    icon={icon}
                />
            ))}
            
        </div>
      </>
    );
}

export default Technologies;