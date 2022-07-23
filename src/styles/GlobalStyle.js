import { css, injectGlobal } from "@emotion/css"
import cssReset from "./cssReset"


const globalCSS = css`
    ${cssReset}

    html, body {
        font-family: 'Raleway', sans-serif;
        font-size: 16px;
    }
`

injectGlobal`${globalCSS}`

const GlobalStyles = () => null

export default GlobalStyles