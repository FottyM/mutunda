import HeroImage from "../imgs/hero-bg.svg"
import HeroTitle from "../imgs/fortunat.svg"
import HeroTitleSmall from "../imgs/fortunat-small.svg"
import styled from "@emotion/styled"

const Wrapper = styled.div`
    width: 100vw;
    height: 45rem;
    background: #1A191E;
    position: relative;
    display: grid;
    justify-content: center;
    align-items: center;
    overflow: hidden;

`
const Text = styled.div`
    text-align: center;
    margin: 0 auto;
    display: inline-block;

    h1 {
        font-family: 'Josefin Sans', sans serif;
        font-size: clamp(30px, 4vw, 80px);
        line-height: 0;
        margin: 0;
        text-transform: uppercase;
        font-weight: 700;
    }

    span {
        font-family: 'Raleway', sans serif;
        font-size: 22px;
        font-weight: 500;
        color: #F3C978;
    }
`
const StyledSVG = styled(HeroImage)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
`


const HeroSection = () => {
    return ( 
        <Wrapper>
            <StyledSVG />
            <Text>            
                <h1><HeroTitle /></h1>
                <span>A fullstack software Engineer</span>
            </Text>
        </Wrapper>
     );
}
 
export default HeroSection;