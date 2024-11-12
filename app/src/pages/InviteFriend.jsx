import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearch } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import config from "../constants/function";

const ListItem = ({ item, func }) => {
  const [buttonState, setButtonState] = useState(1);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (buttonState === 2) {
      const id = setTimeout(() => {
        setButtonState(3);
        console.log({ item });
        func(item.uID);
      }, 3000);
      setTimeoutId(id);
    }
    return () => clearTimeout(timeoutId);
  }, [buttonState]);

  const handleClick = () => {
    if (buttonState === 1) {
      setButtonState(2);
    } else if (buttonState === 2) {
      clearTimeout(timeoutId);
      setButtonState(1);
    }
  };

  return (
      <div className="d-flex flex-row justify-content-between align-items-center gap-3 my-2 flex-row"
      >
        <div className="d-flex align-items-center">
          <img
            src={
              item.profileImage
                ? `http://127.0.0.1:8000/uploaded/profileImage/${item.profileImage}`
                : "./Empty-Profile-Image.svg"
            }
            alt="profile"
            className="rounded-circle position-relative bg-dark"
            style={{ width: "50px", height: "50px" }}
          />
          <div
            className="ms-2 d-flex align-items-center text-break"
            style={{ fontSize: ".8rem" }}
          >
                <span>
                <span className="fw-bold">{item.username}</span>
                <br />
                <span>{item.fullname}</span>
                <br />
                <span className="fw-bold">{item.email}</span>
              </span>
          </div>
        </div> 
        <button
            onClick={handleClick}
            className="btn d-flex flex-row align-items-center justify-content-center gap-1 text-nowrap border-none"
            style={{
              background:
                buttonState === 1
                  ? "#F89603"
                  : "#E7E7E7",
              borderRadius: "10px",
              width:"70px",
              color: buttonState === 2 ? "#000000" : "#ffffff",
            }}
          >
            {buttonState === 1 && "ชวน"}
            {buttonState === 2 && "เลิกทำ"}
            {buttonState === 3 && "ชวนแล้ว"}
          </button>
      </div>
  );
};

const InviteFriend = () => {
  const [Users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    filter_faculty: "",
    filter_major: "",
    search_Field_Box: "",
  });
  const location = useLocation();
  const groupID = location.state?.groupID || {};
  const headersAuth = config.Headers().headers;

  const handleChange = (e) => {
    if (e.target.name === "search_Field_Box") {
      setFilter({
        filter_faculty: "",
        filter_major: "",
        search_Field_Box: e.target.value,
      });
    } else {
      const { name, value } = e.target;
      setFilter((prev) => ({
        ...prev,
        [name]: value,
        search_Field_Box: "",
      }));
    }
  };

  useEffect(() => {
    getUsers(groupID);
  }, []);

  useEffect(() => {
    if (filter.search_Field_Box !== "") {
      console.log("No input");

      const timer = setTimeout(() => {
        if (filter.search_Field_Box) {
          sendFilterToApi({ search_Field_Box: filter.search_Field_Box });
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      getUsers(groupID);
    }
  }, [filter.search_Field_Box]);


  const sendFilterToApi = async (filter) => {
    try {
      console.log("Filter:", JSON.stringify(filter));
      const response = await axios.post(
        config.SERVER_PATH + `/api/searching/searchInvite/${groupID}`,
        { keyword: filter.search_Field_Box },
        { headers: headersAuth, withCredentials: true }
      );
      if (response.data.status === "ok") {
        console.log("sendFilter successfully");
        console.log("API response:", response.data);
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getUsers = async (groupID) => {
    try {
      const Users = await axios.get(
        config.SERVER_PATH + `/api/user/invitePage/${groupID}`,
        { headers: headersAuth, withCredentials: true }
      );
      if (Users.data.status === "ok") {
        console.log("Users.data.data", Users.data.data);
        setUsers(Users.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const InviteFriend = async (uId) => {
    try {
      await axios
        .post(
          config.SERVER_PATH + `/api/user/inviteFriend/${groupID}`,
          { receiver: uId },
          { headers: headersAuth, withCredentials: true }
        )
        .then(console.log("Invite success"));
    } catch (error) {
      console.error("InviteFriend error:", error);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        overflow: "hidden",
        paddingTop: "95px",
        background: "#F6F6F6",
      }}
    >
        <div className="form-group mt-3">
          <div
            className="bg-white py-4 px-3 my-3 mx-3 border-none"
            style={{
              borderRadius:"10px",
              boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
              }} 
          >
          <p className="my-0">ค้นหา</p>
          <div className="row row-cols-lg-auto g-3 align-items-center px-2">
            <div className="col-10" style={{paddingLeft:"0"}}>
            <input
              type="text"
              className="form-control py-2 px-3 "
              placeholder="ค้นหาชื่อเพื่อนหรือรหัสนักศึกษา"
              name="search_Field_Box"
              value={filter.search_Field_Box}
              onChange={handleChange}
              style={{
                background: "transparent",
                boxShadow: "none",
                borderRadius:"5px",
              }}
            />
            </div>
            <div className="col-2 py-2 text-center" style={{
              backgroundColor:"#F89603",
              borderRadius:"5px",
            }}
            onClick={(e) => e.preventDefault()}
            >
            <IoSearch className="text-white" style={{ fontWeight: "bold", fontSize: "24px" }} />
            </div>
          </div>
        </div>
        </div>
      <div
        className="mt-3" // bg-secondary
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          borderRadius: "5px",
          overflowX: "hidden",
        }}
      >
    <div
      className="bg-white py-2 px-2 mx-3 my-3 border-none"
      style={{
        borderRadius:"10px",
        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
        }} 
    >
        <ul className="list-unstyled m-0 p-0">
          {Users.length ? (
            Users.map((item, i) => (
              <ListItem key={i} item={item} func={InviteFriend} />
            ))
          ) : (
            <p className="py-4 my-0 text-center" style={{ color: "#979797" }}>-- ไม่พบผู้ใช้ --</p>
          )}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default InviteFriend;

// กับ API สำหรับค้นหาเพื่อนบรรทัด 171
