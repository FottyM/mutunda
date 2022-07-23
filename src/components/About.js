import React from 'react'
import styled from "@emotion/styled"

const StyledAbout = styled.div`
    padding: 4rem 12vw;
    background: #FAFAFF;
    display: grid;
    grid-template-columns: 0.8fr 40vw;
    margin: 2rem 0;

    h2 {
        font-family: 'Josefin Sans', sans serif;
        font-size: clamp(30px, 4vw, 40px);
        text-transform: uppercase;
        font-weight: 700;
        color: #3B4754;
        padding-left: 15rem;

        @media (max-width: 767.98px) {
            padding-left: 0;
          }
    }

    span {
        font-weight: 400; 
        font-size: clamp(20px, 1.8vw, 28px);
        line-height: 1.5;
        opacity: 0.7;
    }

    span {
        display: inline-block;
    }

    @media (max-width: 767.98px) {
        grid-template-columns: 1fr;
        padding: 2rem 3rem;
      }
`

const About = () => {
    return (
        <StyledAbout>
            <h2>About me</h2>
            <span>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. </span>        
        </StyledAbout>
    );
}

export default About;