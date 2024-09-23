import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsis } from "react-icons/fa6";
import { HiSearch } from "react-icons/hi";
import { MdGroupAdd } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../constants/function";

const daysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
// const testData = [
//   {
//     hID: 1,
//     image: null,
//     tag: "tag1,tag2,tag3",
//     member: 1,
//     memberMax: 25,
//     request: 9,
//     activityName: "Prof. Jacklyn Rippin",
//     weekDate: "จ.,อ.,พ.,พฤ.,อา.",
//     actTime: "17:45:41",
//     location: "location ",
//     detail:
//       "Sint voluptatum inventore ullam accusamus ad illum amet deserunt ex maxime commodi qui quia tempore necessitatibus et ea et et quo explicabo veritatis est sit esse incidunt magnam itaque ipsam numquam eos corporis qui culpa non sit dicta et qui ut nostrum non autem enim accusantium dolor ut.",
//     role: "member",
//   },
// ];

function AboutHobbyGroup() {
  const navigate = useNavigate();
  const headersAuth = config.Headers().headers;
  const location = useLocation();
  const hID = location.state?.id || {};
  const [activeDays, setActiveDays] = useState([]);
  const [aboutGroupData, setAboutGroupData] = useState({});

  useEffect(() => {
    Get_AboutGroupData(hID);
  }, []);

  async function Get_AboutGroupData(hID) {
    try {
      const request = await axios.get(
        config.SERVER_PATH + `/api/hobby/aboutGroup/${hID}`,
        { headers: headersAuth, withCredentials: true }
      );
      if (request.data.status === "ok") {
        console.log("hobby/aboutGroup/" + hID, request.data.data);
        setAboutGroupData(request.data.data);
      } else {
        console.error("Something went wrong !, please try again.");
      }

      const activeDaysArray = request.data.data.weekDate // <-- edit here too
        .split(",")
        .map((day) => day.trim().replace(".", ""));
      setActiveDays(activeDaysArray);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container-fluid d-flex justify-content-center my-5">
      <div
        className="card mt-5 border-0"
        style={{
          minWidth: "15rem",
          width: "100%",
          borderRadius: "20px",
          boxShadow: "5px 5px 0px rgba(0, 0, 0, .25)",
        }}
      >
        <div
          className="position-absolute me-2 cursor-pointer"
          style={{ fontSize: "40px", right: "0px", color: "#949494" }}
        >
          {aboutGroupData.role === "leader" && (
            <IoMdSettings
              onClick={() => {
                navigate("/hobbyeditgroup", {
                  state: {
                    groupData: aboutGroupData,
                    status: "update",
                    hID: hID,
                  },
                });
              }}
            />
          )}
        </div>
        <div className="card-body">
          <h1
            className="card-title fw-bolder text-center mt-3"
            style={{ fontSize: "50px" }}
          >
            {aboutGroupData.activityName}
          </h1>
          <div className=" d-flex justify-content-center">
            <img
              src={
                aboutGroupData.image !== undefined &&
                aboutGroupData.image !== null
                  ? config.SERVER_PATH + `/uploaded/hobbyImage/${aboutGroupData.image}`
                  : "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png"
              }
              alt="image"
              style={{
                background: "#D9D9D9",
                borderRadius: "10px",
                maxWidth: "12rem",
                maxHeight: "12rem",
                minWidth: "5rem",
                minHeight: "5rem",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <h4 className="card-subtitle my-2">วันจัดกิจกรรม</h4>
          <div className="d-flex flex-row flex-wrap gap-1 align-items-center justify-content-center">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="border border-2 text-center d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: activeDays.includes(day) ? "#FFB600" : "#D9D9D9",
                }}
              >
                {day}
              </div>
            ))}
          </div>
          <h4 className="card-subtitle my-2">สถานที่</h4>
          <div className="d-flex flex-column gap-3 justify-content-center">
            <div
              className="card"
              style={{ minHeight: "30px", background: "#f6f6f6" }}
            >
              <div className="card-body p-2">
                <p className="m-0">
                  {aboutGroupData.location ? aboutGroupData.location : "-"}
                </p>
              </div>
            </div>
            <div className="d-flex flex-row gap-1">
              <div
                className="card text-center"
                style={{
                  background: "#D9D9D9",
                  flex: "1 1 33.33%",
                  minHeight: "30px",
                  backgroundColor: "#f6f6f6"
                }}
              >
                <p className="m-0 p-0" >
                  เวลา :{" "}
                  {aboutGroupData.actTime
                    ? aboutGroupData.actTime.slice(0, 5)
                    : "-:-"}
                </p>
              </div>
              <Link
                to={"/members"}
                state={{
                  id: aboutGroupData.hID,
                  name: aboutGroupData.activityName,
                }}
                className="card text-decoration-none"
                style={{
                  background: "#D9D9D9",
                  flex: "2 1 66.67%",
                  minHeight: "30px",
                  backgroundColor: "#f6f6f6"
                }}
              >
                {aboutGroupData.role !== null &&
                  aboutGroupData.request !== undefined &&
                  aboutGroupData.request > 0 && (
                    <span
                      className="position-absolute text-center text-white"
                      style={{
                        background: "#FF0101",
                        width: "25px",
                        height: "25px",
                        right: "-10px",
                        top: "-15px",
                        borderRadius: "50%",
                      }}
                    >
                      {aboutGroupData.request && aboutGroupData.request <= 9
                        ? aboutGroupData.request
                        : "9+"}
                    </span>
                  )}
                <div className="d-flex flex-row justify-content-between align-items-center gap-2 mx-auto">
                  <p className="m-0 text-dark">
                    สมาชิก:
                    <span className="m-0" style={{ color: "#7CB518" }}>
                      &nbsp;{aboutGroupData.member ? aboutGroupData.member : 0}
                      &nbsp;
                    </span>
                    /&nbsp;
                    {aboutGroupData.memberMax
                      ? aboutGroupData.memberMax
                      : "ไม่จำกัด"}
                  </p>
                  <span>
                    <HiSearch style={{ color: "#FF8500" }} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <h4 className="card-subtitle my-2">รายละเอียด</h4>
          <div
            className="card"
            style={{ minHeight: "130px", background: "#f6f6f6" }}
          >
            <div className="card-body p-2">
              <p className="m-0">
                {aboutGroupData.detail ? aboutGroupData.detail : null}
              </p>
            </div>
          </div>
          <h4 className="card-subtitle my-2">Tag</h4>
          <div
            className="card mb-3"
            style={{ minHeight: "130px", background: "#f6f6f6" }}
          >
            <div
              className="p-2 d-flex flex-row flex-wrap align-items-start gap-2" //card-body
            >
              {aboutGroupData.tag !== undefined &&
                aboutGroupData.tag.split(",").map((tag) => (
                  <div
                    key={tag}
                    className="badge rounded-pill text-dark px-3 py-2"
                    style={{
                      background: "#FFB600",
                      boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                      flex: "0 1 calc(25% - 0.5rem)", // Adjust this to fit 4 items per row
                      marginBottom: "0.5rem",
                    }}
                  >
                    {tag}
                  </div>
                ))}
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Link
              to={"/invitefriend"}
              state={{
                id: aboutGroupData.hID,
                name: aboutGroupData.activityName,
              }}
              className="text-decoration-none px-3 py-2 rounded-pill d-flex flex-row align-items-center"
              style={{
                background: "#7CB518",
                boxShadow: "4px 4px 0px rgba(0, 0, 0, .25)",
              }}
            >
              <MdGroupAdd
                className=""
                style={{
                  fontSize: "30px",
                  color: "white",
                  transform: "scaleX(-1)",
                }}
              />
              <span className="text-dark ms-2 fw-bold text-decoration-none">
                เชิญเพื่อนเข้ากลุ่ม
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutHobbyGroup;
