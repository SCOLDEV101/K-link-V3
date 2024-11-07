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
    fetchMembers(groupID);
  }, [groupID , requestCount]);

  const fetchMembers = async (groupID) => {
    try {
      const response = await axios.get(
        config.SERVER_PATH + `/api/${groupType}/memberGroup/${groupID}`,
        { headers: headersAuth, withCredentials: true }
      );
      if (response.data.status === "ok") {
        setGroupName(response.data.data.groupName);
        console.log("response.data",response.data);
        setMembers(response.data.data.members);
        setRequestCount(response.data.data.requestCount || 0);
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

  const handleRequest = (groupID, groupName , groupType ) => {
    navigate("/acceptRequest", { state: { groupID: groupID, name: groupName, groupType: groupType  } });
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
      className="card mt-4 py-3 mx-3 border-0"
      style={{
        // top: "20%",
        background: "#ffffff",
        borderRadius:'10px',
        zIndex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
      }}
      onClick={() => {
        if (!members[0].isMe) {
          handleInfoClick(members[0].uID, groupID, role, groupType);
        }
      }}
      >
        <p className="fw-bold text-center mx-4 my-0 py-1" style={{fontSize:"20px" , color:"#FF4800"}}>หัวหน้ากลุ่ม</p>
        <p className="fw-bold text-center mx-4 my-0 py-1" style={{ fontSize: "16px", borderRadius:"5px" , backgroundColor:"#F6F6F6"}}>
        {members[0]?.username} {members[0]?.isMe ? "(Me)" : ""}
        </p>      
        </div>
      <div
        className="card mt-4 py-3 mx-3 border-0"
        style={{
          background: "#ffffff",
          borderRadius:'10px',
          zIndex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
        }}
      >
          <table
            style={{borderCollapse: "collapse" }}
            className="my-1"
          >
            <tbody className="mx-1 my-5">
              {members.length > 0 &&
                members.slice(1).map((member, index) => (
                  <tr key={index}>
                   <td style={{ width: "10%" }}></td>
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
     <div className="position-fixed fixed-bottom d-flex justify-content-center"
     style={{
      bottom:"10%"
     }}
     >
          <button
            onClick={() => handleRequest(groupID, groupName , groupType)}
            className="btn fw-bold position-relative"
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
              className="position-absolute text-center text-white p-2"
              style={{
                background: "#FF4800",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                top: "-10px", 
                right: "-5px",
              }}
            >
              {requestCount && requestCount <= 9
                ? requestCount
                : "9+"}
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
