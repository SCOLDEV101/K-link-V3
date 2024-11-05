import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import config from '../constants/function'
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import "../index.css";

const AboutOtherAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const uID = location.state?.uID;
  // const role = location.state?.role;
  // const hID = location.state?.hID;
  // const type = location.state || {};
  const { uID, groupID, role, type } = location.state || {}; 
  const [memberinfo, setMemberInfo] = useState(null);
  const headersAuth = config.Headers().headers;
  const [fetchdataloading, setFetchdataLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fetchdataloading) {
        setTimeoutReached(true);        
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [fetchdataloading]);

  useEffect(() => {
    // console.log(uID)
    const fetchMemberInfo = async (id) => {
      try {
        const response = await axios.get(config.SERVER_PATH + `/api/user/memberInfo/${id}`, { headers: headersAuth, withCredentials: true });
        if (response.data.status === "ok") {
          console.log(response.data.data)
          setMemberInfo(response.data.data);
          setFetchdataLoading(false);

        }
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };
    fetchMemberInfo(uID);

  }, []);

  const handleReportProfile = (id) => {
    navigate("/report", {
      state: { caseID: "reportProfile", uID: id, type: "user" },
    });
  };

  const kickmember = async (uID, groupID) => {
    const result = await Swal.fire({
      title: "ยืนยันลบสมาชิกหรือไม่?",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: 'swal-container',
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button', 
        cancelButton: 'swal-cancel-button'    
      }
    });
  
    if (result.isConfirmed) {
      try {
        console.log(type);
        const response = await axios.post(`${config.SERVER_PATH}/api/${type}/kickMember/${groupID}/${uID}`, {}, {
          headers: headersAuth,
          withCredentials: true
        });
  
        if (response.data.status === "ok") {
          console.log("kick success");
          Swal.fire({
            position: "center",
            title: "ลบสมาชิกแล้ว",
            showConfirmButton: false,
            timer: 10000,
            customClass: {
              title: 'swal-title-success',
              container: 'swal-container',
              popup: 'swal-popup-error',
            }
          });
          navigate(-1);
        }
      } catch (error) {
        console.error('There was an error fetching the members!', error);
        Swal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-success',
            container: 'swal-container',
            popup: 'swal-popup-error',
          }
        });
      }
    }
  };
  

  return (
    <div>
   {memberinfo ? (
  <div>
    <div
      className="card pt-4 mx-3 mt-3"
      style={{
        top: "92px",
        height: "65%",
        maxHeight: "100vh",
        background: "#ffffff",
        borderRadius: "20px",
        zIndex: -1,
        overflowY: "auto",
        overflowX: "hidden",
        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
      }}
    >
        <div>
          <div className="d-flex flex-column align-items-center">
            <img
              src={memberinfo.profileImage != null 
                ? (`http://127.0.0.1:8000/uploaded/profileImage/${memberinfo.profileImage}`)
                : "./Empty-Profile-Image.svg"
              }
              alt=""
              className="mx-auto my-1"
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
            />
            <h3 className="my-1">{memberinfo.username}</h3>
          </div>

          <div style={{ fontSize: "1rem" }} className="px-5">
            <p>ID {uID}</p>
            <p>ชื่อ : {memberinfo.fullname}</p>
            <p>อีเมล : {memberinfo.email}</p>
            <p>เบอร์โทร : {memberinfo.telephone}</p>
            <p>คณะ : {memberinfo.faculty}</p>
          </div>
          <div className="mt-1 mb-3 h-auto p-2 mx-3" style={{ backgroundColor: "#E7E7E7", borderRadius: "10px" }}>
            {memberinfo.aboutMe}
          </div>
        </div>
    </div>
    {role === "leader" ? (
            <div
              className="card mx-3 mb-5"
              style={{
                top: "120px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
              }}
            >
              <div className='m-3 d-flex row'>
              <button className='border-0 p-2'  onClick={() => handleReportProfile(uID)} style={{borderRadius:"10px" , backgroundColor: "#E7E7E7"}}>
                รายงาน
              </button>
              <button className='border-0 p-2 text-white' onClick={() => kickmember(uID , groupID)} style={{borderRadius:"10px" , backgroundColor:"#B3261E" , marginTop:"10px"}}>
              <AiOutlineUsergroupDelete />
               ลบออกจากกลุ่ม
              </button>
              </div>
            </div>
          ) : role === "user" ? (
            <div
              className="card mx-3 mb-5"
              style={{
                top: "120px",
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
              }}
            >
              <button className='border-0 m-3 p-2'  onClick={() => handleReportProfile(uID)} style={{borderRadius:"10px", backgroundColor: "#E7E7E7"}}>
                รายงาน
              </button>
            </div>
          ) : null}
       </div>
 ) : (
  <>
    {!timeoutReached ? (
      <div className="d-flex flex-row justify-content-center align-content-start pb-3" style={{marginTop:"100px"}}>
        <l-tail-chase
          size="40"
          speed="1.75"
          color="rgb(255,133,0)"
        ></l-tail-chase>
      </div>
    ) : (
      <div className="d-flex flex-row justify-content-center align-content-start pb-3 text-center" style={{marginTop:"100px" , color:"#D9D9D9"}} >ไม่พบข้อมูล</div>
    )}
  </>
)}
  </div>
  );
};

export default AboutOtherAccount;