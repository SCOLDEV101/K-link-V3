import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLogOut, FiEdit3 } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../constants/function";
import Swal from "sweetalert2";

function AboutHobbyGroup() {
  const navigate = useNavigate();
  const headersAuth = config.Headers().headers;
  const location = useLocation();
  const groupID = location.state?.groupID || {};
  const [activeDays, setActiveDays] = useState([]);
  const [aboutGroupData, setAboutGroupData] = useState({});

  useEffect(() => {
    Get_AboutGroupData(groupID);
  }, []);

  async function Get_AboutGroupData(groupID) {
    try {
      const request = await axios.get(
        config.SERVER_PATH + `/api/hobby/aboutGroup/${groupID}`,
        { headers: headersAuth, withCredentials: true }
      );
      if (request.data.status === "ok") {
        console.log("hobby/aboutGroup/" + groupID, request.data.data);
        setAboutGroupData(request.data.data);
      } else {
        console.error("Something went wrong !, please try again.");
      }

      const activeDaysArray = request.data.data.weekDate // <-- edit here too
        .map((day) => day.trim().replace(".", ""));
      setActiveDays(activeDaysArray);
    } catch (error) {
      console.error(error);
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
                `${config.SERVER_PATH}/api/user/leaveGroup/${groupID}`,
                {}, 
                {
                  headers: headersAuth, 
                  withCredentials: true, 
                }
              );
              if (response.data.status === "ok") {
                console.log("leave group success");
                navigate("/hobby");
              }
            } catch (error) {
              console.error("There was an error leaving the group!", error.response?.data || error);
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
      setAboutGroupData((prevData) => ({
        ...prevData,
        userstatus: newStatus,
      }));
      handleButtonClick(groupID, newStatus);
    }
  };

  return (
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
        ></div>
        <div className="card-body">
          <p className="text-start my-0 mt-3">ชื่อกลุ่ม</p>
          <p
            className="text-start p-2 text-wrap"
            style={{
              color: "#979797",
              borderRadius: "5px",
              border: "1px solid #E7E7E7",
            }}
          >
            {aboutGroupData.activityName}
          </p>
          <div
            className="position-relative mx-auto my-1"
            style={{
              width: "100%",
              height: "25vw",
              maxHeight: "200px",
              maxWidth: "450px",
            }}
          >
            <img
              src={
                aboutGroupData.image != null && aboutGroupData.image !== null
                  ? `${config.SERVER_PATH}/uploaded/hobbyImage/${aboutGroupData.image}`
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
              const isInWeekDate =
                aboutGroupData?.weekDate &&
                Array.isArray(aboutGroupData.weekDate)
                  ? aboutGroupData.weekDate.includes(day)
                  : false;
              return (
                <p
                  key={index}
                  className="m-0"
                  style={{
                    paddingLeft: ".35rem",
                    paddingRight: ".35rem",
                    color: isInWeekDate ? "#000000" : "#E7E7E7",
                    fontSize: "18.95px",
                    border: `1.35px solid ${
                      isInWeekDate ? dayColors[day] : "#E7E7E7"
                    }`,
                    borderRadius:
                      day === "อา." || day === "พฤ." ? "15px" : "50%",
                  }}
                >
                  {day}
                </p>
              );
            })}
          </div>
          <div className="row row-cols-lg-auto g-3 align-items-center">
            <div className="col-5">
              <div>
                <p className="text-start my-0">ตั้งแต่</p>
                <p
                  className="text-start border px-2 py-1"
                  style={{
                    color: "#979797",
                    borderRadius: "5px",
                    border: "1px solid #E7E7E7",
                  }}
                >
                  {aboutGroupData.startTime
                    ? aboutGroupData.startTime.slice(0, 5)
                    : "-:-"}
                </p>
              </div>
            </div>
            <div className="col-2 p-auto px-0">
              <p
                className="text-center my-auto fw-bold"
                style={{ fontSize: "20px" }}
              >
                -
              </p>
            </div>
            <div className="col-5">
              <div>
                <p className="text-start my-0 ">จนถึง</p>
                <p
                  className="text-start border px-2 py-1"
                  style={{
                    color: "#979797",
                    borderRadius: "5px",
                    border: "1px solid #E7E7E7",
                  }}
                >
                  {aboutGroupData.endTime
                    ? aboutGroupData.endTime.slice(0, 5)
                    : "-:-"}
                </p>
              </div>
            </div>
          </div>
          <p className="text-start my-0 ">จำนวนสมาชิก</p>
          <div className="row row-cols-lg-auto g-3 align-items-center">
            <div className="col-8">
              <p
                className="text-start border px-2 py-1"
                style={{
                  color: "#979797",
                  borderRadius: "5px",
                  border: "1px solid #E7E7E7",
                }}
              >
                &nbsp;{aboutGroupData.member ? aboutGroupData.member : 0}
                &nbsp; /&nbsp;
                {aboutGroupData.memberMax
                  ? aboutGroupData.memberMax || aboutGroupData.memberMax === 0
                  : "ไม่จำกัด"}
              </p>
            </div>
            <div className="col-4">
              <Link
                to={"/members"}
                state={{
                  groupID: aboutGroupData.groupID,
                  name: aboutGroupData.activityName,
                  type: aboutGroupData.type,
                }}
                className="text-decoration-none position-relative"
              >
                {aboutGroupData.role === "leader" &&
                  aboutGroupData.request !== undefined &&
                  aboutGroupData.request > 0 && (
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
                      {aboutGroupData.request && aboutGroupData.request <= 9
                        ? aboutGroupData.request
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
            <p className="text-start my-0">สถานที่</p>
            <p
              className="text-start p-2"
              style={{
                color: "#979797",
                borderRadius: "5px",
                border: "1px solid #E7E7E7",
              }}
            >
              {aboutGroupData.location ? aboutGroupData.location : "-"}
            </p>
          </div>
          <div>
            <p className="text-start my-0">รายละเอียด</p>
            <p
              className="text-start p-2"
              style={{
                color: "#979797",
                borderRadius: "5px",
                border: "1px solid #E7E7E7",
              }}
            >
              {aboutGroupData.detail ? aboutGroupData.detail : "-"}
            </p>
          </div>
          <div>
            <p className="text-start my-0">Tag</p>

            <div
              className="card mb-3"
              style={{
                minHeight: "130px",
                background: "#ffffff",
                borderRadius: "5px",
                border: "1px solid #E7E7E7",
              }}
            >
              <div
                className="p-2 d-flex flex-row flex-wrap align-items-start gap-2" //card-body
              >
                {aboutGroupData.tag !== undefined &&
                  aboutGroupData.tag.map((tag) => (
                    <div
                      key={tag}
                      className="badge text-dark px-3 py-2"
                      style={{
                        background: "#FFB600",
                        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
                        flex: "0 1 calc(25% - 0.5rem)", // Adjust this to fit 4 items per row
                        marginBottom: "0.5rem",
                        borderRadius: "2.5px",
                      }}
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {aboutGroupData.role === "leader" &&
          aboutGroupData.userstatus === "member" ? (
            <div className="row row-cols-lg-auto g-3 align-items-center justify-content-center">
              <div className="col-10">
                <Link
                  to={"/hobbyeditgroup"}
                  state={{
                    groupData: aboutGroupData,
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
                        groupID: aboutGroupData.groupID,
                        name: aboutGroupData.activityName,
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
          ) : aboutGroupData.userstatus === "member" ? (
            <div className="row row-cols-lg-auto g-3 align-items-center justify-content-center">
              <div className="col-10">
                <Link
                  to={"/invitefriend"}
                  state={{
                    groupID: aboutGroupData.groupID,
                    name: aboutGroupData.activityName,
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
                  onClick={() => leaveGroup(aboutGroupData.groupID)}
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
          ) : aboutGroupData.userstatus !== "member" &&
            aboutGroupData.role !== "leader" ? (
            <>
              <div>
                <button
                  className="w-100 text-decoration-none px-3 py-2 d-flex align-items-center justify-content-center"
                  style={{
                    background:
                      aboutGroupData.userstatus === "join"
                        ? "#7CB518"
                        : aboutGroupData.userstatus === "request"
                        ? "#B3261E"
                        : aboutGroupData.userstatus === "full"
                        ? "#E7E7E7"
                        : "transparent",
                    borderRadius: "10px",
                    border: "none",
                  }}
                  disabled={aboutGroupData.userstatus === "full"}
                  onClick={() => {
                    if (aboutGroupData.userstatus === "join") {
                      handleStatusUpdate(aboutGroupData.groupID, "request");
                    } else if (aboutGroupData.userstatus === "request") {
                      handleStatusUpdate(aboutGroupData.groupID, "join");
                    } else if (aboutGroupData.userstatus === "full") {
                      return;
                    }
                  }}
                >
                  <span
                    className="text-white text-decoration-none mt-1"
                    style={{ fontSize: "20px" }}
                  >
                    {aboutGroupData.userstatus === "join" && "ขอเข้าร่วมกลุ่ม"}
                    {aboutGroupData.userstatus === "request" && "ยกเลิกคำขอเข้าร่วมกลุ่ม"}
                    {aboutGroupData.userstatus === "full" && "กลุ่มเต็ม"}
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
  );
}

export default AboutHobbyGroup;

{
  /* <div>
  
</div> */
}
