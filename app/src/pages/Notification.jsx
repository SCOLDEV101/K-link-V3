import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";


function Notification() {
  // ข้อมูลแจ้งเตือนจำลอง
  const [listData, setListData] = useState([
    {
      notiType: "report",
      profileImage: null,
      group: "Group A",
      createdAt: new Date().toISOString(),
    },
    {
      notiType: "invite",
      profileImage: null,
      sender: "User B",
      group: "Group B",
      createdAt: new Date().toISOString(),
    },
    {
      notiType: "request",
      profileImage: null,
      sender: "User C",
      group: "Group C",
      createdAt: new Date().toISOString(),
    },
    {
      notiType: "acceptRequest",
      profileImage: null,
      sender: "User D",
      group: "Group D",
      createdAt: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    // ไม่ต้องเรียก API ตอนนี้
    // fetchNotify();
  }, []);



  return (
    <div className="container px-3 py-2" style={{ height: "100vh" }}>
      <ul
        className="list-unstyled d-grid gap-3 pb-3"
        style={{ position: "relative", top: "100px"}}
      >
        {listData && listData.length > 0 ? (
          listData.map((item, i) => (
            <List_Notify_Component key={i} listData={item}/>
          ))
        ) : (
          <h4 className="text-secondary text-center">-- ไม่พบการแจ้งเตือน --</h4>
        )}
      </ul>
    </div>
  );
}

export default Notification;

function List_Notify_Component({ listData }) {
  const avialableTypes = ["report", "invite", "request", "acceptRequest"];
  const navigate = useNavigate();

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const secondsPast = (now - past) / 1000;

    if (secondsPast < 60) {
      return "เมื่อไม่นานมานี้";
    } else if (secondsPast < 3600) {
      return `${Math.floor(secondsPast / 60)} นาที`;
    } else if (secondsPast < 86400) {
      return `${Math.floor(secondsPast / 3600)} ชั่วโมง`;
    } else if (secondsPast < 604800) {
      return `${Math.floor(secondsPast / 86400)} วัน`;
    } else if (secondsPast < 2592000) {
      return `${Math.floor(secondsPast / 604800)} สัปดาห์`;
    } else {
      return `${Math.floor(secondsPast / 2592000)} เดือน`;
    }
  }

  const handleClick = (listData) => {
    switch (listData.notiType) {
      case 'report':
        navigate("/AboutReport")
        break;
      case 'invite':
        // Define action for invite
        break;
      case 'request':
        navigate("/acceptRequest", { state: { groupID: listData.groupID, name: listData.group } });
        break;
      case 'acceptRequest':
        if (listData.groupType === "hobby") {
          navigate("/abouthobbygroup", {
            state: { groupID: listData.groupID },
          });
        } else if (listData.groupType === "tutoring") {
          navigate("/abouttutoringgroup", {
            state: { groupID: listData.groupID },
          });
        }
        break;
      default:
        console.warn("Unknown notification type");
        break;
    }
  };


  return (
    <>
      {avialableTypes.includes(listData.notiType) ? (
        <li className="d-flex align-items-center flex-row border-none p-3" 
        style={{
          borderRadius:"15px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          }} 
        onClick={() => handleClick(listData)}
          >
          <img
            src={
              listData.profileImage
                ? `http://127.0.0.1:8000/uploaded/profileImage/${listData.profileImage}`
                : "./Empty-Profile-Image.svg"
            }
            alt="profile"
            className="rounded-circle position-relative bg-dark"
            style={{ width: "50px", height: "50px" }}
          />
          <div
            className="ms-3 d-flex align-items-center text-break"
            style={{ fontSize: ".8rem" }}
          >
            {listData.notiType === "report" ? (
              <span>
                <span className="fw-bold my-0">ถูกรายงาน</span><br />
              กลุ่มที่คุณสร้าง{" "}
              <span> {listData.group} </span> 
              ถูกรายงาน{" "}
              <span className="fw-medium">
              <br /> {timeAgo(listData.createdAt)}
              </span>
            </span>
            
            ) : listData.notiType === "invite" ? (
              <span>
                <span className="fw-bold my-0">เชิญเข้ากลุ่ม</span><br />
                <span>{listData.sender}</span>{" "}
                เชิญคุณเข้าร่วมกลุ่ม{" "}
                <span>{listData.group}</span>{" "}
                <span className="fw-medium">
                <br />
                {timeAgo(listData.createdAt)}
                </span>
              </span>
            ) : listData.notiType === "request" ? (
              <span>
                <span className="fw-bold my-0">คำขอเข้าร่วมกลุ่ม</span><br />
                <span className="fw-bold">{listData.sender}</span>{" "}
                ต้องการเข้าร่วมกลุ่ม
                <span className="fw-medium">
                <br />{timeAgo(listData.createdAt)} | <span className="fw-bold">{listData.group}</span>
                </span>
              </span>
            ) : listData.notiType === "acceptRequest" ? (
              <span>
                <span className="fw-bold my-0">การตอบรับคำขอ</span><br />
                คุณได้เข้าร่วมกลุ่ม
                <span className="fw-bold"> {listData.group} </span> แล้ว{" "}
                <span className="fw-medium">
                <br />{timeAgo(listData.createdAt)} | <span className="fw-bold">{listData.group}</span>
                </span>
              </span>
            ) : null}
          </div>
        </li>
      ) : null}
    </>
  );
}
