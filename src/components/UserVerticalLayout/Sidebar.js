import PropTypes from "prop-types"
import React from "react"  
 
import SidebarContent from "./SidebarContent"

const Sidebar = props => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

 
export default Sidebar 
