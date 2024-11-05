import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../constants/function";
import { MdGroupAdd } from "react-icons/md";

function AboutTutoringGroup() {
  const navigate = useNavigate();
  const location = useLocation();
  const groupID = location.state?.groupID || {};
  const [aboutGroupData_tutoring, setAboutGroupData_tutoring] = useState({});
  const [_Error_, set_Error_] = useState(false);
  useEffect(() => {
    Get_About_Tutoring_Group_Data(groupID);
  }, []);

  async function Get_About_Tutoring_Group_Data(groupID) {
    if (groupID !== null || groupID !== undefined) {
      try {
        const request = await axios.get(
          config.SERVER_PATH + `/api/tutoring/aboutGroup/${groupID}`,
          { headers: config.Headers().headers, withCredentials: true }
        );
        if (request.data.status === "ok") {
          set_Error_(false);
          console.log("tutoring/aboutGroup/" + groupID, request.data.data);
          setAboutGroupData_tutoring(request.data.data);
        } else {
          console.error("Something went wrong !, please try again.");
          set_Error_(true);
        }
      } catch (error) {
        set_Error_(true);
        console.error(error);
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
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

    return `${day} ${monthNames[month]} ${year}`;
  };
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center m-0 px-0"
      style={{
        background: "linear-gradient(0deg, #FB6204, #F68302)",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {_Error_ ? (
        <div className="text-danger fs-3 fw-bold" style={{ marginTop: "52px" }}>
          <span className="text-decoration-underline fw-bolder">ERROR 404</span>{" "}
          : Page not found !!!
        </div>
      ) : (
        <div
          className="w-100"
          style={{
            overflowY: "auto",
            padding: "60px 10px",
            scrollbarWidth: "none",
          }}
        >
          <div
            className="card mt-5 border-0"
            style={{
              minWidth: "15rem",
              width: "100%",
              borderRadius: "20px",
              boxShadow: "5px 5px 0px rgba(0, 0, 0, .25)",
            }}
          >
            {aboutGroupData_tutoring.role && (
              <div
                className="position-absolute me-2 cursor-pointer"
                style={{ fontSize: "40px", right: "0px", color: "#949494" }}
              >
                <IoMdSettings
                  onClick={() => {
                    navigate("/tutoringeditgroup", {
                      state: {
                        groupData: aboutGroupData_tutoring,
                        status: "update",
                        groupID: groupID,
                      },
                    });
                  }}
                />
              </div>
            )}
            <div className="card-body mt-5">
              <h1 className="fw-bolder mb-3" style={{ fontSize: "50px" }}>
                {aboutGroupData_tutoring.activityName || ""}
              </h1>
              <div className="ps-2 mb-4">
                <h5 className="mb-0">
                  ผู้สอน: {aboutGroupData_tutoring.teachBy || ""}
                </h5>
                {aboutGroupData_tutoring.subjectName && (
                  <small className="fw-medium">
                    วิชา: {aboutGroupData_tutoring.subjectName}
                  </small>
                )}
                <small className="fw-bold">
                  {aboutGroupData_tutoring.faculty || ""}
                </small>
              </div>

              <h4 className="card-subtitle mt-2 mb-1">วันที่</h4>
              <div
                className="card"
                style={{ minHeight: "50px", background: "#D9D9D9" }}
              >
                <div className="card-body p-2">
                  <h2 className="text-center mb-0">
                    {aboutGroupData_tutoring.date
                      ? formatDate(aboutGroupData_tutoring.date)
                      : "วัน เดือน ปี"}
                  </h2>
                </div>
              </div>
              <h4 className="card-subtitle mt-2 mb-1">เวลา</h4>
              <div
                className="card"
                style={{ minHeight: "30px", background: "#D9D9D9" }}
              >
                <div className="card-body p-2">
                  <h6 className="text-center mb-0">
                    {formatTime(aboutGroupData_tutoring.Starttime) + " น." ||
                      "-- : -- น."}{" "}
                    -{" "}
                    {formatTime(aboutGroupData_tutoring.Endtime) + " น." ||
                      "-- : -- น."}
                  </h6>
                </div>
              </div>
              <h4 className="card-subtitle mt-2 mb-1">สถานที่</h4>
              <div
                className="card"
                style={{ minHeight: "50px", background: "#D9D9D9" }}
              >
                <div className="card-body p-2">
                  <h5 className="text-center mb-0">
                    {aboutGroupData_tutoring.location || ""}
                  </h5>
                </div>
              </div>
              <Link
                to={"/members"}
                state={{
                  groupID: aboutGroupData_tutoring.groupID,
                  name: aboutGroupData_tutoring.activityName,
                  type: aboutGroupData_tutoring.type,
                }}
                className="card text-decoration-none mt-3 px-2"
                style={{
                  background: "#D9D9D9",
                  minHeight: "30px",
                  width: "fit-content",
                }}
              >
                {aboutGroupData_tutoring.role !== null &&
                  aboutGroupData_tutoring.request !== undefined &&
                  aboutGroupData_tutoring.request > 0 && (
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
                      {aboutGroupData_tutoring.request &&
                      aboutGroupData_tutoring.request <= 9
                        ? aboutGroupData_tutoring.request
                        : "9+"}{" "}
                    </span>
                  )}
                <div className="d-flex flex-row justify-content-between align-items-center gap-2 mx-auto">
                  <p className="m-0 text-dark">
                    สมาชิก:
                    <span className="m-0" style={{ color: "#7CB518" }}>
                      &nbsp;
                      {aboutGroupData_tutoring.member
                        ? aboutGroupData_tutoring.member
                        : 0}{" "}
                      &nbsp;
                    </span>
                    /&nbsp;
                    {aboutGroupData_tutoring.memberMax
                      ? aboutGroupData_tutoring.memberMax
                      : "ไม่จำกัด"}
                  </p>
                  <span>
                    <HiSearch style={{ color: "#FF8500" }} />
                  </span>
                </div>
              </Link>
              <h4 className="card-subtitle mt-2 mb-1">รายละเอียด</h4>
              <div
                className="card"
                style={{ minHeight: "130px", background: "#D9D9D9" }}
              >
                <div className="card-body p-2">
                  <h5 className="ps-2 mb-0">
                    {aboutGroupData_tutoring.detail || ""}
                  </h5>
                </div>
              </div>
              <h4 className="card-subtitle my-2">Tag</h4>
              <div
                className="card mb-3"
                style={{ minHeight: "130px", background: "#D9D9D9" }}
              >
                <div className="p-2 d-flex flex-row flex-wrap align-items-start gap-2">
                  {aboutGroupData_tutoring.tag !== undefined &&
                    aboutGroupData_tutoring.tag.map((tag) => (
                      <div
                        key={tag}
                        className="badge rounded-pill text-dark px-3 py-2"
                        style={{
                          background: "#FFB600",
                          boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                          flex: "0 1 calc(25% - 0.5rem)",
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
                    groupID: aboutGroupData_tutoring.groupID,
                    name: aboutGroupData_tutoring.activityName,
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
      )}
    </div>
  );
}

export default AboutTutoringGroup;
