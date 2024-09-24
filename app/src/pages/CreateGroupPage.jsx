import React, { useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import config from "../constants/function";
import { useLocation, useNavigate } from "react-router-dom";
import AddTag from "../components/AddTag";
import Swal from 'sweetalert2'
import "../index.css";

const DaysOfWeek = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

function CreateGroupPage() {
  const navigate = useNavigate();
  const Location = useLocation();
  const { groupData = {}, status, hID } = Location.state || {};

  const initialWeekDate = groupData.weekDate
    ? groupData.weekDate.split(",").map((day) => day.trim())
    : [];

  const [activityName, setActivityName] = useState(
    groupData.activityName || ""
  );
  const [weekDate, setWeekDate] = useState(initialWeekDate || []);
  const [actTime, setActTime] = useState(groupData.actTime || "");
  const [memberMax, setMemberMax] = useState(groupData.memberMax || "");
  const [location, setLocation] = useState(groupData.location || "");
  const [detail, setDetail] = useState(groupData.detail || "");
  const [image, setImage] = useState(groupData.image || null);
  const [tags, setTags] = useState(() => {
    if (groupData.tag && groupData.tag.trim() !== "") {
      return groupData.tag.split(",").map((tag) => tag.trim());
    }
    return [];
  });
  // const [tag, setTag] = useState(groupData.tag || "");

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

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setImage(selectedFile); // เก็บไฟล์จริงแทน URL
    } else {
      alert("ไฟล์ที่คุณเลือกไม่รองรับ กรุณาเลือกไฟล์ภาพ (jpeg, png, gif)");
    }
  };

  const handleImageRemove = async () => {
    setImage(null);
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
    if (!actTime) {
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
    formData.append("actTime", actTime);
    formData.append("memberMax", memberMax || 0);
    formData.append("location", location);
    formData.append("detail", detail);
    if (image) formData.append("image", image);
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
          config.SERVER_PATH + `/api/hobby/create/`,
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
    if (!actTime) {
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
    formData.append("actTime", actTime);
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

    if (hID) {
      console.log("HID : " + hID);
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name);
        } else {
          console.log(`${key}:`, value);
        }
      }
      try {
        const response = await axios.post(
          config.SERVER_PATH + `/api/hobby/update/${hID}`,
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

  const deleteGroup = async (hID) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบกลุ่มหรือไม่?",
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
    });
  
    if (result.isConfirmed) {
    try {
      await axios
        .delete(config.SERVER_PATH + "/api/hobby/delete/" + hID, {
          headers: config.Headers().headers,
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            console.log("Delete hobby group success");
            Swal.fire({
              position: "center",
              title: "ลบกลุ่มแล้ว",
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                title: 'swal-title-success',
                container: 'swal-container',
                popup: 'swal-popup-error',
              }
            });
            navigate("/hobby");
          } else {
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
          container: 'swal-container',
          popup: 'swal-popup-error',
        }
      });
    }
  }
  };

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        height: "calc(100vh - 92px)", //calc(100vh - 180px)
        marginTop: "90px",
        overflow: "hidden",
        fontSize: "3.5vw",
      }}
    >
      <div
        className="w-100"
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div className="card m-4" style={{ border: "3px solid #FFB600" , borderRadius: "20px"}}>
          <div className="row p-3 my-2">
            <form action="">
              <label htmlFor="">
                <p className="m-0">
                  ชื่อกิจกรรม <span className="text-danger">*</span>
                </p>
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="ชื่อกลุ่มหรือกิจกรรม..."
                className="p-2 fs-6 w-100 form-control"
                style={{ border: "1px solid #000000", borderRadius: "5px" }}
              />
            </form>

            <div>
              <div className="my-2">
                <label htmlFor="">
                  <p className="m-0">
                    วันที่ <span className="text-danger">*</span>
                  </p>
                </label>
                <div>
                  {DaysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className="my-1 mx-1 p-0"
                      style={{
                        width: "7.5vw",
                        height: "7.5vw",
                        border: "1px solid currentColor",
                        borderRadius: "50%",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition:
                          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                        backgroundColor: weekDate.includes(day)
                          ? "#FFB600"
                          : "#D9D9D9",
                        color: "#000000",
                      }}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-7">
                  <label>
                    <p className="m-0">
                      เวลา<span className="text-danger">*</span>
                    </p>
                  </label>
                  <div>
                    <input
                      type="time"
                      value={actTime}
                      onChange={(e) => setActTime(e.target.value)}
                      className="p-2 w-100 form-control"
                      style={{
                        border: "1px solid #000000",
                        borderRadius: "5px",
                        fontSize: "3vw",
                      }}
                    />
                  </div>
                </div>

                <div className="col-5">
                  <label>
                    <p className="m-0">สมาชิก</p>
                  </label>
                  <div>
                    <input
                      type="number"
                      value={memberMax === null ? "" : memberMax}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? null
                            : Math.max(0, Math.min(99, Number(e.target.value)));
                        setMemberMax(value);
                      }}
                      className="p-2 w-100 form-control"
                      style={{
                        border: "1px solid #000000",
                        borderRadius: "5px",
                        fontSize: "3vw",
                      }}
                      placeholder="จำนวนที่รับได้"
                      min="0"
                      max="99"
                      step="1"
                    />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: "2vw" }}>
                      <span className="text-danger">*</span>
                      หากต้องการเปิดรับสมาชิกแบบไม่จำกัดจำนวนนให้เว้นว่างไว้
                    </p>
                  </div>
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
                    className="p-2 fs-6 w-100 form-control"
                    style={{
                      border: "1px solid #000000",
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
                    className="p-2 fs-6 w-100 form-control"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    style={{
                      border: "1px solid #000000",
                      borderRadius: "5px",
                    }}
                    rows="3"
                  ></textarea>
                </form>
              </div>

              <div className="row my-2">
                <form action="">
                  <label htmlFor="">
                    <p className="m-0">รูปโปรไฟล์กลุ่ม</p>
                  </label>
                  <div
                    className="p-2 fs-6 w-100 form-control d-flex justify-content-center"
                    style={{
                      border: "1px solid #000000",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
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
                        color: "#000000",
                        textDecoration: "none",
                      }}
                    >
                      {image ? null : (
                        <BiSolidImageAdd
                          className="m-5"
                          style={{ width: "10vw", height: "10vw" }}
                        />
                      )}
                    </label>
                    {image && (
                      <div className="position-relative mt-2">
                        <img
                          // src={
                          //   groupData.image === image
                          // ? `http://127.0.0.1:8000/uploaded/hobbyImage/${image}`
                          //     : URL.createObjectURL(image)
                          // }
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : `${config.SERVER_PATH}/uploaded/hobbyImage/${image}`
                          }
                          alt="Profile"
                          style={{
                            width: "30vw",
                            height: "30vw",
                            borderRadius: "5px",
                          }}
                        />
                        <IoIosCloseCircle
                          type="button"
                          className="position-absolute top-0 end-0 m-2 fs-3"
                          style={{
                            cursor: "pointer",
                            color: "#FFB600",
                          }}
                          onClick={() => setImage(null)}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              {/* //////////////////////////////////////////////////////////////// */}

              <div className="row my-2">
                <form action="">
                  <label htmlFor="">
                    <p className="m-0">แท็ก</p>
                  </label>
                  <div
                    className="p-2 fs-6 w-100 form-control d-flex flex-column justify-content-center"
                    style={{
                      border: "1px solid #000000",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* <input
                      type=""
                      style={{ display: "none" }}
                      onChange={"ฟังชั่นเกืด addtag"}
                    /> */}
                    <label
                      style={{
                        cursor: "pointer",
                        color: "#000000",
                        textDecoration: "none",
                      }}
                    >
                      <p style={{ fontSize: "3vw", color: "#D9D9D9D9" }}>
                        ใส่แฮชแท็กเพื่อให้ทุกคนสามารถเข้าถึงกลุ่มของคุณได้ง่ายขึ้น
                      </p>
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
                                className="d-flex justify-content-center align-items-center m-5 shadow-lg p-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#addTagOffcanvas"
                                aria-controls="addTagOffcanvas"
                                style={{
                                  borderRadius: "10px",
                                  backgroundColor: "#D9D9D9D9",
                                }}
                              >
                                <FaPlus
                                  style={{
                                    width: "1.2rem",
                                    height: "1.2rem",
                                    cursor: "pointer",
                                    color: "#FFB600",
                                  }}
                                />
                                <p
                                  className="my-0 mx-1 py-2"
                                  style={{ fontSize: ".8rem" }}
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
            <div className="d-flex justify-content-center align-items-center mt-3">
              <button
                className="btn btn-warning m-2 py-2 px-4 w-100"
                style={{ fontSize: "1rem" }}
                onClick={() => {
                  if (status === "update") handleSaved();
                  else handleFormSubmit();
                }}
              >
                {status ? status === "update" && "บันทึก" : "สร้าง"}
              </button>
              <button
                className="btn btn-secondary m-2 py-2 px-4 w-100 text-dark"
                style={{ fontSize: "1rem" }}
                onClick={() => window.history.back()}
              >
                ยกเลิก
              </button>
            </div>
            {status === "update" && (
              <div className="mt-2 d-flex flex-row gap-3 justify-content-center align-items-center">
                <button
                  className="btn py-2 px-4 w-100"
                  style={{
                    fontSize: "1rem",
                    background: "#FF0101",
                    width: "100%",
                    color: "white",
                  }}
                  onClick={() => {
                    deleteGroup(hID);
                  }}
                >
                  ลบกลุ่ม
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPage;
