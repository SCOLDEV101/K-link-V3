import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PiUserCircleFill } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";

import {
  IoNotifications,
  IoNotificationsOff,
  IoAlertCircleSharp,
} from "react-icons/io5";
import { config } from "../constants/function";

function SettingPage() {
  const [notifyStatus, setNotifyStatus] = useState(true);
  const settingMenus = [
    {
      id: 1,
      title: "เกี่ยวกับบัญชี",
      route: "/aboutmyaccount",
      icon: <PiUserCircleFill />,
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
      icon: <IoNotifications />,
      toggleIcon: <IoNotificationsOff />,
    },
    {
      id: 4,
      title: "เกี่ยวกับแอป",
      route: "/aboutapp",
      icon: <IoMdInformationCircle/>,
    },
  ];

  useEffect(() => {
    NotifyStatus();
    console.log("fetched status");
  }, [notifyStatus]);

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
        className="card pt-3 m-3"
        style={{
          top: "100px",
          height:"70%",
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          zIndex: 1,
        }}
      >
        <ul className="d-flex flex-column gap-2">
          {settingMenus.map((menu) => (
            <li key={menu.title} className="list-unstyled">
              <Link
                to={menu.route}
                className="d-flex flex-row gap-3 align-items-center text-decoration-none"
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
                <span className="mb-1" style={{ fontSize: "25px" }}>
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
    </>
  );
}

export default SettingPage;
