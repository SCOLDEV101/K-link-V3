import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { FiUser ,FiInfo ,FiLogIn} from "react-icons/fi";
import { IoMdNotificationsOutline , IoMdNotificationsOff } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { config } from "../constants/function";
import Swal from 'sweetalert2'
import "../index.css";


function SettingPage() {
  const navigate = useNavigate();
  const [notifyStatus, setNotifyStatus] = useState(true);
  const settingMenus = [
    {
      id: 1,
      title: "เกี่ยวกับบัญชี",
      route: "/aboutmyaccount",
      icon: <FiUser/>,
    },
    {
      id: 2,
      title: "ที่บันทึกไว้",
      route: "/bookmark",
      icon: <FaRegBookmark />,
    },
    {
      id: 3,
      title: "เปิดการแจ้งเตือน",
      toggleTitle: "ปิดการแจ้งเตือน",
      route: "",
      icon: <IoMdNotificationsOutline/>,
      toggleIcon: <IoMdNotificationsOff />,
    },
  ];

  const settingMenus2 = [
    {
      id: 1,
      title: "เวอร์ชัน",
      route: "/aboutapp",
      icon: <FiInfo/>,
    },
    {
      id: 2,
      title: "Policy",
      route: "/aboutapp",
      icon: <TbWorld />,
    },
  ];

  useEffect(() => {
    NotifyStatus();
    console.log("fetched status");
  }, [notifyStatus]);

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

  async function NotifyStatus() {
    try {
      //   const NotiStatus = await axios.get(config.SERVER_PATH + "/endpoint", config.Headers());
      //   console.log(NotiStatus.data);
      //   if (NotiStatus.data) {
      //     setNotifyStatus(NotiStatus.data);
      //   }
    } catch (error) {
      console.error("Error fetching notify status:", error);
    }
  }

  return (
    <>
      <div
        className="card pt-3 m-3 mb-3"
        style={{
          top: "100px",
          height:"70%",
          background: "#FFFFFF",
          borderRadius: "15px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          zIndex: 1,
        }}
      >
        <ul className="d-flex flex-column mx-2 p-0">
          {settingMenus.map((menu) => (
            <li key={menu.title} className="list-unstyled">
              <Link
                to={menu.route}
                className="d-flex flex-row justify-content-between mx-2 align-items-center text-decoration-none"
                style={{ color: "black" }}
                onClick={
                  menu.id === 3
                    ? () => {
                      setNotifyStatus(!notifyStatus);
                      NotifyStatus();
                    }
                    : undefined
                }
              >
                <span className="mb-1" style={{ fontSize: "25px" }}                >
                  {menu.id === 3
                    ? notifyStatus
                      ? menu.icon
                      : menu.toggleIcon
                    : menu.icon}
                </span>
                <span className="fw-medium" style={{ fontSize: "20px" }}>
                  {menu.id === 3
                    ? notifyStatus
                      ? menu.title
                      : menu.toggleTitle
                    : menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="card pt-3 m-3 mb-3"
        style={{
          top: "100px",
          height:"70%",
          background: "#FFFFFF",
          borderRadius: "15px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          zIndex: 1,
        }}
      >
        <ul className="d-flex flex-column mx-2 p-0">
          {settingMenus2.map((menu) => (
            <li key={menu.title} className="list-unstyled">
              <Link
                to={menu.route}
                className="d-flex flex-row justify-content-between mx-2 align-items-center text-decoration-none"
                style={{ color: "black" }}
              >
                <span className="mb-1" style={{ fontSize: "25px" }}>
                  {menu.icon }
                </span>
                <span className="fw-medium" style={{ fontSize: "20px" }}>
                  {menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="card m-3 mb-4"
        style={{
          top: "100px",
          height:"70%",
          background: "#FFFFFF",
          borderRadius: "15px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          zIndex: 1,
        }}
      >
      <button className='border-0 p-2 text-white'style={{borderRadius:"10px" , backgroundColor:"#B3261E"}}>
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
    </>
  );
}

export default SettingPage;
