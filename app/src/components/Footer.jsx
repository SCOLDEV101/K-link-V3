import React, { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import config from "../constants/function";
import { MdOutlineShare , MdOutlineDownload } from "react-icons/md";


const Footer = ({FileData}) => {
  console.log("FileData:", FileData);

  const Menus = [
    {
      name: "My POST",
      route: "/mypost",
      icon: <FaPeopleGroup />,
      dis: "translateX(0rem)",
    },
    {
      name: "Home",
      route: "/home",
      icon: <IoHome />,
      dis: "translateX(5.5rem)",
    },
    {
      name: "Setting",
      route: "/setting",
      icon: <IoMdSettings />,
      dis: "translateX(11rem)",
    },
  ];

  const location = useLocation();
  const initialActive = Menus.findIndex(
    (menu) => menu.route === location.pathname
  );
  const [active, setActive] = useState(
    initialActive !== -1 ? initialActive : 1
  );

  const handleShare = (selectedItemId) => {
    const shareUrl = `https://k-link-v3.vercel.app/?redirect=/aboutlibrary/${selectedItemId}`; 
    const shareText = `ฉันเจอเอกสารที่น่าสนใจในแอป K-LINK\n${shareUrl}\nร่วมแบ่งปันประสบการณ์ที่ดีร่วมกันในแอป K-LINK`;
    navigator.clipboard.writeText(shareText);

    if (navigator.share) {
        navigator.share({
            title: "ฉันเจอเอกสารที่น่าสนใจในแอป K-LINK",
            text: "ร่วมแบ่งปันประสบการณ์ที่ดีร่วมกันในแอป K-LINK",
            url: shareUrl, 
        })
        .then(() => console.log('แชร์สำเร็จ!'))
        .catch((error) => console.log('การแชร์ล้มเหลว:', error));
    } else {
        alert('ไม่รองรับในเบราว์เซอร์ของคุณ');
    }
};


  useEffect(() => {
    const currentActive = Menus.findIndex(
      (menu) => menu.route === location.pathname
    );
    setActive(currentActive !== -1 ? currentActive : 1);
  }, [location.pathname]);

  const isInMenu = Menus.some((menu) => menu.route === location.pathname);
  const NoHasFooter = [
    "/",
    "/hobbycreategroup",
    "/abouthobbygroup",
    "/tutoringcreategroup",
    "/members",
    "/aboutaccount",
    "/invitefriend",
    "/acceptRequest",
    "/aboutmyaccount",
    "/aboutmyaccount/editmyaccount",
    "/report",
    "/abouttutoringgroup",
    "/tutoringeditgroup",
    "/hobbyeditgroup",
    "/aboutapp",
    "/librarycreatepost",
    "/AboutReport",
    "/notification",
  ];
  return (
    <>
      {
  location.pathname.startsWith("/aboutlibrary") && FileData ? (
    <div
      class="w-100 fixed-bottom d-flex"
      style={{
        backgroundColor: "#FF8500",
        position: "fixed",
        boxShadow: "0px -3px 10px rgba(0, 0, 0, .25)",
        height: "60px",
      }}
    >
      <div
        style={{ width: "40%", cursor: "pointer" }}
        className="text-white fs-6 d-flex align-items-center justify-content-center"
        onClick={() => handleShare(FileData.groupID)}
      >
        <MdOutlineShare className="mx-1" />
        Share
      </div>

      <div
        style={{
          width: "0.1px",
          backgroundColor: "rgba(0,0,0,0.5)",
          height: "100%",
          alignSelf: "center",
        }}
      ></div>

      <div
        className="text-white fs-6 d-flex align-items-center justify-content-center"
        style={{ width: "60%" }}
        onClick={() =>
          window.open(
            `${config.SERVER_PATH}${FileData?.downloadlink}`,
            "_blank",
            "noopener noreferrer"
          )
        }
      >
        <MdOutlineDownload className="mx-1 fs-2" />
        Download
      </div>
    </div>
  ) : !location.pathname.startsWith("/aboutlibrary") ? (
    <div
      className={`d-flex flex-row justify-content-center ${
        NoHasFooter.includes(location.pathname) ? "d-none" : ""
      }`}
      style={{
        backgroundColor: "#FF8500",
        position: "fixed",
        right: "0",
        left: "0",
        bottom: "-20px",
        boxShadow: "0px -3px 10px rgba(0, 0, 0, .25)",
      }}
    >
      <ul className="d-flex gap-4 position-relative list-unstyled">
        {Menus.map((menu, i) => (
          <li key={i} style={{ width: "4rem" }}>
            <Link
              to={menu.route}
              className="d-flex flex-column text-center pt-3 text-decoration-none text-nowrap"
              onClick={() => setActive(i)}
              style={{ cursor: "pointer", zIndex: 3 }}
            >
              <span
                className="text-white"
                style={{
                  fontSize: "30px",
                  transitionDuration: "0.4s",
                  marginTop:
                    active === i ? (isInMenu ? "-1.8rem" : "0") : "0",
                  zIndex: 3,
                }}
              >
                {menu.icon}
              </span>
              <span
                className="text-white"
                style={{
                  transition: "transform 0.8s, opacity 0.8s",
                  transform:
                    active === i
                      ? "translateY(1rem)"
                      : "translateY(2.5rem)",
                  opacity: active === i ? 1 : 0,
                }}
              >
                {menu.name}
              </span>
            </Link>
          </li>
        ))}
        <span
          className="rounded-circle position-absolute z-1"
          style={{
            backgroundColor: "#FFB600",
            transition: "opacity 0.5s, transform 0.5s",
            transform: Menus[active].dis,
            border: "6px solid #FF8500",
            height: "4rem",
            width: "4rem",
            top: "-1.25rem",
            zIndex: 1,
            opacity: isInMenu ? 1 : 0,
          }}
        ></span>
      </ul>
    </div>
  ) : null}

    </>
    
  );
};

export default Footer;
