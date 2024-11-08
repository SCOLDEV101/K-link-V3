import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../constants/function";

function AcceptFriendRequest() {
  // const data = Array.from({ length: 10 }, (_, i) => i + 1); // ทำ Array ตัวเลขไว้เทสเฉยๆ
  const headersAuth = config.Headers().headers;
  const navigate = useNavigate();
  const location = useLocation();
  const groupID = location.state.groupID || {};
  const groupName = location.state.name || {};
  const groupType = location.state.groupType || {};
  const [reQuests, setReQuests] = useState([]);
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [updateStatus, setUpateStatus] = useState(false);
  useEffect(() => {
    const fetchRequest = async (id) => {
      // console.log(acceptedItems, rejectedItems);
      try {
        const request = await axios.get(
          config.SERVER_PATH + `/api/${groupType}/requestMember/${id}`,
          { headers: headersAuth, withCredentials: true }
        );
        if (request.data.status === "ok") {
          // console.log(request.data.data)
          setReQuests(request.data.data);
          console.log(request.data.data);
        } else {
          console.error("Something went wrong !, please try again.");
        }
      } catch (error) {
        console.error("Error fetching Request :", error);
      }
    };
    // console.log("hID :",hID)
    fetchRequest(groupID);
    // console.log(acceptedItems, rejectedItems); // check useEffect
  }, []);

  const accepted = async (uId) => {
    setAcceptedItems((prev) => [...prev, uId]);
    AcceptedOrRejected(groupID, uId, "accept");
    // console.log("Accepted :", uId);
  };

  const rejected = async (uId) => {
    setRejectedItems((prev) => [...prev, uId]);
    AcceptedOrRejected(groupID, uId, "reject");
    // console.log("Rejected :", uId);
  };

  const AcceptedOrRejected = async (groupID, uId, method) => {
    try {
      const statusPost = await axios.post(
        config.SERVER_PATH + `/api/hobby/rejectOrAcceptMember/${groupID}`,
        { method: method, uID: uId },
        { headers: headersAuth, withCredentials: true }
      );
      if (statusPost.data.status === "ok") {
        setUpateStatus(!updateStatus);
      }
    } catch (error) {
      console.error("Failed to " + method + " this request :", error);
    }
  };

  const handleInfoClick = (uID, groupID, role, type) => {
    navigate("/aboutaccount", { state: { uID, groupID, role, type } });
    console.log(type);
  };

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

  return (
    <>
      <div className="container px-3 py-2" style={{ height: "100vh" }}>
        <ul
          className="list-unstyled d-grid gap-3 pb-3"
          style={{ position: "relative", top: "100px" }}
        >
          {reQuests && reQuests.length > 0 ? (
            reQuests.map((request, i) => (
              <li
                key={request.uID}
                className="d-flex align-items-center flex-row border-none p-3"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
                }}
              >
                <img
                  onClick={() =>
                    handleInfoClick(request.uID, groupID, "normal", groupType)
                  }
                  src={
                    request.profileImage
                      ? `http://127.0.0.1:8000/uploaded/profileImage/${request.profileImage}`
                      : "./Empty-Profile-Image.svg"
                  }
                  alt="profile"
                  className="rounded-circle position-relative bg-dark"
                  style={{ width: "50px", height: "50px" }}
                />
                <div
                  className="ms-3 d-flex text-break flex-column w-100"
                  style={{ fontSize: ".8rem" }}
                >
                  <span
                    className="fw-bold my-0"
                    onClick={() =>
                      handleInfoClick(request.uID, groupID, "normal", groupType)
                    }
                  >
                    {request?.username}
                  </span>
                  <span
                    className="my-0"
                    onClick={() =>
                      handleInfoClick(request.uID, groupID, "normal", groupType)
                    }
                  >
                    {formatTimestamp(request?.timestamps)}
                  </span>

                  {!acceptedItems.includes(request.uID) &&
                  !rejectedItems.includes(request.uID) ? ( // เช็คว่าควรจะเป็น สถานะหรือว่าเป็นปุ่ม
                    <div className="row row-cols-lg-auto px-2 mt-2">
                      <div
                        className="col-6 px-1"
                        onClick={() => rejected(request.uID)}
                      >
                        <button
                          onClick={() => rejected(request.uID)}
                          type="button"
                          className="w-100 px-2 py-1 text-white"
                          style={{
                            border: "none",
                            borderRadius: "5px",
                            background: "#B3261E",
                            fontSize: "15px",
                          }}
                        >
                          ปฎิเสธ
                        </button>
                      </div>

                      <div
                        className="col-6 px-1"
                        onClick={() => accepted(request.uID)}
                      >
                        <button
                          onClick={() => accepted(request.uID)}
                          type="button"
                          className="w-100 px-2 py-1 text-white"
                          style={{
                            border: "none",
                            borderRadius: "5px",
                            background: "#7CB518",
                            fontSize: "15px",
                          }}
                        >
                          ยอมรับ
                        </button>
                      </div>
                    </div>
                  ) : acceptedItems.includes(request.uID) ? ( // เช็คว่าอันไหนเป็น acceptedItems บ้าง
                    <div
                      className="text-start py-1 w-100"
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "15px",
                      }}
                    >
                      คุณได้ตอบรับการเข้ากลุ่มแล้ว
                    </div>
                  ) : (
                    <div
                      className="text-start py-1 w-100"
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "15px",
                      }}
                    >
                      ปฏิเสธคำขอเข้ากลุ่มแล้ว
                    </div>
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
              -- ไม่พบคำขอเข้าร่วม --
            </div>
          )}
        </ul>
      </div>
    </>
  );
}

export default AcceptFriendRequest;
