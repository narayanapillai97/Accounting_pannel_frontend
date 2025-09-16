import React, { Fragment, useContext, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import suyaplogo from "../../../../src/images/logo/suyap_logo.jpeg";

export function  NavMenuToggle(){
	setTimeout(()=>{	
		let mainwrapper = document.querySelector("#main-wrapper");
		if(mainwrapper.classList.contains('menu-toggle')){
			mainwrapper.classList.remove("menu-toggle");
		}else{
			mainwrapper.classList.add("menu-toggle");
		}
	},200);
}

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  return (
    <div className="nav-header">
<Link to="/dashboard" className="brand-logo">
  {background.value === "dark" || navigationHader !== "color_1" ? (
    <img
      src={suyaplogo}
      alt="Suyap Logo"
      className="logo-img"
      style={{
        height: "70px",   // Increased size
        width: "70px",    // Make it square for a perfect circle
        borderRadius: "50%", // Makes it rounded
        objectFit: "cover",  // Prevents stretching
      }}
    />
  ) : (
    <img
      src={suyaplogo}
      alt="Suyap Logo"
      className="logo-img"
      style={{
        height: "70px",
        width: "70px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  )}
</Link>


      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
