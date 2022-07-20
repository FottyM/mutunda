import HeroImage from "../imgs/hero-image.svg"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background: rgb(79, 227, 193);
    position: relative;
    display: grid;
    justify-content: center;
    align-items: center;
`

const HeroSection = () => {
    return ( 
        <Wrapper>
            <div className={css`
                position: absolute;
                right: 0;
                top: 0;
                width: 100%;
            `}>
            <HeroImage />
            </div>
        </Wrapper>
     );
}
 
export default HeroSection;