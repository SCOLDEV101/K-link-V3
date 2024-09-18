import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RouterPathAndName } from "../constants/routes";
import { FaArrowLeft } from "react-icons/fa";

function Header({groupName , FileData}) {
  const location = useLocation();
  const navigate = useNavigate();
  let HeaderTitle =
    RouterPathAndName.find((route) => route.path === location.pathname)?.name ||
    "HEADER";

  if (location.pathname === "/members") {
    HeaderTitle = groupName;
  }
  const backButton = [
    "/abouthobbygroup",
    "/hobbycreategroup",
    "/tutoringcreategroup",
    "/members",
    "/invitefriend",
    "/acceptRequest",
    "/report",
    "/notification",
    "/abouttutoringgroup",
    "/tutoringeditgroup",
    "/hobbyeditgroup",
    "/bookmark",
    "/aboutapp",
    "/librarycreatepost",
  ];
  const bigHeader = [
    "/aboutaccount",
    "/aboutmyaccount",
    "/aboutmyaccount/editmyaccount",
    "/aboutapp",
  ];
  const noHeader = ["/", "/search"];
  const noNotifyIcon = ["/notification"];

  return (
    <nav
      className={`fixed-top d-flex justify-content-center ${
        noHeader.includes(location.pathname) && "d-none"
      }`}
      style={{
        background: "#FF8500",
        height: "100%",
        // maxHeight: bigHeader.includes(location.pathname) ? "140px" : "92px", // 140px
        maxHeight:"92px",
        borderBottomLeftRadius : "15px", //
        borderBottomRightRadius: "15px", //
        boxShadow: "0px 5px 0px rgba(0, 0, 0, .25)",
        zIndex: 10,
      }}
    >
      <div
        className="container-fluid d-flex flex-row justify-content-between align-items-center mx-3" // mb-5
        style={{}}
      >
        {[...backButton, ...bigHeader].includes(location.pathname) ? (
          <FaArrowLeft
            onClick={() => {
              if (location.pathname === "/aboutmyaccount") {
                navigate("/setting");
              } else {
                navigate(-1);
              }
            }}
            style={{
              color: "#fff",
              width: "23px",
              height: "23px",
              // strokeWidth: 20,
              // filter: "drop-shadow(3px 5px 0px rgba(0, 0, 0, 0.25))",
            }}
          />
        ) : (
          <Link to="/home" className="">
            <img src="./K-Link-Logo.svg" alt="AppLogo" width="30px"/>
          </Link>
        )}
          <h1
            className="mb-0 text-white m-auto"
            style={{
              textShadow: "3px 3px 5px rgba(0, 0, 0, 0.25)",
              fontSize: "24px",
              whiteSpace: "nowrap", 
              overflow: "hidden",   
              textOverflow: "ellipsis",
              maxWidth: "60vw", 
              lineHeight: "1.7",
              height: "65px",
            }}
          >
            {HeaderTitle}
          </h1>
        {!noNotifyIcon.includes(location.pathname) ? (
          <Link
            to="/notification"
            className="d-flex align-items-center justify-content-center text-white fs-4 p-0 m-0 rounded-circle"
            style={{
              width: "35px",
              height: "35px",
              background: "#FFB600",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, .25)",
            }}
          >
            <IoIosNotifications />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
}

export default Header;
