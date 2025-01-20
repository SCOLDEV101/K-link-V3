import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import config from "../constants/function";
import { useLocation, useNavigate } from "react-router-dom";
import AddTag from "../components/AddTag";
import Swal from 'sweetalert2'
import "../index.css";


function CreateGroupPage() {
  const navigate = useNavigate();
  const Location = useLocation();
  const { groupData = {}, status, groupID } = Location.state || {};

  const initialWeekDate = groupData.weekDate
    ? groupData.weekDate.map((day) => day.trim())
    : [];

  const [activityName, setActivityName] = useState(
    groupData.activityName || ""
  );
  const [disabledMemberMax, setDisabledMemberMax] = useState(false)
  const [weekDate, setWeekDate] = useState(initialWeekDate || []);
  const [startTime, setStartTime] = useState(groupData.startTime || "");
  const [endTime, setEndTime] = useState(groupData.endTime || "");
  const [memberMax, setMemberMax] = useState(groupData.memberMax || "");
  const [location, setLocation] = useState(groupData.location || "");
  const [detail, setDetail] = useState(groupData.detail || "");
  const [image, setImage] = useState(groupData.image || null);
  const [tags, setTags] = useState(() => {
    return groupData?.tag?.map((tag) => tag.trim()) || [];
  });
  
  const [tag, setTag] = useState(groupData.tag || "");

  const [imageSelected, setImageSelected] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);

  const headersAuth = config.Headers().headers;

  const toggleDay = (day) => {
    if (weekDate.includes(day)) {
      setWeekDate(weekDate.filter((d) => d !== day));
    } else {
      setWeekDate([...weekDate, day]);
    }
  };

  const handleImageChange = (event) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedFile = event.target.files[0];
    setImageSelected(selectedFile)

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setDefaultImage(null);
      setImage(selectedFile);
      event.target.value = "";
    } else {
      alert("ไฟล์ที่คุณเลือกไม่รองรับ กรุณาเลือกไฟล์ภาพ (jpeg, png, gif)");
      event.target.value = "";
    }
  };

  const handleSelectedDefaultImageFile = async (src) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], src.split('/').pop(), { type: blob.type });
      setDefaultImage(file);
      console.log("Selected Image File:", file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleFormSubmit = async () => {
    if (!activityName) {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกชื่อกลุ่ม",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (weekDate.length === 0) {
      Swal.fire({
        position: "center",
        title: "กรุณาเลือกวันที่",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (!startTime || !endTime) {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกเวลา",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (!location) {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกสถานที่",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }

    const result = await Swal.fire({
      title: "ยืนยันการสร้างกลุ่มหรือไม่?",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: 'swal-container',
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("activityName", activityName);
      formData.append("weekDate", weekDate); //JSON.stringify(weekDate)
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("memberMax", memberMax);
      formData.append("location", location);
      formData.append("detail", detail);
      if (image && (image !== defaultImage && defaultImage)) {
        console.log(defaultImage);
        formData.append("image", defaultImage)
      } else if (image && (defaultImage === null)) {
        formData.append("image", image)
        console.log(image);
      }
      const tagsString = tags.join(", ");
      console.log("Save tags:", tagsString);
      if (tagsString) formData.append("tag", tagsString);

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name); // แสดงชื่อไฟล์
        } else {
          console.log(`${key}:`, value);
        }
      }

      try {
        const response = await axios.post(
          config.SERVER_PATH + `/api/hobby/createGroup`,
          formData,
          {
            headers: headersAuth,
            withCredentials: true,
          }
        );
        if (response.data.status === "ok") {
          console.log("create group success");
          Swal.fire({
            position: "center",
            title: "สร้างกลุ่มสำเร็จ",
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              title: 'swal-title-success',
              container: 'swal-container',
              popup: 'swal-popup-success',
            }
          });
          navigate(-1);
        } else {
          console.log("failed to create group");
          console.log(response.data);
          Swal.fire({
            position: "center",
            title: "เกิดข้อผิดพลาด",
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              title: 'swal-title-success',
              container: 'swal-container',
              popup: 'swal-popup-error',
            }
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          position: "center",
          title: "เกิดข้อผิดพลาด",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-success',
            container: 'swal-container',
            popup: 'swal-popup-error',
          }
        });
      }
    }
  };

  const handleSaved = async () => {
    if (!activityName) {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกชื่อกลุ่ม",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (weekDate.length === 0) {
      Swal.fire({
        position: "center",
        title: "กรุณาเลือกวันที่",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (!startTime || !endTime) {
      alert("กรุณากรอกเวลา");
      Swal.fire({
        position: "center",
        title: "กรุณากรอกเวลา",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }
    if (!location) {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกสถานที่",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: 'swal-title-success',
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
      return;
    }


    const result = await Swal.fire({
      title: "ยืนยันการบันทึกหรือไม่?",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: 'swal-container',
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("activityName", activityName);
      formData.append("weekDate", weekDate); //JSON.stringify(weekDate)
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("memberMax", memberMax);
      formData.append("location", location);
      formData.append("detail", detail);
      if (image instanceof File) {
        formData.append("image", image);
      } else if (image === null) {
        formData.append("image", null);
      } else {
        formData.append("image", groupData.image);
      }
      formData.append("tag", tags);

      if (groupID) {
        console.log("1");
        console.log("groupID : " + groupID);
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, value.name);
          } else {
            console.log(weekDate);
            console.log(`${key}:`, value);
          }
        }
        try {
          const response = await axios.post(
            config.SERVER_PATH + `/api/hobby/updateGroup/${groupID}`,
            formData,
            {
              headers: headersAuth,
              withCredentials: true,
            }
          );
          if (response.data.status === "ok") {
            console.log("edit group success");
            Swal.fire({
              position: "center",
              title: "บันทึกการแก้ไขแล้ว",
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                title: 'swal-title-success',
                container: 'swal-container',
                popup: 'swal-popup-success',
              }
            });
            navigate(-1);
          } else {
            console.log("failed to edit group");
            Swal.fire({
              position: "center",
              title: "เกิดข้อผิดพลาด",
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                title: 'swal-title-success',
                container: 'swal-container',
                popup: 'swal-popup-error',
              }
            });
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            position: "center",
            title: "เกิดข้อผิดพลาด",
            showConfirmButton: false,
            timer: 2000,
            customClass: {
              title: 'swal-title-success',
              container: 'swal-container',
              popup: 'swal-popup-error',
            }
          });
        }
      }
    }
  };

const dayColors = {
  "จ.": "#FFB600",
  "อ.": "#EFB8C8",
  "พ.": "#7CB518",
  "พฤ.": "#F96E20",
  "ศ.": "#729BC0",
  "ส.": "#A970C4",
  "อา.": "#B3261E",
};
const daysThai = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

  const DefaultImageUrl = [
    {
      src: "../slide/s1.jpeg",
      alt: "d-1"
    },
    {
      src: "../slide/s2.jpg",
      alt: "d-2"
    },
    {
      src: "../slide/s3.jpg",
      alt: "d-3"
    }
  ];

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        height: "calc(100vh - 92px)", //calc(100vh - 180px)
        marginTop: "90px",
        overflow: "hidden",
        fontSize: "3.5vw",
        background: "#fff"
      }}
    >
      <div
        className="w-100"
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div className="card m-3 mt-5" style={{ borderRadius: "10px", boxShadow: "0 4px 13px rgba(0, 0, 0, .2)" }}>
          <div className="row p-3 my-2">
            <form action="">
              <label htmlFor="">
                <p className="m-0">
                  ชื่อกลุ่ม<span className="text-danger">*</span>
                </p>
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="ชื่อกลุ่มหรือกิจกรรม..."
                className="p-1 px-2 fs-6 w-100 form-control"
                style={{ border: "1.5px solid #E7E7E7", borderRadius: "5px" }}
              />
            </form>
            <div className="my-2">
              <label htmlFor="">
                <p className="m-0">
                  เลือกรูปภาพ<span className="text-danger">*</span>
                </p>
              </label>
              <div
                className="p-0 w-100 d-flex flex-row justify-content-start align-items-center gap-2 flex-wrap"
                style={{
                }}
              >
                <div
                  className="d-flex flex-row justify-content-center align-items-center"
                  style={{
                    border: "1.5px solid #E7E7E7",
                    borderRadius: "5px",
                    width: "45px",
                    height: "45px"
                  }}
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="profileImageInput"
                    onChange={handleImageChange}
                    accept="image/jpeg, image/png, image/gif"
                  />
                  <label
                    htmlFor="profileImageInput"
                    style={{
                      cursor: "pointer",
                      color: "#979797",
                      textDecoration: "none",
                    }}
                  >
                    <FaPlus
                      className=""
                      style={{ width: "1rem", height: "1rem" }}
                    />
                  </label>
                </div>
                <div className="position-relative">
                  {image ?
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : `${config.SERVER_PATH}/uploaded/hobbyImage/${image}`
                      }
                      alt=""
                      onClick={() => { setImageSelected(image); setImage(image); setDefaultImage(null); }}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "5px",
                        border: "1.5px solid #E7E7E7",
                        boxShadow: imageSelected === image ? "0 0 5px #FFB600" : "",
                      }}
                    />
                    :
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "5px",
                        background: "#D9D9D9D9",
                        border: "1.5px solid #E7E7E7",
                      }}
                    >
                    </div>
                  }
                </div>
                {DefaultImageUrl.length > 0 && DefaultImageUrl.map((item, idx) => (
                  <img
                    key={item.alt}
                    onClick={() => { handleSelectedDefaultImageFile(item.src); setImageSelected(idx); }}
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "5px",
                      border: "1.5px solid #E7E7E7",
                      boxShadow: imageSelected === idx ? "0 0 5px #FFB600" : "",
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="my-2">
                <label htmlFor="">
                  <p className="m-0">
                    เลือกวัน<span className="text-danger">*</span>
                  </p>
                </label>
                <div className="d-flex gap-2 my-2">
                {daysThai.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className="m-0"
                    style={{
                      paddingLeft: ".40rem",
                      paddingRight: ".40rem",
                      color: "#000000",
                      fontSize: "14px",
                      border: `1.5px solid ${dayColors[day]}`,
                      background: weekDate.includes(day) && `${dayColors[day]}`,
                      borderRadius: day === "อา." || day === "พฤ." ? "15px" : "50%",
                    }}
                    onClick={() => toggleDay(day)} 
                  >
                    {day}
                  </button>
                ))}
              </div>
              </div>
              <div className="row my-2">
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <div className="w-100">
                    <label>
                      <p className="m-0">
                        ตั้งแต่<span className="text-danger">*</span>
                      </p>
                    </label>
                    <div>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="p-1 px-2 fs-6 w-100 form-control"
                        style={{
                          color: "#000",
                          border: "1.5px solid #E7E7E7",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-25 text-center mt-4">
                    <span className="fs-2 fw-medium">-</span>
                  </div>
                  <div className="w-100">
                    <label>
                      <p className="m-0">
                        จนถึง<span className="text-danger">*</span>
                      </p>
                    </label>
                    <div>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="p-1 px-2 fs-6 w-100 form-control"
                        style={{
                          color: "#000",
                          border: "1.5px solid #E7E7E7",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-100">
                <label>
                  <p className="m-0">
                    จำนวนสมาชิก<span className="text-danger">*</span>
                  </p>
                </label>
                <div className="w-100 d-flex gap-2 flex-row justify-content-center align-items-center">
                  <input
                    type="number"
                    value={memberMax === null ? "" : memberMax}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? null //null
                          : Math.max(0, Math.min(99, Number(e.target.value)));
                      setMemberMax(value);
                    }}
                    className="p-1 px-2 form-control"
                    style={{
                      color: "#000",
                      width: "60%",
                      border: "1.5px solid #E7E7E7",
                      borderRadius: "5px",
                    }}
                    placeholder={disabledMemberMax ? "ไม่จำกัด" : "ชั้นต่ำ 2 คน"}
                    min="2"
                    step="1"
                    disabled={disabledMemberMax}
                  />
                  <button type="button" onClick={() => { setMemberMax(""); setDisabledMemberMax(!disabledMemberMax); }} className="p-1 fs-6 text-dark" style={{ width: "40%", background: disabledMemberMax ? "#F89603" : "#E7E7E7", border: "1.5px solid #E7E7E7", borderRadius: "5px" }}>ไม่จำกัด</button>
                </div>
              </div>

              <div className="row my-2">
                <form action="">
                  <label htmlFor="">
                    <p className="m-0">
                      สถานที่<span className="text-danger">*</span>
                    </p>
                  </label>
                  <input
                    type="text"
                    placeholder="สถานที่"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-1 ps-2 fs-6 w-100 form-control"
                    style={{
                      color: "#000",
                      width: "60%",
                      border: "1.5px solid #E7E7E7",
                      borderRadius: "5px",
                    }}
                  />
                </form>
              </div>
              <div className="row my-2">
                <form action="">
                  <label htmlFor="">
                    <p className="m-0">รายละเอียด</p>
                  </label>
                  <textarea
                    placeholder="รายละเอียด"
                    className="p-1 ps-2 fs-6 w-100 form-control"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    style={{
                      color: "#000",
                      width: "60%",
                      border: "1.5px solid #E7E7E7",
                      borderRadius: "5px",
                    }}
                    rows="3"
                  ></textarea>
                </form>
              </div>
              <div className="row my-2">
                <form action="">
                  <label htmlFor="">
                    <p className="m-0">แท็ก</p>
                  </label>
                  <div
                    className="p-2 fs-6 w-100 form-control d-flex flex-column justify-content-center"
                    style={{
                      color: "#000",
                      width: "60%",
                      border: "1.5px solid #E7E7E7",
                      borderRadius: "5px",
                    }}
                  >
                    <label
                      style={{
                        cursor: "pointer",
                        color: "#000",
                        textDecoration: "none",
                      }}
                    >
                      {true && ( //tag ? null :
                        <>
                          {tags.length > 0 && (
                            <div className="d-flex flex-row flex-wrap gap-2 justify-content-center">
                              {tags.map((tag, i) => (
                                <div
                                  key={i}
                                  className="badge rounded-pill text-dark px-3 py-2 text-truncate"
                                  style={{
                                    background: "#FFB600",
                                    boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                                    maxWidth: "120px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {tag}
                                </div>
                              ))}
                            </div>
                          )}
                          <AddTag
                            FunctionToSave={setTags}
                            btnHTML={
                              <div
                                className="d-flex justify-content-center align-items-center mx-5 my-3 shadow-lg p-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#addTagOffcanvas"
                                aria-controls="addTagOffcanvas"
                                style={{
                                  borderRadius: "5px",
                                  backgroundColor: "#F89603",
                                }}
                              >
                                <p
                                  className="my-0 mx-1 py-2"
                                  style={{ fontSize: "1.025rem", color: "#FFFF" }}
                                >
                                  เพิ่มแท็ก
                                </p>
                              </div>
                            }
                            initialTags={groupData.tag}
                          />
                        </>
                      )}
                    </label>
                  </div>
                </form>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-2 gap-2">
              <button
                className="btn py-2 px-4 text-dark"
                style={{ fontSize: "1rem", borderRadius: "10px", background: "#E7E7E7", width: "40%" }}
                onClick={() => window.history.back()}
              >
                ยกเลิก
              </button>
              <button
                className="btn py-2 px-4"
                style={{ color: "#FFFF", fontSize: "1rem", borderRadius: "10px", width: "60%", background: "#F89603" }}
                onClick={() => {
                  if (status === "update") handleSaved();
                  else handleFormSubmit();
                }}
              >
                {status ? status === "update" && "บันทึก" : "สร้าง"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPage;
