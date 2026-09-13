import logo from '../assets/images/logo.svg';
import React  from "react";
import { Link } from "react-router-dom";
// import { logo } from "../assets";
import { preloadImage } from "./__Utils";


const _Header = (props) =>  {

    const menuNodes = props.menuNodes;
    const preloadingArray = props.preloadingArray;

    const [isOpen, setIsOpen] = React.useState(false);
    const handleNavClick = () => setIsOpen(open => !open);
    const handleNavItemClick = () => setIsOpen(false);

    return (
        <header className="d-flex align-items-center">
            <div className="container-xxl ">
                <div className="row align-items-center">
                    <div className="col-6 col-lg-2">
                        <div className="logo-wrap">
                            <Link to="/">
                                <img src={logo} alt="Form and Field" width="204" height="49" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-6 col-lg-10">
                        <nav className="navbar navbar-expand-lg justify-content-end">
                            <div className="hidden2" id="header-nav">
                                <button onClick={handleNavClick} id="navbar-toggler" className={"navbar-toggler" + (isOpen ? " open" : "")} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded={isOpen} aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className={"navbar-collapse" + (isOpen ? "" : " collapse")} id="navbarNav">
                                    <ul className="navbar-nav fw-medium">
                                        {menuNodes.map((menuNode, index) => {
                                            return (
                                                <li onClick={handleNavItemClick} className="nav-item " key={index} onMouseEnter={ () => preloadImage(preloadingArray[menuNode.uri]) }>
                                                    <Link className="nav-link" to={menuNode.uri} >{menuNode.label}</Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );

}
export default _Header;
