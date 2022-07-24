import React from 'react'
import styled from "@emotion/styled"
import { css } from "@emotion/css"
import Icon1 from '../imgs/icon-1.svg'
import Icon2 from '../imgs/icon-2.svg'
import Icon3 from '../imgs/icon-3.svg'

const arr = [
    {
      id: 1,
      icon: <Icon1 />,
      background: "#F2F7F6",
      title: "",
      text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor? ",
    },
    {
      id: 2,
      icon: <Icon2 />,
      background: "#F3F3F3",
      title: "",
      text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor? ",
    },
    {
      id: 3,
      icon: <Icon3 />,
      background: "#F9F9FF",
      title: "",
      text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor? ",
    },
  ]

  const Wrapper = styled.div`
    margin: 4rem 0;
  `
  const CardsWrapper = styled.div`
    width: 100%;
    height: auto;
    padding: 1rem 2rem 2rem 2rem;
    display: grid;
    grid-template-columns: repeat(3, 500px);
    gap: 1rem;
    justify-content: center;

    h3 {
        text-align: center;
    }

    @media (max-width: 767.98px) {
        grid-template-columns: 1fr;
    }
  `
  const ItemCard = styled.div`
    padding: 3rem;

    @media (max-width: 767.98px) {
    }
  `
  const Text = styled.span`
    font-size: 1.25rem;
    line-height: 1.4;
    opacity: 0.8;
  `
  

const Competence = () => {
    return (
        <Wrapper>
            <h3 className={css`
                text-align: center;
                font-family: 'Josefin Sans', sans serif;
                font-size: 1.5rem;
                line-height: 1;
                font-weight: 500;
                text-transform: uppercase;
            `}>Competence</h3>
            <CardsWrapper>
            {
                arr.map(({id, icon, text, background}) => (
                    <ItemCard key={id} className={css`
                        box-shadow: ${ id === 2 ? `0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)` : `0`}
                    `}>
                        <div className={css`
                            width: 70px;
                            height: 70px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50px;
                            background-color: ${background};
                            margin-bottom: 1rem;
                        `}>
                            {icon}
                        </div>
                        <Text>
                            {text}
                        </Text>
                    </ItemCard>
                ) )
            }
        </CardsWrapper>
        </Wrapper>

    );
}

export default Competence;