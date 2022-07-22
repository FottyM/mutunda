import React from 'react'
import styled from "@emotion/styled"

const StyledAbout = styled.div`
    padding: 4rem 14rem;
    background: #FAFAFF;
    display: grid;
    grid-template-columns: 0.6fr 900px;
    margin: 2rem 0;

    h2 {
        font-family: 'Josefin Sans', sans serif;
        font-size: clamp(30px, 4vw, 40px);
        line-height: 0;
        text-transform: uppercase;
        font-weight: 700;
        color: #3B4754;
        padding-left: 15rem;
    }

    span {
        font-weight: 400; 
        font-size: clamp(20px, 2vw, 2rem);
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