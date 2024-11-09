import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../constants/function";

function Notification() {
  const [listData, setListData] = useState([]);
  const headersAuth = config.Headers().headers;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const request = await axios.get(
          config.SERVER_PATH + `/api/user/notification`,
          { headers: headersAuth, withCredentials: true }
        );
        if (request.data.status === "ok") {
          setListData(request.data.data);
          console.log(request.data.data);
        } else {
          console.error("Something went wrong !, please try again.");
        }
      } catch (error) {
        console.error("Error fetching Notification :", error);
      }
    };
    fetchNotification();
  }, []);

  const formatTimestamp = (timestamp) => {
    const monthsOfYear = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const now = new Date();
    const date = new Date(timestamp);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date >= today;
    const isYesterday = date >= yesterday && date < today;

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isToday) {
      return `วันนี้ - ${hours}.${minutes}น.`;
    } else if (isYesterday) {
      return `เมื่อวาน - ${hours}.${minutes}น.`;
    } else {
      const day = date.getDate();
      const month = monthsOfYear[date.getMonth()];
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year} - ${hours}.${minutes}น.`;
    }
  };

  const handleClick = (item) => {
    if (item.notiType === "report" && item.groupID === null && item.groupType === 'user'
    ) {
      navigate("/aboutReport", {
        state: { reportType: "user" },
      });
    } else if (item.notiType === "report" && item.groupID && item.groupType 
    ) {
      navigate("/aboutReport", {
        state: { reportType: "group" },
      });
    }
  };


  
  return (
    <div className="container px-3 py-2" style={{ height: "100vh" }}>
      <ul
        className="list-unstyled d-grid gap-3 pb-3"
        style={{ position: "relative", top: "100px" }}
      >
        {listData && listData.length > 0 ? (
          listData.map((item, i) => (
            <li
              className="d-flex align-items-center flex-row border-none p-3"
              style={{
                borderRadius: "15px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
              }}
              onClick={() => handleClick(item)}  
              key={i}
            >
            <div className="position-relative" 
            style={{
              width: "50px",
              height: "50px",
            }}
            >
            <img
              src={
                 item.image
                  ? `${config.SERVER_PATH}${item.image}`
                  :  item.groupType === "hobby"  
                  ? "../Hobby_Default_Cover.png"
                  :  item.groupType === "library"  
                  ? "../Library_Default_Cover.png"
                  : item.groupType === "tutoring"  
                  ? "../Tutoring_Default_Cover.png"
                  : "./Empty-Profile-Image.svg"
                }
                alt="profile"
                className="rounded-circle position-relative bg-dark"
                style={{
                  width: "50px",
                  height: "50px",
                  border: 
                    item.notiType === "report" || item.notiType === "kick" || item.notiType === "delete"
                      ? "2px solid #B3261E"
                      : (item.notiType === "acceptRequest" || item.notiType === "request" || item.notiType === "invite") && item.groupType === "tutoring"
                      ? "2px solid #FFB600"
                      : (item.notiType === "acceptRequest" || item.notiType === "request" || item.notiType === "invite") && item.groupType === "hobby"
                      ? "2px solid #21005D"
                      : "none",
                  objectFit: "cover",
                  boxShadow: "inset 0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)",
                }}
              />
              {item.notiType === "report" && (
              <div className="position-absolute"
              style={{
                bottom:"0",
                right:"-5px",
              }}
              >
              <img src="../reportIcon.svg" alt="" width='25px'/>
              </div>
              )}
              {item.notiType === "delete" && (
              <div className="position-absolute"
              style={{
                bottom:"0",
                right:"-5px",
              }}
              >
              <img src="../deleteIcon.svg" alt="" width='25px'/>
              </div>
              )}
              {item.notiType === "kick" && (
              <div className="position-absolute"
              style={{
                bottom:"0",
                right:"-5px",
              }}
              >
              <img src="../kickIcon.svg" alt="" width='25px'/>
              </div>
              )}
  
            </div>
              <div
                className="ms-3 d-flex align-items-center text-break"
                style={{ fontSize: ".8rem" }}
              >
                {item.notiType === "report" && item.groupID === null && item.groupType === 'user' ? ( //คนโดยรีพอต
                  <span>
                    <span className="fw-bold my-0">คุณถูกรายงาน</span>
                    <br />
                    <span className="text-decoration-underline my-0">{item.reportID}</span>
                    <br/>
                    โปรดแก้ไขตามมาตราฐานชุมชน
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                ) : item.notiType === "report" && item.groupID  && item.groupType !== 'user' && item.groupType ? ( //กลถ่มโดนรีพอต
                  <span>
                    <span className="fw-bold my-0">กลุ่มของคุณถูกรายงาน</span>
                    <br />
                    <span className="text-decoration-underline my-0">{item.reportID}</span>
                    <br/>
                    โปรดแก้ไขตามมาตราฐานชุมชน
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                ) : item.notiType === "delete" && item.groupType === 'library' ? ( //โพสไลบารี่โดนลบ
                  <span>
                    <span className="fw-bold my-0">เนื้อหาของคุณถูกลบ</span>
                    <br />
                    เนื่องจากขัดกับมาตราฐานชุมชน
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                )
                : item.notiType === "delete" ? ( //กลุ่มโดนลบ
                  <span>
                    <span className="fw-bold my-0">กลุ่มที่คุณเป็นสมาชิกอยู่ถูกลบ</span>
                    <br />
                    {item.groupType === 'tutoring' ? "กลุ่มติว" :"กลุ่ม"} {" "}
                    <span className="text-decoration-underline my-0">{item.group}</span>
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                )
                : item.notiType === "acceptRequest" ? ( //ได้เข้าร่วมกลุ่ม
                  <span
                  onClick={() => {
                    if (item.groupType === "hobby") {
                      navigate("/abouthobbygroup", {
                        state: { groupID: item.groupID },
                      });
                    } else if (item.groupType === "tutoring") {
                      navigate("/abouttutoringgroup", {
                        state: { groupID: item.groupID },
                      });
                    }
                  }}
                  >
                    <span className="fw-bold my-0">คุณได้เข้าร่วมกลุ่มแล้ว</span>
                    <br />
                    {item.groupType === 'tutoring' ? "กลุ่มติว" :"กลุ่ม"} {" "}
                    <span className="text-decoration-underline my-0">{item.group}</span>
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                )
                : item.notiType === "kick" ? ( //โดนไล่ออกจากกลุ่ม
                  <span>
                    <span className="fw-bold my-0">คุณถูกลบออกจากกลุ่ม</span>
                    <br />
                    {item.groupType === 'tutoring' ? "กลุ่มติว" :"กลุ่ม"} {" "}
                    <span className="text-decoration-underline my-0">{item.group}</span>
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                )
                : item.notiType === "request" ? ( //ขอเข้าร่วมกลุ่ม
                  <span    
                   onClick={() => navigate("/acceptRequest", {
                    state: { groupID: item.groupID, name: item.group, groupType: item.groupType },
                  })}
                  >
                    <span className="fw-bold my-0">{item.sender}</span>{" "}
                    <span className="my-0">ต้องการเข้าร่วมกลุ่ม</span>
                    <br />
                    {item.groupType === 'tutoring' ? "กลุ่มติว" :"กลุ่ม"} {" "}
                    <span className="text-decoration-underline my-0">{item.group}</span>
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                ) 
                : item.notiType === "invite" ? ( //ได้รับคำเชิญเ้ากลุ่ม
                  <span    
                  onClick={() => {
                    if (item.groupType === "hobby") {
                      navigate("/abouthobbygroup", {
                        state: { groupID: item.groupID },
                      });
                    } else if (item.groupType === "tutoring") {
                      navigate("/abouttutoringgroup", {
                        state: { groupID: item.groupID },
                      });
                    }
                  }}
                  >
                    <span className="fw-bold my-0">คุณได้รับคำเชิญเข้าร่วมกลุ่ม</span>
                    <br />
                    {item.groupType === 'tutoring' ? "กลุ่มติว" :"กลุ่ม"} {" "}
                    <span className="text-decoration-underline my-0">{item.group}</span>
                    <span className="fw-medium">
                      <br /> {formatTimestamp(item.createdAt)}
                    </span>
                  </span>
                ) 
                : (
                  <></>
                )}
              </div>
            </li>
          ))
        ) : (
          <div
            className="d-flex align-items-center justify-content-center flex-row border-none px-5 py-4 mt-3 mx-1"
            style={{
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
              color: "#979797",
            }}
          >
            -- ไม่พบการแจ้งเตือน --
          </div>
        )}
      </ul>
    </div>
  );  
}

export default Notification;
