import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../constants/function";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from "react-pdf";
import { IoGameController } from "react-icons/io5";
import { FiBookOpen, FiFileText, FiFlag , FiInfo } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { TbEye } from "react-icons/tb";
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
  }, [listItem]); //[items, listItem]

  useEffect(() => {
    const initialBookmarks = {};
    items.forEach((item) => {
      initialBookmarks[item.hID] = item.bookmark;
    });
    setBookmarks(initialBookmarks);
  }, [items]);

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

  const handleFeatureClick = (item) => {
    console.log("handleFeatureClick :", item);
    setSelectedItemId(selectedItemId === null ? item.hID : null);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedItemId(null);
  };

  const handleReportList = (item) => {
    navigate("/report", {
      state: { caseID: "reportList", hID: item.hID, type: item.type },
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

  function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(":");
    return `${hour}.${minute} น.`;
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
          title: "swal-title-error",
          container: "swal-container",
          popup: "swal-popup-error",
        },
      });
    }
  };

  const handleStatusUpdate = async (hID, newStatus) => {
    let swalOptions = {
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: "swal-container",
        title: "swal-title",
        popup: "swal-popup",
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
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
            <div className="card p-3" style={{ borderRadius: "15px" }}>
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
                {item.type==="library" ? 
                <PDF_Document file={item.img[0]}  /> :
                <img
                  src={
                    item.image != null
                      ? `${config.SERVER_PATH}/uploaded/hobbyImage/${item.image}`
                      : "https://imagedelivery.net/LBWXYQ-XnKSYxbZ-NuYGqQ/c36022d2-4b7a-4d42-b64a-6f70fb40d400/avatarhd"
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "15px",
                    boxShadow: "0px 0px 5.6px rgba(0, 0, 0, 0.25)",
                  }}
                />
                  }
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
                      background:
                        item.userstatus === "member"
                          ? "linear-gradient(90deg, rgba(129,255,108,0.8) 0%, rgba(185,255,63,0.8) 100%)"
                          : "rgba(255, 255, 255, 0.8)",
                      padding: "0.2rem 0.5rem",
                      backdropFilter: "blur(3.29px)",
                      borderRadius: "5px",
                      color: "black",
                      fontSize: "0.8rem",
                      maxWidth: "50%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {item.member} / {item.memberMax === 0 || item.memberMax === null ? "ไม่จำกัด" : item.memberMax}
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
                  {bookmarks[item.hID] ? (
                    <FaBookmark
                      style={{ fontSize: "20px", color: "#FFB600" }}
                      onClick={() => sendBookmark(item.hID)}
                    />
                  ) : (
                    <FaRegBookmark
                      style={{ fontSize: "20px" }}
                      onClick={() => sendBookmark(item.hID)}
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
                    color: "#625B71",
                    fontSize: "14px",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.type === "library" ? item.Major : item.location}
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
                    "PDF | 120 หน้า"
                  ) : item.type === "hobby" ? (
                    formatTime(item.actTime)
                  ) : item.type === "tutoring" ? (
                    formatDateThai(item.date) +
                    " | " +
                    formatTime(item.Starttime) +
                    " - " +
                    formatTime(item.Endtime)
                  ) : (
                    <></>
                  )}
                </p>
                {item.detail && (
                  <p
                    className="m-0"
                    style={{
                      color: "#7B7B7B",
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.detail}
                  </p>
                )} 
                { item.weekDate &&
                <div className="d-flex gap-2 my-2">
                  {item.weekDate.split(",").map((day, index) => (
                    <p
                      key={index}
                      className="m-0 px-2 py-1"
                      style={{
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
              </div>
              <div className="d-flex flex-row gap-2 flex-nowrap overflow-auto px-2" style={{borderRadius:"40px" , scrollbarWidth:"none"}}> 
              <div className="p-1 d-flex flex-row flex-nowrap overflow-auto" style={{ textAlign: "left" , borderRadius:"40px" , scrollbarWidth:"none"}}>
                    {item.tag &&
                      item.tag.split(",").map((tag, i) => (
                        <p
                          key={i}
                          className="mx-1 my-0 py-1 px-3 text-nowrap d-flex flex-row justify-content-center align-items-center"
                          style={{
                            fontSize: "10px",
                            borderRadius: "40px",
                            backgroundColor: "#E7E7E7",
                            display: "inline-block",
                            maxHeight:"23px"
                          }}
                        >
                          {tag}
                        </p>
                      ))}
                  </div>
                  </div>
                </div>
            <div className="my-2" style={{ maxWidth: "600px" }}>
              {/* {renderButtons(item)} */}

              {item.hID === selectedItemId && (
                <div style={{ maxWidth: "600px" }}>
                  {/* ==========[ CHANGE BTN ]=========== */}
                  {item.type === "library" ? (<>
                    <button
                    className="btn py-1 px-3 my-auto mx-1"
                    style={{ fontSize: "14px", borderRadius: "10px" }}
                    onClick={() => navigate("/aboutlibrary", { state: { id: item.hID } })}
                  >
                    <TbEye style={{ marginRight: "5px" }} />
                    ดูตัวอย่าง
                  </button>
                    <button
                    className="btn bg-white py-1 px-3 my-auto mx-1"
                    style={{ fontSize: "14px", borderRadius: "10px" }}
                    onClick={() => window.open(`${config.SERVER_PATH}/uploaded/Library/${item.filename}`, "_blank", "noopener noreferrer")}
                  >
                    <MdOutlineDownload style={{marginRight:"5px"}}/>
                    ดาวน์โหลด
                  </button>
                  <button
                    className="btn bg-white py-1 px-3 my-auto mx-1"
                    style={{ fontSize: "14px", borderRadius: "10px" }}
                  >
                    <LuShare2 style={{marginRight:"5px"}} />
                    แชร์
                  </button>
                  </>) 
                  : item.userstatus === "request" ? ( <>
                    <button
                      className="btn py-1 px-3 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px" , backgroundColor:"#B3261E" , color:"#E7E7E7" }}
                      onClick={() => {
                        // handleButtonClick(item.hID);
                        handleStatusUpdate(item.hID, "join");
                      }}
                    >
                      ยกเลิกคำขอ
                    </button>

                    </>
                  ) : item.userstatus === "member" ? (
                    <button
                      className="btn bg-white py-1 px-3 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px" }}
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
                      <FiInfo style={{marginRight:"5px" , marginBottom:"2px"}}/>
                      เกี่ยวกับกลุ่ม
                    </button>
                  ) : item.userstatus === "full" ? (
                    <button
                      className="btn bg-white py-1 px-3 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px" }}
                      disabled
                    >
                      กลุ่มเต็ม
                    </button>
                  ) : (
                    <button
                      className="btn bg-white py-1 px-3 my-auto mx-1"
                      style={{ fontSize: "14px", borderRadius: "10px" }}
                      onClick={() => {
                        handleStatusUpdate(item.hID, "request");
                      }}
                    >
                      เข้าร่วมกลุ่ม
                    </button>
                  )}
                  {item.type !== "library" ? 
                  <>
                  <button
                    className="btn bg-white py-1 px-3 my-auto mx-1"
                    style={{ fontSize: "14px", borderRadius: "10px" }}
                    onClick={() =>
                      navigate("/members", { state: { id: item.hID } })
                    }
                  >
                    สมาชิกกลุ่ม
                  </button>
                  <button
                    className="btn bg-white py-1 px-3 my-auto mx-1"
                    style={{ fontSize: "14px", borderRadius: "10px" }}
                    onClick={handleClose}
                  >
                    ปิด
                  </button>
                  </>
                      :<></>  }
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

{
  /* <PDF_Document file={item.img[0]} /> */
}
