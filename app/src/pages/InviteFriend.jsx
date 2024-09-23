import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdGroupAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import config from "../constants/function";

// const data = {
//   faculty1: {
//     department1_1: ["major1_1_1", "major1_1_2", "major1_1_3"],
//     department1_2: [
//       "major1_2_1",
//       "major1_2_2dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
//       "major1_2_3",
//     ],
//     department1_3: ["major1_3_1", "major1_3_2", "major1_3_3"],
//   },
//   faculty2: {
//     department2_1: ["major2_1_1", "major2_1_2", "major2_1_3"],
//     department2_2: ["major2_2_1", "major2_2_2", "major2_2_3"],
//     department2_3: ["major2_3_1", "major2_3_2", "major2_3_3"],
//   },
//   faculty3: {
//     department3_1: ["major3_1_1", "major3_1_2", "major3_1_3"],
//     department3_2: ["major3_2_1", "major3_2_2", "major3_2_3"],
//     department3_3: ["major3_3_1", "major3_3_2", "major3_3_3"],
//   },
// };

const ListItem = ({ item, func }) => {
  const [buttonState, setButtonState] = useState(1);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (buttonState === 2) {
      const id = setTimeout(() => {
        setButtonState(3);
        console.log({ item });
        func(item.uID); //<--- send data to API here
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
    <li
      className="bg-white py-1 px-2 mx-3 mt-2"
      style={{ borderRadius: "5px" }}
    >
      <div className="d-flex flex-row justify-content-between align-items-center gap-3">
        <div
          className="d-flex flex-column"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "calc(100% - 80px)",
          }}
        >
          <h5
            className="m-0"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.username}
          </h5>
          <small>{item.uID}</small>
        </div>
        <button
          onClick={handleClick}
          className="btn p-1 px-2 d-flex flex-row align-items-center gap-1 text-nowrap"
          style={{
            background:
              buttonState === 1
                ? "#FFB600"
                : buttonState === 2
                ? "transparent"
                : "#7CB518",
            border:
              buttonState === 1
                ? "none"
                : buttonState === 2
                ? "3px solid #FFB600"
                : "none",
            borderRadius: "10px",
          }}
        >
          {/* <MdGroupAdd style={{ transform: "rotateY(180deg)" }} /> */}
          {/* <span>ชวน</span> */}
          {buttonState === 1 && (
            <MdGroupAdd style={{ transform: "rotateY(180deg)" }} />
          )}
          {buttonState === 1 && "ชวน"}
          {buttonState === 2 && "เลิกทำ"}
          {buttonState === 3 && "ชวนแล้ว"}
        </button>
      </div>
    </li>
  );
};

const InviteFriend = () => {
  // const items = Array.from({ length: 10 }, (_, i) => i + 1);
  const [Users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    filter_faculty: "",
    filter_major: "",
    search_Field_Box: "",
  });
  const location = useLocation();
  const hID = location.state?.id || {};
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
    getUsers(hID);
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
      getUsers(hID);
    }
  }, [filter.search_Field_Box]);

  // useEffect(() => {
  //   if (filter.filter_faculty) {
  //     sendFilterToApi({ filter_faculty: filter.filter_faculty });
  //   }
  // }, [filter.filter_faculty]);

  // useEffect(() => {
  //   if (filter.filter_major) {
  //     sendFilterToApi({ filter_major: filter.filter_major });
  //   }
  // }, [filter.filter_major]);

  // const getMajors = (faculty) => Object.values(data[faculty]).flat();

  const sendFilterToApi = async (filter) => {
    try {
      console.log("Filter:", JSON.stringify(filter));
      const response = await axios.post(
        config.SERVER_PATH + `/api/searching/searchInvite/${hID}`,
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

  const getUsers = async (hID) => {
    try {
      const Users = await axios.get(
        config.SERVER_PATH + `/api/user/invitePage/${hID}`,
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
          config.SERVER_PATH + `/api/user/inviteFriend/${hID}`,
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
        background: "linear-gradient(0deg, #F85B03, #F86A03, #F89603)",
      }}
    >
      <form className="px-1" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group mt-3">
          <div
            className="d-flex flex-row align-items-center gap-2 rounded-pill px-3 py-1 w-100"
            style={{
              background: "#D9D9D9",
              boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              name="search_Field_Box"
              value={filter.search_Field_Box}
              onChange={handleChange}
              style={{
                outline: "none",
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
            />
            <FaSearch style={{ fontWeight: "bold", fontSize: "24px" }} />
          </div>
        </div>
      </form>
      <div
        className="mt-3" // bg-secondary
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          borderRadius: "5px",
          overflowX: "hidden",
        }}
      >
        <ul className="list-unstyled m-0 p-0">
          {Users.length > 0 &&
            Users.map((item, i) => (
              <ListItem key={i} item={item} func={InviteFriend} />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default InviteFriend;

// กับ API สำหรับค้นหาเพื่อนบรรทัด 171
