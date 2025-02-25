import React, { useState } from "react";
import axios from "axios";
import config from "../constants/function";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchData,
  getFacultyMajorSection,
  nestDataFacultys,
} from "../constants/constants";
import AddTag from "../components/AddTag";
import { FaPlus } from "react-icons/fa6";
import Swal from 'sweetalert2'
import "../index.css";

function TutoringCreateGroup() {
  const navigate = useNavigate();
  const Location = useLocation();
  const { groupData = {}, status, groupID } = Location?.state || {};
  // const DATA = getFacultyMajorSection();
  // const data = nestDataFacultys(DATA); // with API
  const data = nestDataFacultys(fetchData); // withOut API
  console.log(data);

  const initialFacultyID =
    data.find(
      (faculty) =>
        faculty.facultyNameTH === groupData.faculty ||
        faculty.facultyNameEN === groupData.faculty
    )?.facultyID || "";
  const initialMajorID =
    data
      .find((faculty) => faculty.facultyID === initialFacultyID)
      ?.departments.find(
        (department) =>
          department.majorNameTH === groupData.major ||
          department.majorNameEN === groupData.major
      )?.majorID || "";
  const initialSectionID =
    data
      .find((faculty) => faculty.facultyID === initialFacultyID)
      ?.departments.find((department) => department.majorID === initialMajorID)
      ?.sections.find((section) => section.sectionName === groupData.section)
      ?.sectionID || "";

  console.log(initialFacultyID, initialMajorID, initialSectionID);

  const formatInitialTime = (time) => {
    console.log(groupData);
    if (time) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    }
    return "";
  };
  const [tags, setTags] = useState(() => {
    return groupData?.tag?.map((tag) => tag.trim()) || [];
  });
  
  const defaultValue = {
    activityName: groupData.activityName || "",
    // subjectName: groupData.subjectName || "",
    facultyID: initialFacultyID || "",
    majorID: initialMajorID || "",
    sectionID: initialSectionID || "",
    date: groupData.date || "",
    memberMax: groupData.memberMax || "",
    startTime: formatInitialTime(groupData.startTime),
    endTime: formatInitialTime(groupData.endTime),
    location: groupData.location || "",
    detail: groupData.detail || "",
    tag: tags || "",
  };
  const [formData, setFormData] = useState(defaultValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "memberMax") {
      const updatedValue =
        value === null ? null : Math.max(1, Math.min(99, Number(value)));

      setFormData({
        ...formData,
        [name]: value,
        memberMax: updatedValue,
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFacultyChange = (e) => {
    setFormData({
      ...formData,
      facultyID: e.target.value,
      majorID: "",
      sectionID: "",
    });
  };

  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      majorID: e.target.value,
      sectionID: "",
    });
  };

  const handleSubmit = (e) => {  
    console.log(formData);
    e.preventDefault();    
    if (!groupData.activityName && !formData.activityName ) {
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
    if (!initialFacultyID && !formData.facultyID) {
          Swal.fire({
            position: "center",
            title: "กรุณาเลือกคณะ",
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
        if (!groupData.date && !formData.date) {
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
        
        if (formData.memberMax !== "" && formData.memberMax < 2) {
          Swal.fire({
            position: "center",
            title: "จำนวนสมาชิกต้องไม่น้อยกว่า 2 คน",
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

        if ((!groupData.startTime || !groupData.endTime) && (!formData.startTime && !formData.endTime )) {
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
        if (!groupData.location && !formData.location ) {
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

        
if (status && status === "update") {
  // if (groupData.activityName === formData.activityName) {
  //   return; 
  // }

  if (!formData.activityName) {
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

  // if (groupData.facultyID === formData.facultyID) {
  //   return; 
  // }
  if (!formData.facultyID) {
    Swal.fire({
      position: "center",
      title: "กรุณาเลือกคณะ",
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

  // if (groupData.date === formData.date) {
  //   return;
  // }
  if (!formData.date) {
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

  // if (groupData.startTime === formData.startTime && groupData.endTime === formData.endTime) {
  //   return;
  // }
  if (!formData.startTime || !formData.endTime) {
    Swal.fire({
      position: "center",
      title: "กรุณาระบุเวลาเริ่มต้นและเวลาสิ้นสุด",
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

  // if (groupData.location === formData.location) {
  //   return;
  // }
  if (!formData.location) {
    Swal.fire({
      position: "center",
      title: "กรุณาระบุสถานที่",
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
}

    if (e.target.checkValidity() === false) {      
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
      e.stopPropagation();
    } else {
      console.log("Form data:", formData);
      sendForm(formData);
    }
    e.target.classList.add("was-validated");
  };

  const sendForm = async (_FormData_) => {
    console.log(groupID);
    const _newFormData_ = { ..._FormData_, tag: tags.join(", ") };
    const headersAuth = config.Headers().headers;
    console.log({ _newFormData_ });
    try {
      if (status && status === "update") {
        const result = await Swal.fire({
          title: "ยืนยันการบันทึกหรือไม่?",
          reverseButtons: true,
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
        const response = await axios.post(
          config.SERVER_PATH + "/api/tutoring/updateGroup/" + groupID,
          _newFormData_,
          { headers: headersAuth, withCredentials: true }
        );
        if (response.data.status === "ok") {
          console.log("Update tutoring group success");
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
        }else{
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
        console.log("Response:", response);
      }
      } else {
        const result = await Swal.fire({
          title: "ยืนยันการสร้างกลุ่มหรือไม่?",
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
        const response = await axios.post(
          config.SERVER_PATH + "/api/tutoring/createGroup",
          _newFormData_,
          { headers: headersAuth, withCredentials: true }
        );
        if (response.data.status === "ok") {
          console.log("Create tutoring group success");
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
        }else{
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
        console.log("Response:", response);
      }
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
  };

  const deleteGroup = async (groupID) => {
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
      await axios.delete(config.SERVER_PATH + "/api/tutoring/deleteGroup/" + groupID, { headers: config.Headers().headers, withCredentials: true}).then((res) => {
        if (res.data.status === "ok") {
          console.log("Delete tutoring group success");
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
          navigate("/tutoring");
        }
        else {
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
      })
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
  }

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div>
      <div
        className="card m-4"
        style={{
          position: "relative",
          top: "92px",
          border: "2px solid #001B79",
          borderRadius: "20px",
        }}
      >
        <div className="card-body">
          <form className="needs-validation" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="activityName" style={{ fontSize: ".8rem" }}>
                ชื่อกลุ่ม <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="activityName"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
                placeholder="Enter Group Name"
                required
              />
            </div>
            {/* <div className="form-group">
              <label htmlFor="subjectName" style={{ fontSize: ".8rem" }}>
                วิชา <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="subjectName"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="Enter Subject Name"
                required
              />
            </div> */}
            <div className="form-group mt-3 mx-2">
              <label htmlFor="facultyID" style={{ fontSize: ".8rem" }}>
                คณะ <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-control"
                id="facultyID"
                name="facultyID"
                value={formData.facultyID}
                onChange={handleFacultyChange}
                style={{
                  borderRadius: "10px",
                  border: "2px solid rgba(0,0,0,.3)",
                }}
                required
              >
                <option value="" className="text-center">
                  -- คณะ --
                </option>
                {data.map((faculty) => (
                  <option
                    key={faculty.facultyID}
                    value={faculty.facultyID}
                    className="text-center"
                  >
                    {faculty.facultyNameTH || faculty.facultyNameEN}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-0 mx-2">
              <label htmlFor="department" style={{ fontSize: ".8rem" }}>
                ภาควิชา
              </label>
              <select
                className="form-control"
                id="department"
                name="department"
                value={formData.majorID}
                onChange={handleDepartmentChange}
                style={{
                  borderRadius: "10px",
                  border: "2px solid rgba(0,0,0,.3)",
                }}
              >
                <option value="" className="text-center">
                  -- ภาควิชา --
                </option>
                {formData.facultyID &&
                  data
                    .find((faculty) => faculty.facultyID === formData.facultyID)
                    .departments.map((department) => (
                      <option
                        key={department.majorID}
                        value={department.majorID}
                        className="text-center"
                      >
                        {department.majorNameTH || department.majorNameEN}
                      </option>
                    ))}
              </select>
            </div>
            <div className="form-group mt-0 mx-2">
              <label htmlFor="sectionID" style={{ fontSize: ".8rem" }}>
                สาขาวิชา
              </label>
              <select
                className="form-control"
                id="sectionID"
                name="sectionID"
                value={formData.sectionID}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "2px solid rgba(0,0,0,.3)",
                }}
              >
                <option value="" className="text-center">
                  -- สาขาวิชา --
                </option>
                {formData.majorID &&
                  data
                    .find((faculty) => faculty.facultyID === formData.facultyID)
                    .departments.find(
                      (department) => department.majorID === formData.majorID
                    )
                    .sections.map((section) => (
                      <option
                        key={section.sectionID}
                        value={section.sectionID}
                        className="text-center"
                      >
                        {section.sectionName}
                      </option>
                    ))}
              </select>
            </div>
            <div className=" gap-3 mt-3">
              <div className="form-group">
                <label htmlFor="date" style={{ fontSize: ".8rem" }}>
                  วัน <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTodayDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberMax" style={{ fontSize: ".8rem" }}>
                  จำนวนสมาชิก (หากไม่จำกัดจำนวนให้เว้นไว้)
                </label>
                <input
                  type="number"
                  id="memberMax"
                  name="memberMax"
                  className="form-control"
                  value={formData.memberMax}
                  onChange={
                    handleChange
                  }
                  placeholder="ไม่จำกัด"
                  min="0"
                  max="99"
                  step="1"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="startTime" style={{ fontSize: ".8rem" }}>
                เวลาเริ่มต้น <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime" style={{ fontSize: ".8rem" }}>
                เวลาจบ <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" style={{ fontSize: ".8rem" }}>
                สถานที่ <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="สถานที่ติว"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="detail" style={{ fontSize: ".8rem" }}>
                รายละเอียด
              </label>
              <textarea
                className="form-control"
                id="detail"
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                placeholder="รายละเอียดเพิ่มเติม"
              />
            </div>
            <div className="my-2">
              <label htmlFor="">
                <p className="m-0">แท็ก</p>
              </label>
              <div
                className="p-2 fs-6 w-100 form-control d-flex flex-column justify-content-center"
                style={{
                  border: "1px solid rgba(0, 0, 0, .2)",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
            </div>
            <div
              className="mt-3 d-flex flex-row gap-3 justify-content-center align-items-center"
            >
              <button
                type="button"
                className="btn"
                onClick={ () => {
                                  Swal.fire({
                                        title: "ออกจากหน้านี้?",
                                        showCancelButton: true,
                                        reverseButtons: true, 
                                        html: "ข้อมูลจะไม่ถูกบันทึก ต้องการออกหรือไม่",
                                        confirmButtonText: "ออก",
                                        cancelButtonText: "ยกเลิก",
                                        customClass: {
                                          container: 'swal-container',
                                          title: 'swal-title swal-titlediscard',
                                          popup: 'swal-popup',
                                          cancelButton: 'swal-cancel-button' ,
                                          confirmButton: 'swal-confirmRed-button', 
                                        }
                                      })
                                      .then((result) => {
                                        if (result.isConfirmed) {
                                          setFormData(defaultValue);
                                          navigate(-1);
                                        }
                                      });
                                    }}
                style={{ background: "#D9D9D9", width: "80%" }}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                className="btn"
                style={{ background: "#FFB600", width: "120%" }}
              >
                {status === "update" ? "บันทึก" : "สร้าง"}
              </button>
        
            </div>
            {/* {status === "update" && (
              <div
                className="mt-3 d-flex flex-row gap-3 justify-content-center align-items-center"
              >
                <button
                  type="button"
                  className="btn"
                  style={{ background: "#FF0101", width: "100%", color: "white" }}
                  onClick={() => {deleteGroup(groupID);}}
                >
                  ลบกลุ่ม
                </button>
              </div>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default TutoringCreateGroup;

//03 August 2024
//แก้ไข tutoring | เมื่อพยายามแก้ไข หากใส่เพียงคณะไม่สามารถเซฟได้ ต้องใส่ครบทั้งคณะ สาขา ภาควิชา
