import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCrown } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdMailOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../constants/function";
import Header from "../components/Header";

function MemberPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const groupID = location.state.groupID || {};
  const groupType = location.state.type || {};
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [role, setRole] = useState("user");
  const [isMember, setIsMember] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
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
    // console.log("location", location)
    fetchMembers(groupID);
  }, []);

  const fetchMembers = async (groupID) => {
    try {
      const response = await axios.get(
        config.SERVER_PATH + `/api/${groupType}/memberGroup/${groupID}`,
        { headers: headersAuth, withCredentials: true }
      );
      if (response.data.status === "ok") {
        setGroupName(response.data.data.groupName);
        console.log("response.data",response.data);
        // console.log("1", response.data.data.groupName);
        setMembers(response.data.data.members);
        // console.log("2", response.data.data.members);
        setRequestCount(response.data.data.requestCount || 0);
        // console.log("3", response.data.data.requestCount);
        setRole(response.data.role || "user");
        setIsMember(response.data.isMember || null);
        setFetchdataLoading(false);
      }
    } catch (error) {
      console.error("There was an error fetching the members!", error);
    }
  };

  const handleInfoClick = (uID ,groupID, role , type) => {
    navigate("/aboutaccount", { state: { uID, groupID, role, type } });
    console.log(type);

  };

  const handleRequest = (groupID, groupName) => {
    navigate("/acceptRequest", { state: { groupID: groupID, name: groupName } });
  };


  return (
  <>
  <Header groupName={groupName} />
    <div
      className="container-fluid d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" , paddingTop:"100px"}}
    >
    {members.length > 0 ? (
    <div>
      <div
        className="card mt-4 pt-3 mx-3 border-0"
        style={{
          // top: "20%",
          height: role === "leader" ? "50vh" : "75vh",
          background: "#ffffff",
          borderRadius:'20px',
          zIndex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
        }}
      >
        <h4 className="fw-bold text-center m-3" style={{color:"#FF4800"}}>สมาชิกกลุ่ม ({members.length})</h4>
          <table
            style={{borderCollapse: "collapse" }}
            className="my-1"
          >
            <tbody className="mx-1 my-5">
              {members.length > 0 &&
                members.map((member, index) => (
                  <tr key={index}>
                   <td style={{ width: "10%" }}></td>
                    <td style={{ width: "5%"}}>
                      {index === 0 && <FaCrown className="mb-1" />}
                    </td>
                    <td style={{ width: "5%" }}></td>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: member.isMe === false ? "#000" : "#FF8500",
                        fontWeight: member.isMe === false ? "" : "bold",
                      }}
                      className="d-flex"
                    >
                      <span
                        className=""
                        style={{
                          display: "inline-block",
                          maxWidth: "55vw",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: member.isMe === false ? "#000" : "#FF8500",
                          fontWeight: member.isMe === false ? "" : "bold",
                        }}
                      >
                        {" "}
                        {member.username}
                      </span>
                    </td>
                    <td style={{ width: "10%" }}></td>
                    <td style={{ width: "5%" }}>
                      {member.isMe === false ? (
                        <AiOutlineInfoCircle
                          className="fs-5"
                          color="#D9D9D9"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleInfoClick(member.uID ,groupID , role , groupType)}
                        />
                      ) : (
                        <span
                          className="mx-1"
                          style={{
                            maxWidth: "55vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#FF8500",
                            fontWeight: "bold",
                          }}
                        >
                          Me
                        </span>
                      )}
                    </td>
                    <td style={{ width: "10%" }}></td>
                  </tr>
                ))}
            </tbody>
          </table>
      </div>
     {role === "leader" ? (
     <div className="d-flex justify-content-center">
          <button
            onClick={() => handleRequest(groupID, groupName)}
            className="btn fw-bold mt-5"
            style={{
              width:"90%",
              backgroundColor: "#FFB600",
              borderRadius: "20px",
              fontSize: "0.8rem",
              boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
            }}
          >
            <div style={{marginTop:"10px" , marginBottom:"10px" , fontSize:"16px"}}>
            <MdMailOutline className="fs-2" style={{marginRight:"10px" }}/>
            คำขอเข้าร่วมกลุ่ม
            </div>
            {requestCount > 0 && (
              <span
                className="badge bg-danger text-white position-absolute top-0 start-100 translate-middle"
                style={{
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {requestCount > 99 ? "99+" : requestCount}
              </span>
            )}
          </button>
        </div>
           ) : (
            <></>
          )}
    </div>
       ) : (
        <>
          {!timeoutReached ? (
            <div className="d-flex flex-row justify-content-center align-content-start pb-3">
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
  </>
  );
}

export default MemberPage;

// ฝากเปลี่ยนสีฟ้อน + ปรับตำแหน่งคำว่า Me ตรงบรรทัด 112 ถึง 125 คำว่า Me ใน figma กดแล้วไม่เกิดอะไร
