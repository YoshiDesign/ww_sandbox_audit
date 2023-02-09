import styled, {css, keyframes} from 'styled-components'
// import { Link } from 'react-router-dom'

// Nautilus Buttons
export const ButtonOne = styled.a`
    position:relative;
    height:100%;
    min-width:120px;
    margin:0;
    box-sizing:border-box;
    cursor:pointer;

    ${props => props.primary && css`
        border:1px solid white;
        background: var(--color-darkestop-focus);
        
        flex:1;
        &:focus {
            outline:none;
        }
        &:hover {

        }
    `}
    ${props => props.secondary && css`
        border:1px solid white;
        background: var(--color-darkestop-focus);
        
        flex:1;
        &:focus {
            outline:none;
        }
        &:hover {

        }
    `}
    

    ${props => props.tertiary && css`
        background: var(--color-focus);
        flex:0;
        transition:flex 300ms ease;
        min-width:0px;
        padding:0;
        border:none;
        &:focus {
            outline:none;
        }
        &:hover {
            outline:none;
            background: var(--color-primary);
        }
    `}

    ${props => props.head && css`
        background: black;
        color: var(--color-alt-text);
        flex:1;
        padding:5px;
        min-width:0px;
        
        text-align:center;
        &:focus {
            outline:none;
            border:none;
        }

        &:hover {
            outline:none;
            border:none;
            background: var(--color-dark-focus);

        }

        @media (max-width: 768px) {
            display:block;
        }

    `}

    &:focus {
        outline:none;
        border:none;
    }

`
export const StyledNautilusContainer = styled.footer`
    position:fixed;
    box-sizing:border-box;
    bottom:0;
    width: 550px;
    min-width:320px;
    margin:auto auto auto -275px;
    height:50px;
    background:none;
    padding:0;
    left:50%;
    z-index:6000;
    display:none;

    @media (max-width: 768px) {
        display:flex;
        width:100%;
        left:0;
        bottom:0;
        margin:0;
      }
`
// export const StyledFlexRLink = styled.a`

//         display:flex;
//         flex:1;
//         text-decoration:none;
        
//         &:focus {
//             outline:none !important;
//         }
//         &:hover {
//             outline:none !important;
//             background: var(--color-primary);
//         }

//         @media (max-width: 768px) {
//             text-align:center;
//         }
// `

export const StyledNavbar = styled.header`\
    padding-left: 10px;
    display:flex;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5050;
    background-color: var(--navigator-background);
    transition: box-shadow cubic-bezier(.165, .84, .44, 1) .25s;
    height: 46px
    font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;
    box-sizing: border-box;
    border-top:5px solid var(--color-lightblue);
`

export const StyledSecondaryNavbar = styled.div`
    border-radius: 0 0 3px 3px;
    box-shadow: 0px 2px 8px -4px;
    background-color: var(--navigator-background);
    
    font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;
    box-sizing: border-box;
    border-top:1px solid var(--color-lightblue);
    @media (max-width: 776px) {

    }

    @media (max-width: 991px) {
        box-shadow: none;
    }

`

/**
 * Designed to collapse left or right
 */
export const StyledMainContent= styled.div`
    position:relative;
    width:70%;
    border-left:1px solid ghostwhite;
    min-width:320px;
`

/**
 * Contains the map and its underbelly section
 */
export const StyledMapWindow = styled.div`
    position:relative;
    width:70%;
    min-width:320px;

    @media (max-width: 768px) {
        width:100%;
        margin:0;
        padding:0;
    }
`

export const StyledSearchSelect = styled.div`
    position:absolute !important;
    z-index:10;
    top:71px;
    left:0;
    height:301px;
    background:black;
    color:white;
    width:100%;
    transition:opacity 0.3s linear, height 0.3s ease;
`

export const NotebookHeader = styled.div`
    padding:10px;
    display:flex;
    position:relative;
    max-height:55px;
    justify-content:space-between;
    align-items:center;
    background:ghostwhite;
    border:1px solid white;
    margin: 10px 5px;
    color:#222;

    &:hover {
        background:#50a2fa;
        cursor:pointer;
    }

`

export const NotebookSection = styled.div`

    position:relative;
    
    ${props => props.category=="1" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
        border-top:1px solid white;

    `}
    ${props => props.category=="2" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
        
    `}
    ${props => props.category=="3" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
        
    `}
    ${props => props.category=="4" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
    `}
    ${props => props.category=="5" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
        
    `}
    ${props => props.category=="6" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
    `}
    ${props => props.category=="7" && css`
        // background: #6395d569;
        border-bottom:1px solid white;
        
    `}

`
export const CategoryHeading = styled.h3`

    margin:0;
    padding:0 13px;
    height:55px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    cursor:pointer;

    &:hover {
        background:var(--color-light-focus)
    }

    ${props => props.color == "yellow" && css`
        /*border-bottom:3px solid #ffff80;*/
        color:ghostwhite;
    `}
    ${props => props.color == "green" && css`
        /*border-bottom:3px solid #4dff88;*/
        color:ghostwhite;
    `}
    ${props => props.color == "blue" && css`
        /*border-bottom:3px solid #99ffff;*/
        color:ghostwhite;
    `}
    ${props => props.color == "orange" && css`
        /*border-bottom:3px solid #ffa366;*/
        color:ghostwhite;
    `}
    ${props => props.color == "purple" && css`
        /*border-bottom:3px solid #c299ff;*/
        color:ghostwhite;
    `}
    ${props => props.color == "pink" && css`
        /*border-bottom:3px solid #ecc6d9;*/
        color:ghostwhite;
    `}
    ${props => props.color == "white" && css`
        /*border-bottom:3px solid #9baeca;*/
        color:ghostwhite;
    `}

`
export const NotebookParagraph = styled.p`

    font-size: 12px;
    font-weight:500;
    
    ${props => props.unit == "title" && css`
        color: #ED1;
        width:300px;
    `}
    ${props => props.unit == "value" && css`
        color: #ED1;
        text-align:right;
        width:150px;
    `}
    ${props => props.unit == "year" && css`
        text-align:right;
        width:90px;
        color: #ED1;
    `}

    transition: font-size 0.5s linear;

`
export const NotebookSegment = styled.div`
    font-size: 12px;
    background:#ebeef3;
    display:flex;
    justify-content:space-between;

    transition:background 0.2s ease;


    ${props => props.enum % 2 == 0 && css`
        
    `}

    ${props => props.active == true && css`
        border-right:4px solid white;
        &:before {
            vertical-align:center;
            content:"";
            width:25px !important;
            height:25px !important;
            transform:rotate(45deg);
            background:white;
            margin: auto;
            position: relative;
            left: -13px;
        }
    `}

    &:hover > p {
        font-size:14px !important;
        color:white;
    }
     &:hover {
        cursor:pointer;
        background:var(--blue-3);
     }


    ${props => props.category=="1" && css`

    `}
    ${props => props.category=="2" && css`
        
    `}
    ${props => props.category=="3" && css`

    `}
    ${props => props.category=="4" && css`

    `}
    ${props => props.category=="5" && css`

    `}
    ${props => props.category=="6" && css`
        
    `}
    ${props => props.category=="7" && css`

    `}


`

export const StyledQueryWindow = styled.div`

    position:relative;
    transition: width 0.3s ease;
    
    ${props => props.query == "country" && css`

        width:45vw;
    
    `}
    
    ${props => props.query == "home" && css`

        width:33vw;
        min-width:350px;
        padding:5px;
    
    `}

    ${props => props.query == "locations" && css`

        width:35vw;
    
    `}

    ${props => props.query == "occupations" && css`

        width:35vw;
    
    `}
    
    ${props => props.query == "info" && css`

        width:35vw;
    
    `}

    ${props => props.query == "creators" && css`

        width:50vw;
    
    `}

    @media (max-width: 768px) {
        display:none;
    }

`

export const StyledButtonSVG = styled.svg`
    position: absolute;
    top: 50%;
    right: .7em;
    margin-top: -9px;
    pointer-events: none;
    right: auto;
    left: .7em;
    vertical-align: bottom;
`

const rotateCW = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`
const rotateCCW = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(-360deg);
    }
`

export const StyledActiveSVG = styled.svg`
    
    height:30px;
    width:auto;
    z-index:3000;
    transition:opacity;
    
    ${props => props.left && css`
        position:absolute;
        fill:var(--color-lightgreen);
        top:10px;
        right:-2px;
    `}
    ${props => props.opaque && css`
        opacity:0.0;
        transition:opacity 1s ease;
    `}
        
    ${props => props.right && css`
        position:absolute;
        fill:var(--color-lightgreen);
        top:11px;
        left:-2px;
    `}

    ${props => props.center && css`
        fill:var(--color-lightgreen);
        margin:auto auto;
        position:relative;
        top:2px;
    `}

    ${props => 
        props.spin === false ?  
        css`
            animation: ${rotateCW} 1s 1;
    `
    : props.spin === true ? 
        css`
            animation: ${rotateCCW} 1s 1;
    ` : null 
    }
`

export const HiddenSelect = styled.select`
    position:fixed;
    left:0;
    bottom:0;
    opacity:0;
`

export const HiddenInput = styled.input`
    position:fixed;
    left:0;
    bottom:0;
    opacity:0;
`

export const ExpSwitchStyled = styled.div`
    width:100%;
    position: relative;
    right: 28%;
`

export const StyledCTA = styled.div`
    display:flex;
    justify-content:space-around;
    width:100%;
    padding: 22vh 15px;

    @media (max-width: 991px) {
        flex-direction:column;
        padding: 3vh 15px;
        justify-content:unset;
        text-align:center;
        height:89vh;
    }
    @media (max-width: 767px) {
        margin:0;
        width:100vw;
    }
`


export const StyledSubwindow = styled.div`

    padding: 5px;
    width:100%;
    margin: 0;
    border-radius: 3px;
    border: 1px solid var(--color-darkop-blue);
    box-sizing: border-box;
    background:transparent;

    ${props => props.radarinfo && css`
        width:100%;
        margin:auto;
    `}
    ${props => props.companies && css`
    `}
    ${props => props.statistics && css`
    `}

    @media (max-width: 991px) {
        margin:0 auto;
        min-width:99%;
        padding-bottom:5px;
        border-bottom:1px solid var(--color-lightblue);
    }
`

export const StyledCartographerWrapper = styled.div`
    width:100%;
    height:93vh;
`

export const StyledInputGroup = styled.div`

    display:block;
    @media (max-width: 768px) {
        width:100%:
    }

`
export const StyledInput = styled.input`
    
`
export const StyledSelect = styled.select`
    min-width:220px;
`
export const StyledTextarea = styled.textarea`
    min-width:220px;
`
/**
 * Pane Containers - Panes.js
 */
export const StyledPane = styled.div`
    
    display:flex;
    flex-direction:column;
    padding-bottom:50px;
    
    background:var(--color-deepGreyBlue);
    transition: visibility 0.1s linear, opacity 100ms linear, transform 300ms linear ;
    border-top:2px solid #6bb1fb; 

    ${props => !props.info && css`
        width:100%;
    `}

    ${props => props.info && css`

        transition:width 0.4s ease;
        height:100%;
        overflow-y:scroll;
        width: 100%;
        margin: 0;
        position: absolute;
        left: 0;
        z-index: 1000;    
    `}
    
    ${props => props.noInfo && css`
        padding-bottom:15px;
        border-bottom:1px solid lightblue;
    `}xx\

    @media (min-width: 768px) {
        margin:0;
    }

    @media (max-width: 768px) {
        position:fixed;
        width:100%;
        z-index: 800;
        left:0;
        bottom:0;
        margin:0;
        overflow-y:hidden;

        ${props => props.rightPane && css`
            padding-top:50px;
            margin-right:15px;
            right:0;
            height:60vh;
            background: #0e233eeb;
        `}

        ${props => props.leftPane && css`
            padding-top:50px;
            height:60vh;
            background: #0e233eeb;
        `}

        ${props => props.infoPane && css`
            padding:0 0 55px 0; 
            flex-direction:row-reverse;
            height:93vh;
            background: #0e233e;
        `}
    }
`

export const StyledSubMenu = styled.div`
    width:100%;
    height:32px;
    display:flex;
    position:absolute;
    top:0;
    z-index:100;
    background:var(--color-darkestop-focus);

    @media (max-width: 768px) {
        flex-direction: row;
    }
`

/**
 * "Primary" seach bar. This one has a toggle between work/life
 * This is not either of the searchbars in the map view
 */
export const SearchInput = styled.input`

    ${props => props.helper == true && css`
        width: 33vw;
        margin-top: 7px;
        left:475px;
    `}

    height:32px;
    padding: .6em .7em;
    padding-left: 32px !important;
    font-size:13px;
    vertical-align:baseline;

    @media (max-width: 1199px) {
        width:34vw
    }

    &:focus {
        outline:none;
        box-shadow:0 1px 4px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05);
        text-shadow:none;
    }
`

export const SearchSVG = styled.svg`

    position: absolute;
    top: 50%;
    margin-top: -9px;
    pointer-events: none;
    right: auto;
    vertical-align: bottom;

    ${props => props.mobile == true && css`
        left: 6vw;
        top: 4.1em;
    `}
    ${props => props.landing == true && css`
        left: 7.4em;    
    `}

    ${props => props.helper == true && css`
        left: 30.3em;;
    `}
`