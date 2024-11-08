import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RouterPathAndName } from "../constants/routes";
import { MdInfoOutline } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";



function Header({ groupName, FileData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  let HeaderTitle = "HEADER";

  if (FileData && FileData.filename) {
    HeaderTitle = FileData.filename;
  } else if (location.pathname === "/members") {
    HeaderTitle = groupName || "HEADER";
  } else {
    HeaderTitle = RouterPathAndName.find((route) => route.path === location.pathname)?.name || "HEADER";
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
    "/aboutlibrary",
    "/AboutReport",
  ];
  const bigHeader = [
    "/aboutaccount",
    "/aboutmyaccount",
    "/aboutmyaccount/editmyaccount",
    "/aboutapp",
  ];
  const noHeader = ["/", "/search"];
  const noNotifyIcon = ["/notification", "/aboutlibrary", "/AboutReport"];

  const showBackButton =
    backButton.some((path) => location.pathname.startsWith(path)) ||
    [...backButton, ...bigHeader].includes(location.pathname);

  return (
    <>
      <nav
        className={`fixed-top d-flex justify-content-center ${
          noHeader.includes(location.pathname) && "d-none"
        }`}
        style={{
          background: "#FF8500",
          height: "100%",
          maxHeight: "92px",
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          boxShadow: "0px 5px 0px rgba(0, 0, 0, .25)",
          zIndex: 10,
        }}
      >
        <div
          className="container-fluid d-flex flex-row justify-content-between align-items-center mx-3"
        >
          {showBackButton ? (
            <IoIosArrowBack
              onClick={() => {
                if (location.pathname === "/aboutmyaccount") {
                  navigate("/setting");
                } else {
                  navigate(-1);
                }
              }}
              className="fw-bold"
              style={{
                color: "#ffffff",
                width: "24px",
                height: "24px",
              }}
            />
          ) : (
            <Link to="/home">
              <img src="./K-Link-Logo.svg" alt="AppLogo" width="30px" />
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
          {location.pathname.startsWith("/aboutlibrary") ? (
            <div>
              {FileData && (
                <MdInfoOutline
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    color: "#F6F6F6",
                    fontSize: "22px",
                    filter: "drop-shadow(1px 1px 2.7px rgba(0, 0, 0, 0.5))",
                    cursor: 'pointer',
                  }}
                />
              )}
            </div>
          ) : !noNotifyIcon.includes(location.pathname) ? (
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} FileData={FileData} />
    </>
  );
}

export default Header;

const Modal = ({ isOpen, onClose, FileData }) => {
  if (!isOpen) return null;

  const handleClickInsideModal = (event) => {
    event.stopPropagation();
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543;
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(date);
    return formattedDate.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, `$1/$2/${thaiYear}`);
  };
  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return "0 MB";
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2); 
    return `${sizeInMB} MB`;
  };

  return (
    <div
      style={{
        position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
      }}
      onClick={onClose} 
    >
      <div
      className="p-4"
        style={{background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '600px',
          position: 'relative',
          boxShadow: "0px 4px 14.8px rgba(0, 0, 0, .2)",
        }}
        onClick={handleClickInsideModal} 
      >
        <p className="fw-bold text-center" style={{color:"#FF8500" , fontSize:"20px"}}>{FileData?.filename}.pdf</p>
        <div className="p-4" style={{backgroundColor:"#F6F6F6", border:"1px solid #E7E7E7", borderRadius:"5px"}}>
        <p style={{fontSize:"16px" , marginBottom:"10px"}}>วิชา : {FileData?.name}</p>
        <p style={{fontSize:"16px", marginBottom:"10px"}}>คณะ : {FileData?.faculty}</p>
        <p style={{fontSize:"16px", marginBottom:"10px"}}>ขนาดไฟล์ : {formatFileSize(FileData?.filesizeInBytes)}</p>
        <p style={{fontSize:"16px", marginBottom:"10px"}}>จำนวนหน้า : {FileData?.totalpages} หน้า</p>
        <p style={{fontSize:"16px", marginBottom:"10px"}}>เจ้าของ : {FileData?.owner}</p>
        <p style={{fontSize:"16px", marginBottom:"10px"}}>อัปโหลดเมื่อ : {formatDate(FileData?.uploadDate)}</p>
      </div>
      </div>
    </div>
  );
};


