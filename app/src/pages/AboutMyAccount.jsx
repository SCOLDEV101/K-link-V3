import React, { useEffect, useState } from "react";
import { FiEdit3 , FiLogIn} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import config from "../constants/function";
import axios from "axios";
import { useProfileAccount } from "../contextProivder/ProfileAccoutProvider";
import Swal from 'sweetalert2'
import "../index.css";


function AboutMyAccount() {
  const navigate = useNavigate();
  const [profileData, setprofileData] = useState({});
  const headersCookie = config.Headers().headers;
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.SERVER_PATH + `/api/user/aboutMyAccount`, {
          headers: headersCookie,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            console.log(res.data.data);
            setprofileData(res.data.data);
            setFetchdataLoading(false);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const Logout = async () => {
    const result = await Swal.fire({
      title: "ต้องการออกจากระบบหรือไม่?",
      showCancelButton: true,
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
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    Swal.fire({
      position: "center",
      title: "ออกจากระบบแล้ว",
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        title: 'swal-title-success',
        container: 'swal-container',
        popup: 'swal-popup-success',
      }
    });
    navigate("/");
  }
  };

  return (
<div
  className="container-fluid p-0"
  style={{
    background: "linear-gradient(0deg, #F85B03, #F86A03, #F89603)",
    height: "100vh",
    margin: 0,
  }}
>

      {profileData ? (
     <div>
     <div
  className="card pt-4 mx-4 mt-5"
  style={{
    top: "92px",
    height: "65%",
    maxHeight: "100vh",
    background: "#ffffff",
    borderRadius: "20px",
    zIndex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
  }}
>

         <div>
           <div className="d-flex flex-column align-items-center">
            <img
              src={
                profileData.profileImage
                  ? `${config.SERVER_PATH}/uploaded/profileImage/${profileData.profileImage}`
                  : "./Empty-Profile-Image.svg"
              }
              alt=""
              className="mx-auto my-1"
              style={{ borderRadius: "50%", width: "100px", height: "100px" }}
            /> 
             <h3 className="my-2 fw-bold">{profileData.username}</h3>
           </div>
          
          <div>
          <div className="mx-3 d-flex justify-content-between">
           <p>ชื่อเล่น</p>
           <p className="fw-bold">{profileData.username || '--'}</p>
            </div>
            <div className="mx-3 d-flex justify-content-between">
           <p>ชื่อ-สกุล</p>
           <p className="fw-bold">{profileData.fullname || '--'}</p> 
           </div>
            <div className="mx-3 d-flex justify-content-between">
           <p>อีเมล</p>
           <p className="fw-bold">{profileData.email || '--'}</p> 
           </div>
            <div className="mx-3 d-flex justify-content-between">
           <p>เบอร์โทร</p>
           <p className="fw-bold">{profileData.telephone || '--'}</p> 
           </div>
            <div className="mx-3 d-flex justify-content-between">
           <p>คณะ</p>
           <p className="fw-bold"> {profileData.faculty || '--'}</p> 
           </div>
          </div>
           {profileData.aboutMe ? (
           <div className="mt-1 mb-3 h-auto p-2 mx-3" placeholder="เกี่ยวกับฉัน" style={{ backgroundColor: "#E7E7E7", borderRadius: "10px" }}>
             {profileData.aboutMe}
           </div>
           ): (<></>)}
         </div>
     </div>
     <div
  className="card mx-4 mb-5"
  style={{
    top: "120px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
  }}
>
               <div className='m-3 d-flex row'>
                 <button className='border-0 p-2 text-white'style={{borderRadius:"10px" , backgroundColor:"#FFB600"}}>
                <Link
                    to="/aboutmyaccount/editmyaccount"
                    style={{ color: "black" , fontSize: "1rem" }}
                    className="text-decoration-none"
                  >
                    แก้ไขโปรไฟล์
                    <FiEdit3 className="mx-2" />
                  </Link>
                  </button>
                  <button className='border-0 p-2 text-white'style={{borderRadius:"10px" , backgroundColor:"#B3261E" , marginTop:"10px"}}>
                  <Link
            onClick={() => Logout()}
            className="text-white text-decoration-none"
            style={{fontSize: "1rem"}}
          >
            ออกจากระบบ
            <FiLogIn className="mx-2"/>
          </Link> 
          </button>
               </div>
             </div>
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
} 

export default AboutMyAccount;