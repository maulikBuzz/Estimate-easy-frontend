import React, { useState } from "react"
import { Link } from "react-router-dom"
import logoLightPng from "../../assets/images/logo-light.png"
import logoDark from "../../assets/images/logo/Logo.png"
import { Dropdown } from "reactstrap"
 
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"




function Header() {
  const [createmenu, setCreateMenu] = useState(false) 
  
  function tToggle() {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }
   
  return (
    <div>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoDark} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="42" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightPng} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoLightPng} alt="" height="19" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="mdi mdi-menu"></i>
            </button>
            <div className="d-none d-sm-block">
              <Dropdown
                isOpen={createmenu}
                toggle={() => setCreateMenu(!createmenu)}
                className="d-inline-block"
              > 
              </Dropdown>
            </div>
          </div>
          <div className="d-flex">
            
              
            
            <ProfileMenu />
            <div

              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle waves-effect"
              >
                <i className="mdi mdi-spin mdi-cog"></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
