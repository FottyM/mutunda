import { css, cx } from "@emotion/css"
import Logo from "../imgs/mutunda-logo.svg"
import Hamburger from "../imgs/hamburger.svg"

const NavWrapper = css`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const Navbar = () => {
    return ( 
        <div className={cx(NavWrapper)}>
            <Logo />
            <Hamburger />
        </div>
     );
}
 
export default Navbar;