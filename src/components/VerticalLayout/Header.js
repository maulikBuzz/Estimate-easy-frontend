import React, { useState } from "react"
import { Link } from "react-router-dom" 
import logoLightPng from "../../assets/images/logo-light.png"
import logoDark from "../../assets/images/logo/Logo.png"
import { Dropdown } from "reactstrap"

import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"




function Header() {
  const [createmenu, setCreateMenu] = useState(false)
  const [search, setsearch] = useState(false)

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
              <Link  className="logo logo-dark">
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
            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder={"search..."}
                />
                <span className="fa fa-search"></span>
              </div>
            </form>
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search)
                }}
                type="button"
                className="btn header-item noti-icon waves-effect"
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <LanguageDropdown />
            <div className="dropdown d-none d-lg-inline-block">
              <button
                type="button"
                
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="mdi mdi-fullscreen font-size-24"></i>
              </button>
            </div>
            <NotificationDropdown />
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
