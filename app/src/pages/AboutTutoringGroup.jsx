import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut , FiEdit3 } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import config from "../constants/function";
import Swal from "sweetalert2";


function AboutTutoringGroup() {
  const navigate = useNavigate();
  const location = useLocation();
  const headersAuth = config.Headers().headers;
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

  const daysThai = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

const dayColors = {
  "จ.": "#FFB600",
  "อ.": "#EFB8C8",
  "พ.": "#7CB518",
  "พฤ.": "#F96E20",
  "ศ.": "#729BC0",
  "ส.": "#A970C4",
  "อา.": "#B3261E",
};
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

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.getDay(); 
  };

  const leaveGroup = async (groupID) => {
    const result = await Swal.fire({
            title: "ออกจากกลุ่มนี้?",
            showCancelButton: true,
            reverseButtons: true, 
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            customClass: {
              container: 'swal-container',
              title: 'swal-title swal-titlediscard',
              popup: 'swal-popup',
              cancelButton: 'swal-cancel-button' ,
              confirmButton: 'swal-confirmRed-button', 
            }
          });
        if (result.isConfirmed) {
    try {
      const response = await axios.post(
        config.SERVER_PATH + `/api/user/leaveGroup/${groupID}`,
        {}, 
        {
          headers: headersAuth,
          withCredentials: true,
        }
      );
      if (response.data.status === "ok") {
        console.log("leave group success");
        // Swal.fire({
        //             position: "center",
        //             title: "ออกจากกลุ่มแล้ว",
        //             showConfirmButton: false,
        //             timer: 2000,
        //             customClass: {
        //               title: 'swal-title-success',
        //               container: 'swal-container',
        //               popup: 'swal-popup-error',
        //             }
        //           });
        navigate("/hobby")
      }
    } catch (error) {
      console.error("There was an error leaving the group!", error);
    }
  }
  };

  const handleButtonClick = async (id, status) => {
    try {
      const res = await axios.post(
        config.SERVER_PATH + `/api/user/joinGroup/${id}`,
        {},
        { headers: headersAuth, withCredentials: true }
      );

      if (res.data.status === "ok") {
        let successMessage = "ส่งคำขอเข้าร่วมกลุ่มแล้ว";

        if (status === "join") {
          successMessage = "ยกเลิกคำขอเข้าร่วมกลุ่มแล้ว";
        }

        Swal.fire({
          position: "center",
          title: successMessage,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: "swal-title-success",
            container: "swal-container",
            popup: "swal-popup-success",
          },
        });

        console.log(status + " group success");
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        position: "center",
        title: "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: "swal-title-error",
          container: "swal-container",
          popup: "swal-popup-error",
        },
      });
    }
  };

  const handleStatusUpdate = async (groupID, newStatus) => {
    let swalOptions = {
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: "swal-container",
        title: "swal-title",
        popup: "swal-popup",
        cancelButton: "swal-cancel-button",
      },
    };

    if (newStatus === "request") {
      swalOptions.title = "ต้องการขอเข้าร่วมกลุ่มหรือไม่?";
      swalOptions.confirmButtonText = "ตกลง";
      swalOptions.customClass.confirmButton = "swal-confirm-button";
    } else if (newStatus === "join") {
      swalOptions.title = "ยกเลิกคำขอเข้าร่วมกลุ่มหรือไม่?";
      swalOptions.confirmButtonText = "ยกเลิกคำขอ";
      swalOptions.customClass.confirmButton = "swal-confirmRed-button";
    }

    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      setAboutGroupData_tutoring((prevData) => ({
        ...prevData,
        userstatus: newStatus,
      }));
      handleButtonClick(groupID, newStatus);
    }
  };

  

  return (
    <div
      className="container-fluid d-flex justify-content-center m-0 px-0"
      style={{
        background: "#F6F6F6",
        height: "auto",
        overflow: "hidden",
      }}
    >
      {_Error_ ? (
        <div className="text-danger fs-3 fw-bold" style={{ marginTop: "52px" }}>
          <span className="text-decoration-underline fw-bolder">ERROR 404</span>{" "}
          : Page not found !!!
        </div>
      ) : (
        <div className="container-fluid d-flex justify-content-center my-5">
        <div
          className="card mt-5 border-0"
          style={{
            minWidth: "15rem",
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          }}
        >
          <div
            className="position-absolute me-2 cursor-pointer"
            style={{ fontSize: "40px", right: "0px", color: "#949494" }}
          >
          </div>
          <div className="card-body">
          <p
              className="text-start my-0 mt-3"
            >
              ชื่อกลุ่ม
            </p>
            <p
              className="text-start p-2 text-wrap"
              style={{color: "#979797" ,borderRadius:"5px",border: "1px solid #E7E7E7"}}
            >
              {aboutGroupData_tutoring.activityName}
            </p>
            <div className="position-relative mx-auto my-1"
                  style={{
                    width: "100%",
                    height: "25vw",
                    maxHeight: "200px",
                    maxWidth: "450px",
                  }}
                >
              <img
                src={
                    aboutGroupData_tutoring.image != null && aboutGroupData_tutoring.image !== null 
                    ? `${config.SERVER_PATH}/uploaded/hobbyImage/${aboutGroupData_tutoring.image}`
                    : "../Default_Cover.png"
                  }
                alt="image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #E7E7E7",
                  boxShadow: "inset 0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)",
                }}
              />
            </div>
            <div className="d-flex justify-content-around my-3">
                  {daysThai.map((day, index) => {
                    const currentDayIndex = getDayOfWeek(aboutGroupData_tutoring.date); 
                    return(
                    <p
                      key={index}
                      className="m-0"
                      style={{
                        paddingLeft:".35rem",
                        paddingRight:".35rem", 
                        color: index === currentDayIndex ? "#000000" : "#E7E7E7",
                        fontSize: "18.95px",
                        border:index === currentDayIndex ? `1.35px solid ${dayColors[day]}` : "1.35px solid #E7E7E7" ,
                        borderRadius:
                          day === "อา." || day === "พฤ." ? "15px" : "50%",
                      }}
                    >
                      {day}
                    </p>
                      )})}
                </div>
                <div>
            <p
              className="text-start my-1"
            >
              คณะ
            </p>
            <p
              className="text-center px-2 py-1 my-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #625B71"}}
            >
            {aboutGroupData_tutoring.faculty ? aboutGroupData_tutoring.faculty : "-"}
              </p>
            </div>
                <div>
            <p
              className="text-start my-1"
            >
              ภาควิชา
            </p>
            <p
              className="text-center px-2 py-1 my-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #625B71"}}
            >
            {aboutGroupData_tutoring.major ? aboutGroupData_tutoring.major : "-"}
              </p>
            </div>
                <div>
            <p
              className="text-start my-1"
            >
              สาขา
            </p>
            <p
              className="text-center px-2 py-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #625B71"}}
            >
            {aboutGroupData_tutoring.section ? aboutGroupData_tutoring.section : "-"}
              </p>
            </div>

            <div>
            <p
              className="text-start my-0"
            >
             วันที่ 
            </p>
            <p
              className="text-start p-2"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
             {aboutGroupData_tutoring.date ? `${formatDate(aboutGroupData_tutoring.date)}` :"-"}
              </p>
            </div>

            <div className="row row-cols-lg-auto g-3 align-items-center">
              <div className="col-5">
                <div>
                <p
              className="text-start my-0"
            >
              ตั้งแต่
            </p>
            <p
              className="text-start border px-2 py-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
              {aboutGroupData_tutoring.startTime
                      ? aboutGroupData_tutoring.startTime.slice(0, 5)
                      : "-:-"}
            </p>
  
                </div>
              </div>
              <div className="col-2 p-auto px-0"> 
                <p className="text-center my-auto fw-bold"
                style={{fontSize:"20px"}}
                >-</p>
              </div>
              <div className="col-5">
              <div>
                <p
              className="text-start my-0 "
            >
              จนถึง
            </p>
            <p
              className="text-start border px-2 py-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
              {aboutGroupData_tutoring.endTime
                      ? aboutGroupData_tutoring.endTime.slice(0, 5)
                      : "-:-"}
            </p>
                </div>
              </div>
            </div>
            <p
              className="text-start my-0 "
            >
              จำนวนสมาชิก
            </p>
            <div className="row row-cols-lg-auto g-3 align-items-center">
                <div className="col-8">
            <p
              className="text-start border px-2 py-1"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
              &nbsp;{aboutGroupData_tutoring.member ? aboutGroupData_tutoring.member : 0}
                        &nbsp;
                      /&nbsp;
                      {aboutGroupData_tutoring.memberMax
                        ? aboutGroupData_tutoring.memberMax || aboutGroupData_tutoring.memberMax === 0
                        : "ไม่จำกัด"}
            </p>
                </div>
                <div className="col-4">
                <Link
                    to={"/members"}
                    state={{
                      groupID: aboutGroupData_tutoring.groupID,
                      name: aboutGroupData_tutoring.activityName,
                      type: aboutGroupData_tutoring.type,
                    }}
                    className="text-decoration-none position-relative"
                  >
                    {aboutGroupData_tutoring.role === "leader" &&
                      aboutGroupData_tutoring.request !== undefined &&
                      aboutGroupData_tutoring.request > 0 && (
                        <span
                          className="position-absolute text-center text-white"
                          style={{
                            background: "#FF4800",
                            width: "25px",
                            height: "25px",
                            borderRadius: "50%",
                            top: "-5px", 
                            right: "-5px",
                          }}
                        >
                          {aboutGroupData_tutoring.request && aboutGroupData_tutoring.request <= 9
                            ? aboutGroupData_tutoring.request
                            : "9+"}
                        </span>
                      )}
                    <p
                      className="text-center border px-2 py-1"
                      style={{
                        color: "#000000",
                        borderRadius: "5px",
                        backgroundColor: "#E7E7E7",
                      }}
                    >
                      ดูสมาชิก
                    </p>
                  </Link>
                </div>
            </div>
            <div>
            <p
              className="text-start my-0"
            >
              สถานที่
            </p>
            <p
              className="text-start p-2"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
            {aboutGroupData_tutoring.location ? aboutGroupData_tutoring.location : "-"}
              </p>
            </div>
            <div>
            <p
              className="text-start my-0"
            >
              รายละเอียด
            </p>
            <p
              className="text-start p-2"
              style={{color: "#979797" ,borderRadius:"5px" ,border: "1px solid #E7E7E7"}}
            >
            {aboutGroupData_tutoring.detail ? aboutGroupData_tutoring.detail : "-"}
              </p>
            </div>
            <div>
            <p
              className="text-start my-0"
            >
              Tag
            </p>
  
            <div
              className="card mb-3"
              style={{ minHeight: "130px", background: "#ffffff",borderRadius:"5px" ,border: "1px solid #E7E7E7" }}
            >
              <div
                className="p-2 d-flex flex-row flex-wrap align-items-start gap-2" //card-body
              >
                {aboutGroupData_tutoring.tag !== undefined &&
                  aboutGroupData_tutoring.tag.map((tag) => (
                    <div
                      key={tag}
                      className="badge text-dark px-3 py-2"
                      style={{
                        background: "#FFB600",
                        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
                        flex: "0 1 calc(25% - 0.5rem)", // Adjust this to fit 4 items per row
                        marginBottom: "0.5rem",
                        borderRadius:"2.5px",
                      }}
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
            </div>
  
            {aboutGroupData_tutoring.role === "leader" &&
          aboutGroupData_tutoring.userstatus === "member" ? (
            <div className="row row-cols-lg-auto g-3 align-items-center justify-content-center">
              <div className="col-10">
                <Link
                  to={"/tutoringeditgroup"}
                  state={{
                    groupData: aboutGroupData_tutoring,
                    status: "update",
                    groupID: groupID,
                  }}
                  className="text-decoration-none px-3 py-2 d-flex align-items-center justify-content-center"
                  style={{
                    background: "#FFB600",
                    borderRadius: "10px",
                  }}
                >
                  <span
                    className="text-dark text-decoration-none mt-1"
                    style={{ fontSize: "20px" }}
                  >
                    แก้ไขกลุ่ม
                  </span>
                  <FiEdit3
                    className="mx-2"
                    style={{
                      fontSize: "20px",
                      color: "#000000",
                    }}
                  />
                </Link>
              </div>
              <div className="col-2">
                <p
                  onClick={() =>
                    navigate("/invitefriend", {
                      state: {
                        groupID: aboutGroupData_tutoring.groupID,
                        name: aboutGroupData_tutoring.activityName,
                      },
                    })
                  }
                  className="text-white text-center border-none my-0 px-1 py-2 "
                  style={{
                    backgroundColor: "#7CB518",
                    borderRadius: "10px",
                    fontSize: "22.67px",
                  }}
                >
                  <IoMdPersonAdd style={{ transform: "scaleX(-1)" }} />
                </p>
              </div>
            </div>
          ) : aboutGroupData_tutoring.userstatus === "member" ? (
            <div className="row row-cols-lg-auto g-3 align-items-center justify-content-center">
              <div className="col-10">
                <Link
                  to={"/invitefriend"}
                  state={{
                    groupID: aboutGroupData_tutoring.groupID,
                    name: aboutGroupData_tutoring.activityName,
                  }}
                  className="text-decoration-none px-3 py-2 d-flex align-items-center justify-content-center"
                  style={{
                    background: "#FFB600",
                    borderRadius: "10px",
                  }}
                >
                  <span
                    className="text-dark text-decoration-none mt-1"
                    style={{ fontSize: "20px" }}
                  >
                    เพิ่มเพื่อน
                  </span>
                  <IoMdPersonAdd
                    className="mx-2"
                    style={{
                      fontSize: "20px",
                      color: "#000000",
                      transform: "scaleX(-1)",
                    }}
                  />
                </Link>
              </div>
              <div className="col-2">
                <p
                  onClick={() => leaveGroup(aboutGroupData_tutoring.groupID)}
                  className="text-white text-center border-none my-0 px-1 py-2 "
                  style={{
                    backgroundColor: "#B3261E",
                    borderRadius: "10px",
                    fontSize: "22.67px",
                  }}
                >
                  <FiLogOut />
                </p>
              </div>
            </div>
          ) : aboutGroupData_tutoring.userstatus !== "member" &&
            aboutGroupData_tutoring.role !== "leader" ? (
            <>
              <div>
                <button
                  className="w-100 text-decoration-none px-3 py-2 d-flex align-items-center justify-content-center"
                  style={{
                    background:
                      aboutGroupData_tutoring.userstatus === "join"
                        ? "#7CB518"
                        : aboutGroupData_tutoring.userstatus === "request"
                        ? "#B3261E"
                        : aboutGroupData_tutoring.userstatus === "full"
                        ? "#E7E7E7"
                        : "transparent",
                    borderRadius: "10px",
                    border: "none",
                  }}
                  disabled={aboutGroupData_tutoring.userstatus === "full"}
                  onClick={() => {
                    if (aboutGroupData_tutoring.userstatus === "join") {
                      handleStatusUpdate(aboutGroupData_tutoring.groupID, "request");
                    } else if (aboutGroupData_tutoring.userstatus === "request") {
                      handleStatusUpdate(aboutGroupData_tutoring.groupID, "join");
                    } else if (aboutGroupData_tutoring.userstatus === "full") {
                      return;
                    }
                  }}
                >
                  <span
                    className="text-white text-decoration-none mt-1"
                    style={{ fontSize: "20px" }}
                  >
                    {aboutGroupData_tutoring.userstatus === "join" && "ขอเข้าร่วมกลุ่ม"}
                    {aboutGroupData_tutoring.userstatus === "request" && "ยกเลิกคำขอเข้าร่วมกลุ่ม"}
                    {aboutGroupData_tutoring.userstatus === "full" && "กลุ่มเต็ม"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default AboutTutoringGroup;

