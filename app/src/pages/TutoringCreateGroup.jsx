import React, { useState } from "react";
import axios from "axios";
import config from "../constants/function";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData, nestDataFacultys } from "../constants/constants";
import AddTag from "../components/AddTag";
import { FaPlus } from "react-icons/fa6";
import Swal from "sweetalert2";
import "../index.css";

function TutoringCreateGroup() {
  const navigate = useNavigate();
  const Location = useLocation();
  const { groupData = {}, status, hID } = Location?.state || {};
  // const DATA = getFacultyMajorSection();
  // const data = nestDataFacultys(DATA); // with API
  const data = nestDataFacultys(fetchData); // withOut API
  console.log(data);

  const DefaultImageUrl = [
    {
      src: "../slide/s1.jpeg",
      alt: "d-1",
    },
    {
      src: "../slide/s2.jpg",
      alt: "d-2",
    },
    {
      src: "../slide/s3.jpg",
      alt: "d-3",
    },
  ];
  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);
  const [memberMax, setMemberMax] = useState(groupData.memberMax || "");
  const [disabledMemberMax, setDisabledMemberMax] = useState(false);

  const handleImageChange = (event) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedFile = event.target.files[0];

    setImageSelected(selectedFile);

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setDefaultImage(null);
      setImage(selectedFile);

      setFormData({
        ...formData,
        image: selectedFile,
      });

      event.target.value = "";
    } else {
      alert("ไฟล์ที่คุณเลือกไม่รองรับ กรุณาเลือกไฟล์ภาพ (jpeg, png, gif)");

      setDefaultImage(null);
      setImage(null);

      event.target.value = "";
    }
  };

  const handleSelectedDefaultImageFile = async (src) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], src.split("/").pop(), { type: blob.type });
      setDefaultImage(file);
      setFormData({
        ...formData,
        image: file,
      });
      console.log("Selected Image File:", file);
    } catch (error) {
      console.error("Error fetching image:", error);
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
  const initialWeekDate = groupData.weekDate
    ? groupData.weekDate.split(",").map((day) => day.trim())
    : [];
  const [weekDate, setWeekDate] = useState(initialWeekDate || []);
  const toggleDay = (indexOfDay) => {
    if (weekDate.includes(indexOfDay)) {
      setWeekDate(weekDate.filter((d) => d !== indexOfDay));
    } else {
      setWeekDate([...weekDate, indexOfDay]);
    }
  };

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
  const initialdepartmentID =
    data
      .find((faculty) => faculty.facultyID === initialFacultyID)
      ?.departments.find((department) => department.majorID === initialMajorID)
      ?.sections.find((section) => section.sectionName === groupData.department)
      ?.departmentID || "";

  console.log(initialFacultyID, initialMajorID, initialdepartmentID);

  const formatInitialTime = (time) => {
    console.log(groupData);
    if (time) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    }
    return "";
  };
  const [tags, setTags] = useState(() => {
    if (groupData.tag && groupData.tag.trim() !== "") {
      return groupData.tag.split(",").map((tag) => tag.trim());
    }
    return [];
  });
  const defaultValue = {
    activityName: groupData.activityName || "",
    facultyID: initialFacultyID || "",
    majorID: initialMajorID || "",
    departmentID: initialdepartmentID || "",
    date: groupData.date || "",
    memberMax: groupData.memberMax || "",
    startTime: formatInitialTime(groupData.Starttime),
    endTime: formatInitialTime(groupData.Endtime),
    location: groupData.location || "",
    detail: groupData.detail || "",
    image: null,
    tag: tags || "",
  };
  const [formData, setFormData] = useState(defaultValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "memberMax") {
      const updatedValue =
        value === null ? null : Math.max(0, Math.min(99, Number(value)));

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

  const handleMemberMaxChange = (count) => {
    setMemberMax(count);
    setFormData({
      ...formData,
      memberMax: count,
    });
  };

  const handleFacultyChange = (e) => {
    setFormData({
      ...formData,
      facultyID: e.target.value,
      majorID: "",
      departmentID: "",
    });
  };

  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      majorID: e.target.value,
      departmentID: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      alert("โปรดกรอกข้อมูลให้ครบถ้วน");
      e.stopPropagation();
    } else {
      console.log("Form data:", formData);
      sendForm(formData);
    }
    e.target.classList.add("was-validated");
  };

  const sendForm = async (_FormData_) => {
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
            container: "swal-container",
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
        });

        if (result.isConfirmed) {
          const response = await axios.post(
            config.SERVER_PATH + "/api/tutoring/update/" + hID,
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
                title: "swal-title-success",
                container: "swal-container",
                popup: "swal-popup-success",
              },
            });
            navigate(-1);
          } else {
            Swal.fire({
              position: "center",
              title: "เกิดข้อผิดพลาด",
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                title: "swal-title-success",
                container: "swal-container",
                popup: "swal-popup-error",
              },
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
            container: "swal-container",
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
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
                title: "swal-title-success",
                container: "swal-container",
                popup: "swal-popup-success",
              },
            });
            // navigate(-1);
          } else {
            Swal.fire({
              position: "center",
              title: "เกิดข้อผิดพลาด",
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                title: "swal-title-success",
                container: "swal-container",
                popup: "swal-popup-error",
              },
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
          title: "swal-title-success",
          container: "swal-container",
          popup: "swal-popup-error",
        },
      });
    }
  };

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
        className="card m-3 mt-4"
        style={{
          position: "relative",
          top: "100px",
          border: "none",
          borderRadius: "10px",
          boxShadow: "0 4px 13px rgba(0, 0, 0, .2)",
          minWidth: "285px",
        }}
      >
        <div className="card-body">
          {/* ชื่อกิจกรรม form */}
          <form className="needs-validation" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="activityName" style={{ fontSize: ".8rem" }}>
                ชื่อกิจกรรม<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control py-1 px-2"
                id="activityName"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
                placeholder="ชื่อกิจกรรม"
                style={{
                  borderRadius: "6px",
                  border: "1.5px solid #E7E7E7",
                }}
                required
              />
            </div>

            {/* select image form */}
            <div className="my-2">
              <label htmlFor="ImageInput" style={{ fontSize: ".8rem" }}>
                เลือกรูปภาพ<span style={{ color: "red" }}>*</span>
              </label>
              <div className="p-0 w-100 d-flex flex-row justify-content-start align-items-center gap-2">
                <div
                  className="d-flex flex-row justify-content-center align-items-center"
                  style={{
                    border: "1.5px solid #E7E7E7",
                    borderRadius: "5px",
                    width: "45px",
                    height: "45px",
                  }}
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="ImageInput"
                    onChange={handleImageChange}
                    accept="image/jpeg, image/png, image/gif"
                  />
                  <label
                    htmlFor="ImageInput"
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
                  {image ? (
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : `${config.SERVER_PATH}/uploaded/hobbyImage/${image}`
                      }
                      alt=""
                      onClick={() => {
                        setImageSelected(image);
                        setImage(image);
                        setDefaultImage(null);
                      }}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "5px",
                        border: "1.5px solid #E7E7E7",
                        boxShadow:
                          imageSelected === image ? "0 0 5px #FFB600" : "",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "5px",
                        background: "#D9D9D9D9",
                        border: "1.5px solid #E7E7E7",
                      }}
                    ></div>
                  )}
                </div>
                {DefaultImageUrl.length > 0 &&
                  DefaultImageUrl.map((item, idx) => (
                    <img
                      key={item.alt}
                      onClick={() => {
                        handleSelectedDefaultImageFile(item.src);
                        setImageSelected(idx);
                      }}
                      src={item.src}
                      alt={item.alt}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "5px",
                        border: "1.5px solid #E7E7E7",
                        boxShadow:
                          imageSelected === idx ? "0 0 5px #FFB600" : "",
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* faculty, major, section form */}
            <div className="form-group mt-2">
              <label htmlFor="facultyID" style={{ fontSize: ".8rem" }}>
                คณะ<span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="form-control py-1 px-2"
                id="facultyID"
                name="facultyID"
                value={formData.facultyID}
                onChange={handleFacultyChange}
                style={{
                  borderRadius: "6px",
                  border: "2px solid #625B71",
                  color: formData.facultyID === "" ? "#979797" : "#979797", // "#979797" : "#000000"
                }}
                required
              >
                <option value="" className="text-center text-dark">
                  -- คณะ --
                </option>
                {data.map((faculty) => (
                  <option
                    key={faculty.facultyID}
                    value={faculty.facultyID}
                    className="text-center text-dark"
                  >
                    {faculty.facultyNameTH || faculty.facultyNameEN}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department" style={{ fontSize: ".8rem" }}>
                ภาควิชา
              </label>
              <select
                className="form-control py-1 px-2"
                id="department"
                name="department"
                value={formData.majorID}
                onChange={handleDepartmentChange}
                style={{
                  borderRadius: "6px",
                  border: "2px solid #625B71",
                  color: formData.facultyID === "" ? "#979797" : "#979797", // "#979797" : "#000000"
                }}
              >
                <option value="" className="text-center text-dark">
                  -- ภาควิชา --
                </option>
                {formData.facultyID &&
                  data
                    .find((faculty) => faculty.facultyID === formData.facultyID)
                    .departments.map((department) => (
                      <option
                        key={department.majorID}
                        value={department.majorID}
                        className="text-center text-dark"
                      >
                        {department.majorNameTH || department.majorNameEN}
                      </option>
                    ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="departmentID" style={{ fontSize: ".8rem" }}>
                สาขาวิชา
              </label>
              <select
                className="form-control py-1 px-2"
                id="departmentID"
                name="departmentID"
                value={formData.departmentID}
                onChange={handleChange}
                style={{
                  borderRadius: "6px",
                  border: "2px solid #625B71",
                  color: formData.facultyID === "" ? "#979797" : "#979797", // "#979797" : "#000000"
                }}
              >
                <option value="" className="text-center text-dark">
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
                        className="text-center text-dark"
                      >
                        {section.sectionName}
                      </option>
                    ))}
              </select>
            </div>

            {/* day select form */}
            <div className=" gap-3 mt-3">
              <div className="form-group">
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
                        background:
                          weekDate.includes(index) && `${dayColors[day]}`,
                        borderRadius:
                          day === "อา." || day === "พฤ." ? "15px" : "50%",
                      }}
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <label htmlFor="date" style={{ fontSize: ".8rem" }}>
                  วันที่<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control px-2 py-1"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTodayDate()}
                  style={{
                    borderRadius: "6px",
                    border: "1.5px solid #E7E7E7",
                  }}
                  required
                />
              </div>
            </div>
            {/* <div className="form-group">
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
            </div> */}

            {/* Time Form */}
            <div className="d-flex flex-row justify-content-center align-items-center mt-2">
              <div className="w-100">
                <label>
                  <p className="m-0" style={{ fontSize: ".8rem" }}>
                    ตั้งแต่<span className="text-danger">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
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
                  <p className="m-0" style={{ fontSize: ".8rem" }}>
                    จนถึง<span className="text-danger">*</span>
                  </p>
                </label>
                <div>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
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

            {/* detail form */}
            <div className="form-group mt-2">
              <label htmlFor="detail" style={{ fontSize: ".8rem" }}>
                รายละเอียด
              </label>
              <textarea
                placeholder="รายละเอียดเพิ่มเติม"
                id="detail"
                name="detail"
                className="p-1 ps-2 fs-6 w-100 form-control"
                value={formData.detail}
                onChange={handleChange}
                style={{
                  color: "#000",
                  width: "60%",
                  border: "1.5px solid #E7E7E7",
                  borderRadius: "5px",
                }}
                rows="3"
                // onChange={handleChange}
              />
            </div>

            {/* Member count form */}
            <div className="form-group mt-2">
              <label>
                <p className="m-0" style={{ fontSize: ".8rem" }}>
                  จำนวนสมาชิก<span className="text-danger">*</span>
                </p>
              </label>
              {/* <input
                type="number"
                id="memberMax"
                name="memberMax"
                className="form-control"
                value={formData.memberMax}
                onChange={handleChange}
                placeholder="ไม่จำกัด"
                min="0"
                max="99"
                step="1"
              /> */}
              <div className="w-100 d-flex gap-2 flex-row justify-content-center align-items-center">
                <input
                  type="number"
                  name="memberMax"
                  id="memberMax"
                  value={memberMax === null ? "" : memberMax}
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? null //null
                        : Math.max(0, Math.min(99, Number(e.target.value)));
                    handleMemberMaxChange(value);
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
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setMemberMax("");
                    setDisabledMemberMax(!disabledMemberMax);
                  }}
                  className="p-1 fs-6 text-dark"
                  style={{
                    width: "40%",
                    background: disabledMemberMax ? "#F89603" : "#E7E7E7",
                    border: "1.5px solid #E7E7E7",
                    borderRadius: "5px",
                  }}
                >
                  ไม่จำกัด
                </button>
              </div>
            </div>
            <div className="form-group mt-2">
              <label htmlFor="location" style={{ fontSize: ".8rem" }}>
                สถานที่ <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control px-2 py-1"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="สถานที่ติว"
                style={{
                  border: "1.5px solid #E7E7E7",
                  borderRadius: "5px",
                }}
                required
              />
            </div>

            {/* Tag form */}
            <div className="my-2">
              <label htmlFor="">
                <p className="m-0" style={{ fontSize: ".8rem" }}>
                  แท็ก
                </p>
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
            </div>
            <div className="mt-3 d-flex flex-row gap-3 justify-content-center align-items-center">
              <button
                type="button"
                className="btn py-2 px-4 text-dark"
                style={{
                  fontSize: "1rem",
                  borderRadius: "10px",
                  background: "#E7E7E7",
                  width: "40%",
                }}
                onClick={() => {
                  setFormData(defaultValue);
                  navigate(-1);
                }}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn py-2 px-4"
                style={{
                  color: "#FFFF",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  width: "60%",
                  background: "#F89603",
                }}
              >
                {status === "update" ? "บันทึก" : "สร้างกลุ่มติว"}
              </button>
            </div>
            {/* {status === "update" && (
              <div className="mt-3 d-flex flex-row gap-3 justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn"
                  style={{
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

// .was-validated .form-control:valid,
// .was-validated .form-select:valid {
//   border: 1.5px solid green !important
// }

// .was-validated .form-control:invalid,
// .was-validated .form-select:invalid {
//   border: 1.5px solid red !important
// }

// /* แสดงไอคอนเฉพาะที่ต้องการ (เช่น input ที่มี id="validationDefault01") */
// .was-validated #date:valid,
// .was-validated #startTime:valid,
// .was-validated #endTime:valid {
//   background-image: none !important;
// }

// .was-validated #date:invalid,
// .was-validated #startTime:invalid,
// .was-validated #endTime:invalid {
//   background-image: none !important;
// }
