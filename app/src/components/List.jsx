import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../constants/function";
import Swal from "sweetalert2";
import { IoGameController } from "react-icons/io5";
import { FiBookOpen, FiFileText, FiFlag, FiInfo } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { TbEye, TbTrashFilled } from "react-icons/tb";
import { LuShare2 } from "react-icons/lu";
import { MdOutlineDownload } from "react-icons/md";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../index.css";

function List({ listItem, fetchData }) {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [bookmarks, setBookmarks] = useState({});
  const headersAuth = config.Headers().headers;
  const navigate = useNavigate();

  useEffect(() => {
    setItems(listItem);
    // Swal.fire({
    //   showCancelButton: true,
    //   reverseButtons: true,
    //   cancelButtonText: "ยกเลิก",
    //   customClass: {
    //     // container: "swal-container",
    //     title: "swal-title",
    //     popup: "swal-popup",
    //     cancelButton: "swal-cancel-button",
    //   },
    // });
  }, [listItem]);

  useEffect(() => {
    const initialBookmarks = {};
    items.forEach((item) => {
      initialBookmarks[item.groupID] = item.bookmark;
    });
    setBookmarks(initialBookmarks);
  }, [items]);

  const sendBookmark = async (groupID) => {
    setBookmarks((prevBookmarks) => ({
      ...prevBookmarks,
      [groupID]: !prevBookmarks[groupID],
    }));
    if (groupID !== "" && groupID !== null) {
      try {
        const response = await axios.post(
          config.SERVER_PATH + `/api/user/addOrDeleteBookmark/${groupID}`,
          {},
          { headers: headersAuth, withCredentials: true }
        );
        if (response.data.status === "ok") {
          console.log("bookmark success");
        }
      } catch (error) {
        setBookmarks((prevBookmarks) => ({
          ...prevBookmarks,
          [groupID]: prevBookmarks[groupID],
        }));
        console.error("There was an error fetching the members!", error);
      }
    }
  };

  const handleFeatureClick = (item) => {
    console.log("handleFeatureClick :", item);
    setSelectedItemId(selectedItemId === null ? item.groupID : null);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedItemId(null);
  };

  const handleReportList = (item) => {
    navigate("/report", {
      state: { caseID: "reportList", groupID: item.groupID, type: item.type },
    });
  };

  function formatDateThai(dateStr) {
    const monthsThai = [
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

    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = monthsThai[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  }


  const dayColors = {
    "จ.": "#FFB600",
    "อ.": "#EFB8C8",
    "พ.": "#7CB518",
    "พฤ.": "#F96E20",
    "ศ.": "#729BC0",
    "ส.": "#A970C4",
    "อา.": "#B3261E",
  };



  const handleShare = (selectedItemId) => {
    const shareUrl = `http://localhost:3001/aboutlibrary/${selectedItemId}`;
    const shareText = `ฉันเจอเอกสารที่น่าสนใจในแอป K-LINK\n${shareUrl}\nร่วมแบ่งปันประสบการณ์ที่ดีร่วมกันในแอป K-LINK`;
    navigator.clipboard.writeText(shareText)

    if (navigator.share) {
      navigator.share({
        title: "ฉันเจอเอกสารที่น่าสนใจในแอป K-LINK",
        text: "ร่วมแบ่งปันประสบการณ์ที่ดีร่วมกันในแอป K-LINK",
        url: shareUrl,
      })
        .then(() => console.log('แชร์สำเร็จ!'))
        .catch((error) => console.log('การแชร์ล้มเหลว:', error));
    } else {
      alert('ไม่รองรับในเบราว์เซอร์ของคุณ');
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
            // container: "swal-container",
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
          // container: "swal-container",
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
        // container: "swal-container",
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
      swalOptions.title = "ต้องการยกเลิกคำขอ?";
      swalOptions.confirmButtonText = "ยกเลิกคำขอ";
      swalOptions.cancelButtonText = "ยังก่อน";
      swalOptions.customClass.confirmButton = "swal-confirmRed-button";

    }

    const result = await Swal.fire(swalOptions);

    if (result.isConfirmed) {
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.groupID === groupID ? { ...item, userstatus: newStatus } : item
        );
        console.log("Updated items:", updatedItems);
        return updatedItems;
      });
      handleButtonClick(groupID, newStatus);
    }
  };

  const daysThai = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.getDay();
  };

  const formatTime = (time) => {
    if (!time) return;
    const [hours, minutes] = time.split(":");
    return `${hours}.${minutes} น.`;
  }

  const deleteGroup = async (groupID, feature) => {
    const result = await Swal.fire({
      title: feature === "library" ? "ต้องการลบไฟล์?" : "ต้องการลบกลุ่ม?",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      cancelButtonText: feature === "library" ? "ยังก่อน" : "ยกเลิก",
      confirmButtonText: feature === "library" ? "ลบเลย" : "ลบกลุ่ม",
      html: feature === "library" ? `
    <p style="font-weight: 400; font-size: 12px; line-height: 0.5px;">หลังจากลบไฟล์แล้วจะ <span style="color: #FF4800; font-weight: bold; font-size: 12px;">ไม่สามารถกู้คืนได้</span></p>
    <p style="font-weight: 400; font-size: 12px; line-height: 0.5px;">กรุณายืนยันว่าต้องการดำเนินการต่อหรือไม่?</p>
  ` : `
    <p style="font-weight: 400; font-size: 12px; line-height: 0.5px;">หลังจากลบกลุ่มแล้วจะ <span style="color: #FF4800; font-weight: bold; font-size: 12px;">ไม่สามารถกู้คืนได้</span></p>
    <p style="font-weight: 400; font-size: 12px; line-height: 0.5px;">กรุณายืนยันว่าต้องการดำเนินการต่อหรือไม่?</p>
  `,
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        cancelButton: 'swal-cancel-button',
        confirmButton: 'swal-confirmRed-button',
      }
    });

    if (result.isConfirmed) {
      try {
        await axios
          .delete(config.SERVER_PATH + `/api/${feature}/deleteGroup/` + groupID, {
            headers: config.Headers().headers,
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.status === "ok") {
              console.log("Delete success");
              Swal.fire({
                position: "center",
                title: "ลบกลุ่มแล้ว",
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  title: 'swal-title-success',
                  // container: 'swal-container',
                  popup: 'swal-popup-error',
                }
              });
              setItems(prevItems => prevItems.filter(item => item.groupID !== groupID));
            } else {
              Swal.fire({
                position: "center",
                title: "เกิดข้อผิดพลาด",
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                  title: 'swal-title-success',
                  // container: 'swal-container',
                  popup: 'swal-popup-error',
                }
              });
            }
          });
      } catch (error) {
        console.error("ERROR: ", error);
        Swal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-success',
            // container: 'swal-container',
            popup: 'swal-popup-error',
          }
        });
      }
    }
  };


  return (
    <div onClick={handleClose} style={{ position: "relative" }}>
      <style>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          z-index: 1040;
        }
  
        .list-item.highlighted {
          position: relative;
          z-index: 1050 !important;
        }
      `}</style>

      {selectedItemId && <div className="overlay" onClick={handleClose}></div>}

      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={index}
            className={`list-item ${selectedItemId === item.groupID ? "highlighted zIndex-9999" : ""
              }`}
          >
            {item.leader && <p className="mx-4 mb-2" style={{ fontSize: "14px" }}>@{item.leader}</p>}
            {item.teachBy && <p className="mx-4 mb-2" style={{ fontSize: "14px" }}>@{item.teachBy}</p>}
            <div className="card p-3 border-0 mx-3" style={{ borderRadius: "15px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", }}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick(item);
                }}
                className="position-relative mx-auto my-1"
                style={{
                  width: "75vw",
                  height: "25vw",
                  maxHeight: "100px",
                  maxWidth: "450px",
                }}
              >
                <img
                  src={
                    item.type === "library" && item.image ? `${config.SERVER_PATH}${item.image}`
                      : item.image
                        ? `${config.SERVER_PATH}/uploaded/hobbyImage/${item.image}`
                        : item.type === "hobby"
                          ? "../Hobby_Default_Cover.png"
                          : item.type === "library"
                            ? "../Library_Default_Cover.png"
                            : "../Tutoring_Default_Cover.png"
                  }
                  alt="group img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "15px",
                    boxShadow: "inset 0px 0px 5.6px 0px rgba(0, 0, 0, 0.25)",
                  }}
                />

                <div
                  className="position-absolute d-flex align-items-center m-2  fs-1"
                  style={{
                    top: "0",
                    right: "0",
                    transform: "translate(50%, -50%)",
                  }}
                >
                  {item.type === "hobby" ? (
                    <div
                      style={{
                        backgroundColor: "#FFB600",
                        padding: "0.3rem",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IoGameController
                        className="text-dark"
                        style={{ marginLeft: "0.1rem" }}
                      />
                    </div>
                  ) : item.type === "tutoring" ? (
                    <div
                      style={{
                        backgroundColor: "#21005D",
                        padding: "0.4rem",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiBookOpen className="text-white mt-1" />
                    </div>
                  ) : item.type === "library" ? (
                    <div
                      style={{
                        backgroundColor: "#7CB518",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiFileText className="text-white" />
                    </div>
                  ) : null}
                </div>

                {item.type !== "library" && item.member && (
                  <div
                    className="position-absolute"
                    style={{
                      top: "10px",
                      left: "10px",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "5px",
                      maxWidth: "50%",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          item.userstatus === "member" || item.role === "leader"
                            ? "linear-gradient(90deg, rgba(129,255,108,0.8) 0%, rgba(185,255,63,0.8) 100%)"
                            : "rgba(255, 255, 255, 0.8)",
                        borderRadius: "5px",
                        backdropFilter: "blur(3.29px)",
                        zIndex: 1,
                        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
                      }}
                    ></div>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        color: "black",
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.member} / {item.memberMax === 0 || item.memberMax === null ? "ไม่จำกัด" : item.memberMax}
                    </div>
                  </div>

                )}
              </div>
              <div
                className="d-flex mt-2 mx-auto"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "75vw",
                  maxWidth: "450px",
                }}
              >
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(item);
                  }}
                  className="m-0"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "55vw",
                  }}
                >
                  {item.activityName}
                </p>
                <div className="mb-1" style={{ maxWidth: "20vw" }}>
                  <FiFlag
                    className="mx-2"
                    style={{ fontSize: "20px" }}
                    onClick={() => handleReportList(item)}
                  />
                  {bookmarks[item.groupID] ? (
                    <FaBookmark
                      style={{ fontSize: "20px", color: "#FFB600" }}
                      onClick={() => sendBookmark(item.groupID)}
                    />
                  ) : (
                    <FaRegBookmark
                      style={{ fontSize: "20px" }}
                      onClick={() => sendBookmark(item.groupID)}
                    />
                  )}
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick(item);
                }}
                className="d-flex flex-column mx-auto"
                style={{
                  alignItems: "start",
                  width: "75vw",
                  maxWidth: "450px",
                }}
              >
                <p
                  className="m-0"
                  style={{
                    color: "#49454F",
                    fontSize: "14px",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "70vw",
                  }}
                >
                  {item.type === "library" ? item.major : item.location}
                </p>
                <p
                  className="m-0"
                  style={{
                    color: "#625B71",
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.type === "library" ? (
                    item.totalpages ? `PDF | ${item.totalpages} หน้า` : null
                  ) : item.type === "hobby" ? (
                    `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
                  ) : item.type === "tutoring" ? (
                    `${formatDateThai(item.date)} | ${formatTime(item.Starttime)} - ${formatTime(item.Endtime)}`
                  ) : (
                    <></>
                  )}
                </p>
                {item.detail && (
                  <p
                    className="m-0 "
                    style={{
                      color: "#7B7B7B",
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "70vw",
                    }}
                  >
                    {item.detail}
                  </p>
                )}

                {item.downloaded && (
                  <p
                    className="m-0 my-2"
                    style={{
                      color: "#949494",
                      fontSize: "14px",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "70vw",
                    }}
                  >
                    ดาวน์โหลดแล้ว {item.downloaded.toLocaleString()} ครั้ง
                  </p>
                )}


                {item.weekDate &&
                  <div className="d-flex gap-2 my-2">
                    {item.weekDate.map((day, index) => (
                      <p
                        key={index}
                        className="m-0"
                        style={{
                          paddingLeft: ".35rem",
                          paddingRight: ".35rem",
                          color: "#000000",
                          fontSize: "14px",
                          border: `1px solid ${dayColors[day] || "#000"}`,
                          borderRadius:
                            day === "อา." || day === "พฤ." ? "15px" : "50%",
                        }}
                      >
                        {day}
                      </p>
                    ))}
                  </div>
                }
                {item.type === "tutoring" &&
                  <div className="d-flex gap-2 my-2">
                    {daysThai.map((day, index) => {
                      const currentDayIndex = getDayOfWeek(item.date);
                      return (
                        <p
                          key={index}
                          className="m-0"
                          style={{
                            paddingLeft: ".35rem",
                            paddingRight: ".35rem",
                            color: index === currentDayIndex ? "#000000" : "#E7E7E7",
                            fontSize: "14px",
                            border: index === currentDayIndex ? `1px solid ${dayColors[day]}` : "1px solid #E7E7E7",
                            borderRadius:
                              day === "อา." || day === "พฤ." ? "15px" : "50%",
                          }}
                        >
                          {day}
                        </p>
                      )
                    })}
                  </div>
                }
              </div>
              <div className="d-flex flex-row gap-2 flex-nowrap overflow-auto mx-auto" style={{ borderRadius: "40px", scrollbarWidth: "none", width: "75vw", maxWidth: "450px" }}>
                <div className="py-1 d-flex flex-row flex-nowrap overflow-auto" style={{ textAlign: "left", borderRadius: "40px", scrollbarWidth: "none" }}>
                  {item.tag &&
                    item.tag.map((tag, i) => (
                      <p
                        key={i}
                        className="my-0 py-1 px-3 text-nowrap d-flex flex-row justify-content-center align-items-center"
                        style={{
                          fontSize: "10px",
                          borderRadius: "40px",
                          backgroundColor: "#E7E7E7",
                          display: "inline-block",
                          maxHeight: "23px",
                          marginRight: "5px"
                        }}
                      >
                        {tag}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            <div className="mt-3 mb-4 mx-3" style={{ maxWidth: "600px" }}>
              {/* {renderButtons(item)} */}

              {item.groupID === selectedItemId && (
                <div style={{ maxWidth: "600px" }}>
                  {/* ==========[ CHANGE BTN ]=========== */}
                  {item.type === "library" ? (<>
                    <button
                      className="btn py-1 px-2 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                      onClick={() => navigate(`/aboutlibrary/${selectedItemId}`)}
                    >
                      <TbEye style={{ marginRight: "5px" }} />
                      ดูตัวอย่าง
                    </button>
                    <button
                      className="btn bg-white py-1 px-2 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                      onClick={() => handleShare(selectedItemId)}
                    >
                      <LuShare2 style={{ marginRight: "5px" }} />
                      แชร์
                    </button>
                    <button
                      className="btn bg-white py-1 px-2 my-auto mx-1"
                      style={{ fontSize: "14.5px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                      onClick={() => window.open(`${config.SERVER_PATH}/uploaded/Library/${item.encodedfilename}`, "_blank", "noopener noreferrer")}
                    >
                      <MdOutlineDownload />
                    </button>
                    {item.role === "leader" &&
                      <button
                        className="btn py-1 px-3 my-auto mx-1"
                        style={{ fontSize: "15px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", backgroundColor: "#B3261E" }}
                        onClick={() => {
                          deleteGroup(item.groupID, item.type);
                        }}
                      >
                        <TbTrashFilled className="text-white" />
                      </button>
                    }
                  </>)
                    : item.userstatus === "request" ? (<>
                      <button
                        className="btn py-1 px-2 my-auto mx-1"
                        style={{ fontSize: "14px", borderRadius: "10px", backgroundColor: "#B3261E", color: "#E7E7E7", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                        onClick={() => {
                          handleStatusUpdate(item.groupID, "join");
                        }}
                      >
                        ยกเลิกคำขอ
                      </button>

                    </>
                    ) : item.userstatus === "full" ? (
                      <button
                        className="btn bg-white py-1 px-2 my-auto mx-1"
                        style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                        disabled
                      >
                        กลุ่มเต็ม
                      </button>
                    ) : item.userstatus === "join" ? (
                      <button
                        className="btn bg-white py-1 px-2 my-auto mx-1"
                        style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                        onClick={() => {
                          handleStatusUpdate(item.groupID, "request");
                        }}
                      >
                        เข้าร่วมกลุ่ม
                      </button>
                    ) : (
                      <></>
                    )}
                  {item.type !== "library" ?
                    <>
                      <button
                        className="btn bg-white py-1 px-2 my-auto mx-1"
                        style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                        onClick={() => {
                          if (item.type === "hobby") {
                            navigate("/abouthobbygroup", {
                              state: { groupID: item.groupID },
                            });
                          } else if (item.type === "tutoring") {
                            navigate("/abouttutoringgroup", {
                              state: { groupID: item.groupID },
                            });
                          }
                        }}
                      >
                        <FiInfo style={{ marginRight: "5px", marginBottom: "2px" }} />
                        เกี่ยวกับกลุ่ม
                      </button>
                      <button
                        className="btn bg-white py-1 px-3 my-auto mx-1"
                        style={{ fontSize: "14px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                        onClick={handleClose}
                      >
                        ปิด
                      </button>
                      {item.role === "leader" &&
                        <button
                          className="btn py-1 px-3 my-auto mx-1"
                          style={{ fontSize: "15px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)", backgroundColor: "#B3261E" }}
                          onClick={() => {
                            deleteGroup(item.groupID, item.type);
                          }}
                        >
                          <TbTrashFilled className="text-white" />
                        </button>
                      }
                    </>
                    : <></>}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default List;