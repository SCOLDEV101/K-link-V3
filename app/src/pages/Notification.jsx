import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../constants/function";

function Notification() {
  const headersAuth = config.Headers().headers;
  // const items = Array.from({ length: 25 }, (_, i) => i + 1);
  const [listData, setListData] = useState([]); // testNoti is Testing data { Remove this when use API }

  const fetchNotify = async () => {
    try {
      const response = await axios.get(config.SERVER_PATH + `/api/user/notification/`, {
        headers: headersAuth,
        withCredentials: true,
      });
      if (response.data.status === "ok") {
        console.log("response :", response.data.data);
        setListData(response.data.data); // setListData to show all notifications
      }
    } catch (error) {
      console.error("There was an error fetching the members!", error);
    }
  };

  useEffect(() => {
    fetchNotify();
  }, []);

  return (
    <div className="container p-3" style={{ height: "100vh" }}>
      <ul
        className="list-unstyled d-grid gap-3 pb-3"
        style={{ position: "relative", top: "100px" }}
      >
        {listData && listData.length > 0 ? (
          listData.map((item, i) => (
            <List_Notify_Component key={i} listData={item} />
          ))
        ) : (
          <h4 className="text-secondary text-center">-- ไม่พบการแจ้งเตือน --</h4>
        )}
      </ul>
    </div>
  );
}

export default Notification;

export function List_Notify_Component({ listData }) {
  const navigation = useNavigate();
  const avialableTypes = ["report", "invite", "request", "acceptRequest"];

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const secondsPast = (now - past) / 1000;

    if (secondsPast < 60) {
      return "เมื่อไม่นานมานี้";
    } else if (secondsPast < 3600) {
      const minutes = Math.floor(secondsPast / 60);
      return `${minutes} นาที`; //${minutes > 1 ? "s" : ""}
    } else if (secondsPast < 86400) {
      const hours = Math.floor(secondsPast / 3600);
      return `${hours} ชั่วโมง`; //${hours > 1 ? "s" : ""}
    } else if (secondsPast < 604800) {
      const days = Math.floor(secondsPast / 86400);
      return `${days} วัน`; //${days > 1 ? "s" : ""}
    } else if (secondsPast < 2592000) {
      const weeks = Math.floor(secondsPast / 604800);
      return `${weeks} สัปดาห์`; //${weeks > 1 ? "s" : ""}
    } else {
      const months = Math.floor(secondsPast / 2592000);
      return `${months} เดือน`; //${months > 1 ? "s" : ""}
    }
  }

  return (
    <>
      {avialableTypes.includes(listData.notiType) ? (
        <li
          onClick={() => {
            console.log("clicked", listData);
            // navigation("/home");
          }}
          className="d-flex flex-row"
        >
          <img
            // src={"./Empty-Profile-Image.svg"}
            src={
              listData.profileImage
                ? `http://127.0.0.1:8000/uploaded/profileImage/${listData.profileImage}`
                : "./Empty-Profile-Image.svg"
            }
            alt="profile"
            className="rounded-circle position-relative bg-dark"
            style={{ width: "50px", height: "50px", top: "0px" }}
          />
          <div
            className="ms-3 d-flex align-items-center text-break"
            style={{ fontSize: ".8rem" }}
          >
            {listData.notiType === "report" ? (
              <span>
                กลุ่มที่คุณสร้าง{" "}
                <span className="fw-bold">"{listData.group}"</span> ถูกรายงาน{" "}
                <span className="text-secondary fw-medium">
                  {timeAgo(listData.createdAt)}
                </span>
              </span>
            ) : listData.notiType === "invite" ? (
              <span>
                <span className="fw-bold">{listData.sender}</span>{" "}
                เชิญคุณเข้าร่วมกลุ่ม{" "}
                <span className="fw-bold">{listData.group}</span>{" "}
                <span className="text-secondary fw-medium">
                  {timeAgo(listData.createdAt)}
                </span>
              </span>
            ) : listData.notiType === "request" ? (
              <span>
                <span className="fw-bold">{listData.sender}</span>{" "}
                ส่งคำขอเข้าร่วมกลุ่ม{" "}
                <span className="fw-bold">{listData.group}</span>{" "}
                <span className="text-secondary fw-medium">
                  {timeAgo(listData.createdAt)}
                </span>
              </span>
            ) : listData.notiType === "acceptRequest" ? (
              <span>
                <span className="fw-bold">{listData.sender}</span>{" "}
                ตอบรับคำขอเข้าร่วมกลุ่ม{" "}
                <span className="fw-bold">"{listData.group}"</span> ของคุณแล้ว{" "}
                <span className="text-secondary fw-medium">
                  {timeAgo(listData.createdAt)}
                </span>
              </span>
            ) : null}
          </div>
        </li>
      ) : null}
    </>
  );
}

// ส่งรูปมาด้วยดิ
// ทำ loading ตอนไม่มีข้อมูล
