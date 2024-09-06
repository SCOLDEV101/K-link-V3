import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import config from "../constants/function";

function AcceptFriendRequest() {
  // const data = Array.from({ length: 10 }, (_, i) => i + 1); // ทำ Array ตัวเลขไว้เทสเฉยๆ
  const headersAuth = config.Headers().headers;
  const location = useLocation();
  const hID = location.state.id || {};
  const groupName = location.state.name || {};
  const [reQuests, setReQuests] = useState([]);
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [updateStatus, setUpateStatus] = useState(false);
  useEffect(() => {
    const fetchRequest = async (id) => {
      // console.log(acceptedItems, rejectedItems);
      try {
        const request = await axios.get(config.SERVER_PATH + `/api/hobby/requestMember/${id}`, { headers: headersAuth, withCredentials: true })
        if (request.data.status === 'ok') {
          // console.log(request.data.data)
          setReQuests(request.data.data)
        } else {
          console.error("Something went wrong !, please try again.");
        }
      } catch (error) {
        console.error("Error fetching Request :", error);
      }
    };
    // console.log("hID :",hID)
    fetchRequest(hID);
    // console.log(acceptedItems, rejectedItems); // check useEffect
  }, []);

  const accepted = async (uId) => {
    setAcceptedItems((prev) => [...prev, uId]);
    AcceptedOrRejected(hID, uId, "accept");
    // console.log("Accepted :", uId);
  };

  const rejected = async (uId) => {
    setRejectedItems((prev) => [...prev, uId]);
    AcceptedOrRejected(hID, uId, "reject");
    // console.log("Rejected :", uId);
  };
  
  const AcceptedOrRejected = async (hId, uId, method) => {
    try {
      const statusPost = await axios.post(config.SERVER_PATH + `/api/hobby/rejectOrAcceptMember/${hId}`, { method: method, uID: uId } , { headers: headersAuth, withCredentials: true } );
      if (statusPost.data.status === 'ok') {
        setUpateStatus(!updateStatus);
      }
    } catch (error) {
      console.error("Failed to "+method+" this request :", error);
    }
  }

  return (
    <div className="overflow-hidden">
      <div
        className="d-flex align-items-end bg-transparent p-2 pb-0 w-100"
        style={{ height: "155px" }}
      >
        <h3 style={{ fontSize: "1.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          คำขอเข้าร่วมกลุ่ม : <span className="fw-bold">{groupName}</span>
        </h3>
      </div>
      <div
        className="mb-0 ps-0 py-3"
        style={{ maxHeight: "calc(100vh - 155px)", overflowY: "auto" }}
      >
        <ul className="mb-0 px-0">
          {reQuests.length > 0 ? (
            reQuests.map((request, i) => (
              <li
                key={request.uID}
                className="list-unstyled py-2 ps-4 d-flex flex-row align-items-center justify-content-center"
                style={{ borderBottom: "0.1px solid #000" }}
              >
                <img
                  src={false ? 1 : "./Empty-Profile-Image.svg"}
                  alt=""
                  className="rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="d-flex flex-column justify-content-center align-items-center gap-2 ms-3 w-100">
                  <h5
                    className="mb-0 fw-bold"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {
                      request.username
                    }
                  </h5>
                  {!acceptedItems.includes(request.uID) && !rejectedItems.includes(request.uID) ? ( // เช็คว่าควรจะเป็น สถานะหรือว่าเป็นปุ่ม
                    <>
                      <button
                        onClick={() => accepted(request.uID)}
                        type="button"
                        style={{
                          border: "none",
                          borderRadius: "5px",
                          background: "#FFB600",
                          height: "35px",
                          width: "160px",
                        }}
                      >
                        ยอมรับคำขอ
                      </button>
                      <button
                        onClick={() => rejected(request.uID)}
                        type="button"
                        style={{
                          border: "none",
                          borderRadius: "5px",
                          background: "#D9D9D9",
                          height: "35px",
                          width: "160px",
                        }}
                      >
                        ปฎิเสธคำขอ
                      </button>
                    </>
                  ) : acceptedItems.includes(request.uID) ? ( // เช็คว่าอันไหนเป็น acceptedItems บ้าง
                    <div
                      className="text-center py-1"
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        background: "#7CB518",
                        height: "35px",
                        width: "160px",
                      }}
                    >
                      เข้าร่วมกลุ่มแล้ว
                    </div>
                  ) : (
                    <div
                      className="text-center py-1"
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        background: "#FF0101",
                        height: "35px",
                        width: "160px",
                      }}
                    >
                      ปฎิเสธคำขอแล้ว
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <h3 className="fw-bold">ไม่มีคำขอเข้าร่วมกลุ่ม</h3>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AcceptFriendRequest;
