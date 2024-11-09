import React, { useEffect, useState } from "react";
import config from "../constants/function";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoGameController , IoDocumentTextOutline } from "react-icons/io5";
import { PiBookOpen } from "react-icons/pi";

function AppHome() {
  const [profileData, setprofileData] = useState({});
  const headersCookie = config.Headers().headers;

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.SERVER_PATH + `/api/user/memberInfo/`, {
          headers: headersCookie,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            console.log(res.data.data);
            setprofileData(res.data.data);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

 
  return (
    <div style={{
      height: "calc(100vh - 180px)",
      marginTop: "90px",
      overflow: "hidden",
      overflowY:"auto",
    }}>
    <div className="m-5">
    <p className="fw-bold fs-3 my-0">สวัสดีคุณ  {profileData.username}</p>
    <p className="fs-6 mb-4">วันนี้คุณอยากทำอะไร ?</p>
    <div className="d-flex flex-column justify-content-center">
    <img 
        src="../K-Link-Logo.svg" 
        alt="" 
        style={{
          backgroundImage: `url("../homebackguard.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center', 
          padding:"10vh 30vw",
          borderRadius:"10px",
          borderBottom:"1.5vh solid #FF8500"
        }} 
      />
      <div className="d-flex justify-content-between mt-4">
      <Link 
          className="py-3 text-center text-decoration-none "
          to="/hobby"
          style={{
            borderRadius: "15px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
            width:"30%",
          }} 
        >
          <IoGameController className="fs-1" style={{ color: "#FFB600" }} />
          <p className="my-0 text-dark" style={{ fontSize: "14px" }}>
            Hobby
          </p>
        </Link>
          <Link
         to={"/tutoring"}
         className="py-3 text-center text-decoration-none "
        style={{
           borderRadius:"15px",
           backgroundColor:"#ffffff",
           boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
           width:"30%",
           }} 
          >
            <PiBookOpen className="fs-1" style={{ color: "#21005D" }} />
          <p className="my-0 text-dark" style={{ fontSize: "14px" }}>
            Tutoring
          </p>
            </Link>

          <Link
         to={"/library"}
         className="py-3 text-center text-decoration-none "
         style={{
           borderRadius:"15px",
           backgroundColor:"#ffffff",
           boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
           width:"30%",
           }} 
          >
           <IoDocumentTextOutline className="fs-1" style={{ color: "#7CB518" }} />
          <p className="my-0 text-dark" style={{ fontSize: "14px" }}>
            Library
          </p>
            </Link>
      </div>
    </div>
    </div>
    </div>
  );
}

export default AppHome;
