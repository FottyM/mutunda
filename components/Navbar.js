import { css, cx } from "@emotion/css"

const NavWrapper = css`
    background: red;
    width: 100%;
`

const Navbar = () => {
    return ( 
        <div className={cx(NavWrapper)}>
            Navbar
        </div>
     );
}
 
export default Navbar;