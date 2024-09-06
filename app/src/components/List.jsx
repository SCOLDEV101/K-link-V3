import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoShareSocial } from "react-icons/io5";
import {
  MdPeopleAlt,
  MdOutlineInfo,
  MdOutlineDownload,
  MdOutlineBookmark,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { FaUserTimes } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import axios from "axios";
import Option from "./Option";
import config from "../constants/function";
import Swal from 'sweetalert2'


import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../index.css";

function List({ listItem, fetchData }) {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [bookmarks, setBookmarks] = useState({});
  const [option, setoption] = useState({
    tgg: false,
    o_hId: "",
    o_type: "",
    o_bookmark: null,
  });
  const headersAuth = config.Headers().headers;
  const navigate = useNavigate();

  useEffect(() => {
    setItems(listItem);
  }, [listItem]); //[items, listItem]

  useEffect(() => {
    const initialBookmarks = {};
    items.forEach((item) => {
      initialBookmarks[item.hID] = item.bookmark;
    });
    setBookmarks(initialBookmarks);
  }, [items]);

  function toggleOption(HID, Type, bookmark) {
    setoption({
      tgg: !option.tgg,
      o_hId: HID,
      o_type: Type,
      o_bookmark: bookmark,
    });
  }

  const sendBookmark = async (hID) => {
    setBookmarks((prevBookmarks) => ({
      ...prevBookmarks,
      [hID]: !prevBookmarks[hID],
    }));
    if (hID !== "" && hID !== null) {
      try {
        const response = await axios.post(
          config.SERVER_PATH + `/api/user/addOrDeleteBookmark/${hID}`,
          {},
          { headers: headersAuth, withCredentials: true }
        );
        if (response.data.status === "ok") {
          // fetchData();
          console.log("bookmark success");
        }
      } catch (error) {
        setBookmarks((prevBookmarks) => ({
          ...prevBookmarks,
          [hID]: prevBookmarks[hID],
        }));
        console.error("There was an error fetching the members!", error);
      }
    }
  };

  const getColorByMajor = (major) => {
    switch (major) {
      case "วิศวกรรมศาสตร์":
        return "#5E1814";
      case "สถาปัตยกรรมศาสตร์":
        return "#7C4700";
      case "ครุศาสตร์อุตสาหกรรม":
        return "#FF1493";
      case "เทคโนโลยีการเกษตร":
        return "#00FF00";
      case "วิทยาศาสตร์":
        return "#FFB600";
      case "เทคโนโลยีสารสนเทศ":
        return "#0000FF";
      case "อุตสาหกรรมอาหาร":
        return "#FF597E";
      case "วิทยาลัยนาโนเทคโนโลยี":
        return "#7CB518";
      case "บริหารธุรกิจ":
        return "#00BFFF";
      default:
        return "#000000";
    }
  };

  const handleFeatureClick = (item) => {
    console.log("handleFeatureClick :", item);
    if (item.type === "tutoring" || item.type === "hobby") {
      handleClick(item.hID, item.userstatus);
    } else if (item.type === "library") {
      navigate("/library", { state: { id: item.hID } });
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedItemId(null);
  };

  const handleClick = (id) => {
    setSelectedItemId(id);
  };

  const handleReportList = (item) => {
    navigate("/report", {
      state: { caseID: "reportList", hID: item.hID, type: item.type },
    });
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
              title: 'swal-title-success',
              container: 'swal-container',
              popup: 'swal-popup-success',
            }
          });
  
          console.log(status + " group success");
          // fetchData();
        }
      } catch (err) {
        console.log(err);
        Swal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-error',
            container: 'swal-container',
            popup: 'swal-popup-error',
          }
        });
      }
  };
  
  

  const getItemStatus = (item) => {
    switch (item.userstatus) {
      case "request":
        return "Pending";
      case "member":
        return "Joined";
      case "full":
        return "Full";
      default:
        return "";
    }
  };

  const handleStatusUpdate = async (hID, newStatus) => {
    let swalOptions = {
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: 'swal-container',
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button', 
        cancelButton: 'swal-cancel-button'    
      }
    };
  
    if (newStatus === "request") {
      swalOptions.title = "ต้องการขอเข้าร่วมกลุ่มหรือไม่?";
    } else if (newStatus === "join") {
      swalOptions.title = "ยกเลิกคำขอเข้าร่วมกลุ่มหรือไม่?";
    }
  
    const result = await Swal.fire(swalOptions);
  
    if (result.isConfirmed) {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.hID === hID ? { ...item, userstatus: newStatus } : item
      );
      console.log("Updated items:", updatedItems); // ตรวจสอบค่าที่อัปเดตแล้ว
      return updatedItems;
    });
    handleButtonClick(hID, newStatus);
  }
  };

  

  // const renderButtons = (item) => {
  //   const status = getItemStatus(item);
  //   if (item.hID === selectedItemId) {
  //     switch (status) {
  //       case "Pending":
  //         return (
  //           <div style={{ maxWidth: "600px" }}>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               onClick={() => handleButtonClick(item.hID)}
  //             >
  //               <FaUserTimes
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FF0101",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               ยกเลิกคำขอ
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               onClick={() =>
  //                 navigate("/members", { state: { id: item.hID } })
  //               }
  //             >
  //               <MdPeopleAlt
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FFB600",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               สมาชิกกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               onClick={handleClose}
  //             >
  //               <FaXmark
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FF0101",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               ปิด
  //             </button>
  //           </div>
  //         );
  //       case "Full":
  //         return (
  //           <div style={{ maxWidth: "600px" }}>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               disabled
  //             >
  //               <RiErrorWarningFill
  //                 style={{ color: "#FF0101", fontSize: "5vw", margin: "1vw" }}
  //               />
  //               กลุ่มเต็ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               onClick={() =>
  //                 navigate("/members", { state: { id: item.hID } })
  //               }
  //             >
  //               <MdPeopleAlt
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FFB600",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               สมาชิกกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "4vw", borderRadius: "10px" }}
  //               onClick={handleClose}
  //             >
  //               <FaXmark
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FF0101",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               ปิด
  //             </button>
  //           </div>
  //         );
  //       case "Joined":
  //         return (
  //           <div style={{ maxWidth: "600px" }}>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={() =>
  //                 navigate("/abouthobbygroup", { state: { id: item.hID } })
  //               }
  //             >
  //               <MdOutlineInfo style={{ fontSize: "3.5vw", margin: "1vw" }} />{" "}
  //               {/* <============== WTF BRO ========== */}
  //               เกี่ยวกับกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={() =>
  //                 navigate("/members", { state: { id: item.hID } })
  //               }
  //             >
  //               <MdPeopleAlt
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FFB600",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               สมาชิกกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={handleClose}
  //             >
  //               <FaXmark
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FF0101",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               ปิด
  //             </button>
  //           </div>
  //         );
  //       default:
  //         return (
  //           <div style={{ maxWidth: "600px" }}>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={() => handleJoinGroupClick(item.hID)}
  //             >
  //               <HiPlus
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#7CB518",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               เข้าร่วมกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={() =>
  //                 navigate("/members", { state: { id: item.hID } })
  //               }
  //             >
  //               <MdPeopleAlt
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FFB600",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               สมาชิกกลุ่ม
  //             </button>
  //             <button
  //               className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
  //               style={{ fontSize: "3.5vw", borderRadius: "10px" }}
  //               onClick={handleClose}
  //             >
  //               <FaXmark
  //                 style={{
  //                   color: "#FFF",
  //                   fontSize: "6vw",
  //                   background: "#FF0101",
  //                   borderRadius: "50%",
  //                   padding: "3px",
  //                   marginRight: "3px",
  //                 }}
  //               />
  //               ปิด
  //             </button>
  //           </div>
  //         );
  //     }
  //   }
  //   return null;
  // };

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
            className={`list-item ${
              selectedItemId === item.hID ? "highlighted zIndex-9999" : ""
            }`}
          >
            {item.type === "hobby" && (
              <div
                className="card my-2 border border-dark m-auto"
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  top: "10%",
                  cursor: "default",
                  maxWidth: "500px",
                }}
              >
                <div className="row">
                  <div className="col align-self-left d-flex m-0">
                    <img
                      src={
                        item.type === "hobby" ? "./hobby.png" : "./tutoring.png"
                      }
                      className="p-0"
                      alt=""
                    />
                  </div>
                  <div
                    className="col align-self-left d-flex m-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeatureClick(item);
                    }}
                  >
                    <div></div>
                  </div>
                  <div
                    className="col"
                    style={{
                      fontSize: "4vw",
                      textAlign: "right",
                      marginRight: "3%",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <div className="col align-self-right" height={"8vw"}>
                      <div className="d-flex">
                        <div
                          className="text-start fs-5"
                          style={{ color: "#FF0101" }}
                          onClick={() => handleReportList(item)}
                        >
                          <TbMessageReport className="mx-2 mb-1 fs-2" />
                        </div>
                        <div onClick={() => sendBookmark(item.hID)}>
                          {bookmarks[item.hID] ? (
                            <MdOutlineBookmark
                              className="mt-1 fs-2"
                              style={{ color: "#FFB600" }}
                            />
                          ) : (
                            <MdOutlineBookmarkBorder className="mt-1 fs-2" />
                          )}
                        </div>
                      </div>
                    </div>
                    <p
                      className={
                        item.memberMax === null ||
                        item.memberMax === 0 ||
                        item.member <= item.memberMax
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                      style={{
                        fontSize: "4vw",
                        textAlign: "right",
                        margin: "0",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.member}/
                      {item.memberMax === null || item.memberMax === 0
                        ? "ไม่จำกัด"
                        : item.memberMax}
                    </p>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ padding: "0% 5%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(item);
                  }}
                >
                  <p
                    style={{
                      fontSize: "5vw",
                      textAlign: "left",
                      margin: "0rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.activityName}
                  </p>
                  <p
                    style={{
                      fontSize: "4vw",
                      textAlign: "left",
                      color: "#DDDCDC",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.leader}
                  </p>
                  <p
                    className={
                      item.userstatus === "member"
                        ? "text-success"
                        : "text-warning"
                    }
                    style={{
                      fontSize: "4vw",
                      textAlign: "right",
                      margin: "0",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.userstatus}
                  </p>
                  <div className="row">
                    <div className="col align-self-center">
                      <img
                        src={
                          item.image != null
                            ? `${config.SERVER_PATH}/uploaded/hobbyImage/${item.image}`
                            : "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png"
                        }
                        style={{ width: "25vw", height: "25vw" }}
                      />
                    </div>
                    <div className="col align-self-center">
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        ทุกๆวัน: {item.weekDate.split(",").join(" ")}
                      </p>
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        เวลา: {item.actTime}
                      </p>
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        สถานที่: {item.location}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{ fontSize: "3vw", textAlign: "left" }}
                    className="m-0 pt-2"
                  >
                    รายละเอียด: {item.detail}
                  </p>
                  <div className="p-1 mb-2" style={{ textAlign: "left" }}>
                    {item.tag &&
                      item.tag.split(",").map((tag, i) => (
                        <p
                          key={i}
                          className="mx-1 my-0"
                          style={{
                            fontSize: "3vw",
                            borderRadius: "50px",
                            backgroundColor: "#D9D9D9",
                            display: "inline-block",
                            padding: "0.2em 0.5em",
                          }}
                        >
                          {tag}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {item.type === "tutoring" && (
              <div
                className="card my-2 border border-dark m-auto"
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  top: "10%",
                  maxWidth: "500px",
                  cursor: "default",
                }}
              >
                <div className="row">
                  <div className="col align-self-left d-flex m-0">
                    <img
                      src={
                        item.feature === "hobby"
                          ? "./hobby.png"
                          : "./tutoring.png"
                      }
                      className="p-0"
                      alt=""
                    />
                  </div>
                  <div
                    className="col align-self-left d-flex m-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeatureClick(item);
                    }}
                  >
                    <div></div>
                  </div>
                  <div
                    className="col"
                    style={{
                      fontSize: "4vw",
                      textAlign: "right",
                      marginRight: "3%",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <div className="col align-self-right" height={"8vw"}>
                      <div className="d-flex">
                        <div
                          className="text-start fs-5"
                          style={{ color: "#FF0101" }}
                          onClick={() => handleReportList(item)}
                        >
                          <TbMessageReport className="mx-2 mb-1 fs-2" />
                        </div>
                        <div onClick={() => sendBookmark(item.hID)}>
                          {bookmarks[item.hID] ? (
                            <MdOutlineBookmark
                              className="mt-1 fs-2"
                              style={{ color: "#FFB600" }}
                            />
                          ) : (
                            <MdOutlineBookmarkBorder className="mt-1 fs-2" />
                          )}
                        </div>
                      </div>
                    </div>
                    <p
                      className={
                        item.memberMax === null ||
                        item.memberMax === 0 ||
                        item.member <= item.memberMax
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                      style={{
                        fontSize: "4vw",
                        textAlign: "right",
                        margin: "0",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.member}/
                      {item.memberMax === null || item.memberMax === 0
                        ? "ไม่จำกัด"
                        : item.memberMax}
                    </p>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ padding: "0% 5%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(item);
                  }}
                >
                  <p
                    style={{
                      fontSize: "5vw",
                      textAlign: "left",
                      margin: "0rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.activityName}
                  </p>
                  <p
                    className={
                      item.userstatus === "member"
                        ? "text-success"
                        : "text-warning"
                    }
                    style={{
                      fontSize: "4vw",
                      textAlign: "right",
                      margin: "0",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.userstatus}
                  </p>
                  <p
                    style={{
                      fontSize: "4vw",
                      textAlign: "left",
                      color: "#DDDCDC",
                      marginBottom: "0.2rem",
                    }}
                  >
                    ผู้สอน: {item.teachBy}
                  </p>
                  <div className="row">
                    <div className="col align-self-center">
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        วันที่:{" "}
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "--"}
                      </p>
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {item.Starttime && item.Endtime
                          ? `เวลา: ${item.Starttime.substring(
                              0,
                              5
                            )} - ${item.Endtime.substring(0, 5)} น.`
                          : null}
                      </p>
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          marginBottom: "0.5rem",
                        }}
                      >
                        สถานที่: {item.location}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{ fontSize: "3vw", textAlign: "left" }}
                    className="m-0 pt-2"
                  >
                    รายละเอียด: {item.detail}
                  </p>
                  <div className="p-1 mb-2" style={{ textAlign: "left" }}>
                    {item.tag &&
                      item.tag.split(",").map((tag, i) => (
                        <p
                          key={i}
                          className="mx-1 my-0"
                          style={{
                            fontSize: "3vw",
                            borderRadius: "50px",
                            backgroundColor: "#D9D9D9",
                            display: "inline-block",
                            padding: "0.2em 0.5em",
                          }}
                        >
                          {tag}
                        </p>
                      ))}
                    <div
                      className="fw-bold"
                      style={{
                        fontSize: "4vw",
                        textAlign: "right",
                        color: getColorByMajor(item.Major),
                      }}
                    >
                      {item.Major}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {item.type === "library" && (
              <div
                className="card my-2 border border-dark m-auto"
                style={{
                  position: "relative",
                  borderRadius: "20px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  top: "10%",
                  cursor: "default",
                  maxWidth: "500px",
                }}
              >
                <div className="row">
                  <div
                    className="col"
                    style={{
                      fontSize: "4vw",
                      textAlign: "right",
                      marginRight: "3%",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <div className="col align-self-right" height={"8vw"}>
                      <div className="d-flex justify-content-end">
                        <div
                          className="text-start fs-5"
                          style={{ color: "#FF0101" }}
                          onClick={() => handleReportList(item)}
                        >
                          <TbMessageReport className="mx-2 mb-1 fs-2" />
                        </div>
                        <div onClick={() => sendBookmark(item.hID)}>
                          {bookmarks[item.hID] ? (
                            <MdOutlineBookmark
                              className="mt-1 fs-2"
                              style={{ color: "#FFB600" }}
                            />
                          ) : (
                            <MdOutlineBookmarkBorder className="mt-1 fs-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ padding: "0% 5%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick(item);
                  }}
                >
                  <p
                    style={{
                      fontSize: "5vw",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    {item.activityName}
                  </p>
                  {/* <p
                    style={{
                      fontSize: "5vw",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    {item.code}
                  </p> */}
                  <div className="row">
                    <div className="col align-self-center">
                      {/* <img
                        src={item.img}
                        style={{ width: "25vw", height: "35vw" }}
                      /> */}
                      <PDF_Document file={item.img[0]} />
                    </div>
                    <div className="col align-self-center">
                      <p
                        style={{
                          fontSize: "4vw",
                          textAlign: "left",
                          color: "#DDDCDC",
                          marginBottom: "0.2rem",
                        }}
                      >
                        โดย: {item.leader}
                      </p>
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: "3vw",
                          color: getColorByMajor(item.Major),
                        }}
                      >
                        {item.Major}
                      </div>
                      <p
                        style={{
                          fontSize: "3vw",
                          textAlign: "left",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                        }}
                        className="m-0 pt-2"
                      >
                        รายละเอียด: {item.detail}
                      </p>
                    </div>
                  </div>
                  <div className="p-1 mb-0" style={{ textAlign: "left" }}>
                    {item.tag &&
                      item.tag.split(",").map((tag, i) => (
                        <p
                          key={i}
                          className="mx-1 my-0"
                          style={{
                            fontSize: "3vw",
                            borderRadius: "50px",
                            backgroundColor: "#D9D9D9",
                            display: "inline-block",
                            padding: "0.2em 0.5em",
                          }}
                        >
                          {tag}
                        </p>
                      ))}
                    <div className="row">
                      <div
                        className="d-flex align-items-end col"
                        style={{
                          fontSize: "4vw",
                          marginRight: "3%",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {/* <BiLike
                          style={{ fontSize: "8vw" }}
                          className="mx-2 "
                        />
                        {item.Like} */}
                      </div>
                      <div
                        className="col"
                        style={{
                          fontSize: "8vw",
                          textAlign: "right",
                          marginRight: "3%",
                          marginBottom: "0.2rem",
                        }}
                      >
                        <a href={`${config.SERVER_PATH}/uploaded/Library/${item.filename}`} target="_blank" rel="noopener noreferrer">
                          <MdOutlineDownload className="mx-2 mt-1 text-dark" />
                        </a>
                        {/* <IoShareSocial className="mx-2" /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="my-2" style={{ maxWidth: "600px" }}>
              {/* {renderButtons(item)} */}

              {item.hID === selectedItemId && (
                <div style={{ maxWidth: "600px" }}>
                  {/* ==========[ CHANGE BTN ]=========== */}
                  {item.userstatus === "request" ? (
                    <button
                      className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                      style={{ fontSize: "4vw", borderRadius: "10px" }}
                      onClick={() => {
                        // handleButtonClick(item.hID);
                        handleStatusUpdate(item.hID, "join");
                      }}
                    >
                      <FaUserTimes
                        style={{
                          color: "#FFF",
                          fontSize: "6vw",
                          background: "#FF0101",
                          borderRadius: "50%",
                          padding: "3px",
                          marginRight: "3px",
                        }}
                      />
                      ยกเลิกคำขอ
                    </button>
                  ) : item.userstatus === "member" ? (
                    <button
                      className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                      style={{ fontSize: "3.5vw", borderRadius: "10px" }}
                      onClick={() => {
                        if (item.type === "hobby") {
                          navigate("/abouthobbygroup", {
                            state: { id: item.hID },
                          });
                        } else if (item.type === "tutoring") {
                          navigate("/abouttutoringgroup", {
                            state: { id: item.hID },
                          });
                        }
                      }}
                    >
                      <MdOutlineInfo
                        style={{ fontSize: "3.5vw", margin: "1vw" }}
                      />{" "}
                      {/* <============== WTF BRO ========== */}
                      เกี่ยวกับกลุ่ม
                    </button>
                  ) : item.userstatus === "full" ? (
                    <button
                      className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                      style={{ fontSize: "4vw", borderRadius: "10px" }}
                      disabled
                    >
                      <RiErrorWarningFill
                        style={{
                          color: "#FF0101",
                          fontSize: "5vw",
                          margin: "1vw",
                        }}
                      />
                      กลุ่มเต็ม
                    </button>
                  ) : (
                    <button
                      className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                      style={{ fontSize: "3.5vw", borderRadius: "10px" }}
                      onClick={() => {
                        // handleJoinGroupClick(item.hID);
                        handleStatusUpdate(item.hID, "request");
                      }}
                    >
                      <HiPlus
                        style={{
                          color: "#FFF",
                          fontSize: "6vw",
                          background: "#7CB518",
                          borderRadius: "50%",
                          padding: "3px",
                          marginRight: "3px",
                        }}
                      />
                      เข้าร่วมกลุ่ม
                    </button>
                  )}
                  {/* ==========[ CHANGE BTN ]=========== */}
                  <button
                    className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                    style={{ fontSize: "4vw", borderRadius: "10px" }}
                    onClick={() =>
                      navigate("/members", { state: { id: item.hID } })
                    }
                  >
                    <MdPeopleAlt
                      style={{
                        color: "#FFF",
                        fontSize: "6vw",
                        background: "#FFB600",
                        borderRadius: "50%",
                        padding: "3px",
                        marginRight: "3px",
                      }}
                    />
                    สมาชิกกลุ่ม
                  </button>
                  <button
                    className="btn bg-white border border-dark py-1 px-1 my-auto mx-1"
                    style={{ fontSize: "4vw", borderRadius: "10px" }}
                    onClick={handleClose}
                  >
                    <FaXmark
                      style={{
                        color: "#FFF",
                        fontSize: "6vw",
                        background: "#FF0101",
                        borderRadius: "50%",
                        padding: "3px",
                        marginRight: "3px",
                      }}
                    />
                    ปิด
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}
      <Option
        caseId="ListOption"
        hID={option.o_hId}
        type={option.o_type}
        bookmark={option.o_bookmark}
        show={false}
      />
    </div>
  );
}

export default List;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString(); // Set the workerSrc globally

function PDF_Document({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const base64Data = file;

  useEffect(() => {
    const base64ToBlobUrl = (base64) => {
      try {
        if (!base64 || typeof base64 !== "string") {
          throw new Error("Invalid Base64 string");
        }

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Error decoding Base64 data:", error);
        return null;
      }
    };

    setPdfUrl(base64ToBlobUrl(base64Data));

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [base64Data]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      {pdfUrl ? (
        <>
          <Document
            className="pdf-document"
            renderMode={"canvas"}
            // file={pdfUrl}
            file={`data:application/pdf;base64,${file}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={1} width={100} className="pdf-page" />
          </Document>
          {/* <a href={pdfUrl} download={pdfUrl + ".pdf"}>
            <button className="download-button">Download PDF</button>
          </a> */}
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}
