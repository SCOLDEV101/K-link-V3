import React, { useState } from "react";
import axios from "axios";
import config from "../constants/function";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData, nestDataFacultys } from "../constants/constants";
import AddTag from "../components/AddTag";
import { FaPlus } from "react-icons/fa6";
import { FiFileMinus, FiFilePlus } from "react-icons/fi";

function LibraryCreatePost() {
  const navigate = useNavigate();
  const Location = useLocation();
  const { postData = {}, status, hID } = Location?.state || {};
  // const DATA = getFacultyMajorSection();
  // const data = nestDataFacultys(DATA); // with API
  const data = nestDataFacultys(fetchData); // withOut API
  console.log(data);

  const initialFacultyID =
    data.find(
      (faculty) =>
        faculty.facultyNameTH === postData.faculty ||
        faculty.facultyNameEN === postData.faculty
    )?.facultyID || "";
  const initialMajorID =
    data
      .find((faculty) => faculty.facultyID === initialFacultyID)
      ?.departments.find(
        (department) =>
          department.majorNameTH === postData.major ||
          department.majorNameEN === postData.major
      )?.majorID || "";
  const initialSectionID =
    data
      .find((faculty) => faculty.facultyID === initialFacultyID)
      ?.departments.find((department) => department.majorID === initialMajorID)
      ?.sections.find((section) => section.sectionName === postData.section)
      ?.sectionID || "";

  console.log(initialFacultyID, initialMajorID, initialSectionID);

  const [file, setFile] = useState();
  const [tags, setTags] = useState(() => {
    if (postData.tag && postData.tag.trim() !== "") {
      return postData.tag.split(",").map((tag) => tag.trim());
    }
    return [];
  });
  const defaultValue = {
    activityName: postData.activityName || "",
    facultyID: initialFacultyID || "",
    majorID: initialMajorID || "",
    sectionID: initialSectionID || "",
    detail: postData.detail || "",
    tag: tags || "",
  };
  const [formData, setFormData] = useState(defaultValue);

  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [defaultImage, setDefaultImage] = useState(null);

  const handleImageChange = (event) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const selectedFile = event.target.files[0];
    setImageSelected(selectedFile);

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
      const file = new File([blob], src.split("/").pop(), { type: blob.type });
      setDefaultImage(file);
      console.log("Selected Image File:", file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      const file = files[0];
      if (file && file.type === "application/pdf") {
        console.log(file);
        setFile(file);
      } else {
        alert("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
        e.target.value = null;
      }
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
    const _newFormData_ = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value) {
        if (key === "file") {
          _newFormData_.append(key, file);
        } else if (key === "tag") {
          _newFormData_.append(key, tags.join(", "));
        } else {
          _newFormData_.append(key, value);
        }
      }
    }
    const headersAuth = {
      ...config.Headers().headers,
      "Content-Type": "multipart/form-data",
    };
    console.log({ _newFormData_ });

    const formDataToObject = (formData) => {
      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      return object;
    };
    const formDataObject = formDataToObject(_newFormData_);
    console.log(formDataObject);

    try {
      if (status && status === "update") {
        const response = await axios.post(
          config.SERVER_PATH + "/api/library/updateLibrary/" + hID,
          _newFormData_,
          {
            headers: headersAuth,
            withCredentials: true,
          }
        );
        if (response.data.status === "ok") {
          console.log("Update tutoring group success");
          navigate(-1);
        }
        console.log("Response:", response);
      } else {
        const response = await axios.post(
          config.SERVER_PATH + "/api/library/createGroup",
          _newFormData_,
          {
            headers: headersAuth,
            withCredentials: true,
          }
        );
        if (response.data.status === "ok") {
          console.log("Create tutoring group success");
          navigate(-1);
        }
        console.log("Response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        className="w-100"
        style={{
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
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
            <form
              className="needs-validation"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="activityName" style={{ fontSize: ".8rem" }}>
                  หัวข้อ<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control py-1 px-2"
                  id="activityName"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  placeholder="ชื่อหัวข้อ วิชา"
                  style={{
                    borderRadius: "6px",
                    border: "2px solid #E7E7E7",
                  }}
                  required
                />
              </div>
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
                      .find(
                        (faculty) => faculty.facultyID === formData.facultyID
                      )
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
                <label htmlFor="sectionID" style={{ fontSize: ".8rem" }}>
                  สาขา
                </label>
                <select
                  className="form-control py-1 px-2"
                  id="sectionID"
                  name="sectionID"
                  value={formData.sectionID}
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
                      .find(
                        (faculty) => faculty.facultyID === formData.facultyID
                      )
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
              {postData.flies && <div className="">ไฟล์เก่า</div>}
              <div className="form-group mt-2">
                <label htmlFor="file" style={{ fontSize: ".8rem" }}>
                  {/* {postData.flies
                    ? "อัปโหลดไฟล์ใหม่ (เฉพาะ PDF)"
                    : "อัปโหลดไฟล์ (เฉพาะ PDF)"}{" "} */}
                  อัปโหลดไฟล์
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex flex-row align-items-center">
                  <label
                    htmlFor="file"
                    className="d-flex flex-row align-items-center px-2"
                    style={{
                      width: "100%",
                      height: "35px",
                      border: "2px solid #E7E7E7",
                      borderRadius: "6px 0px 0px 6px",
                      color: file ? "black" : "#979797",
                      overflowY: "hidden",
                      overflowX: "auto",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      scrollbarWidth: "none",
                    }}
                  >
                    {file ? file.name : "เลือกไฟล์"}
                  </label>
                  <label
                    htmlFor="file"
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      height: "35px",
                      width: "45px",
                      border: "none",
                      borderRadius: "0px 6px 6px 0px",
                      background: "#E7E7E7",
                    }}
                  >
                    {file ? (
                      <FiFileMinus
                        onClick={() => setFile(null)}
                        className="fw-bold fs-5"
                      />
                    ) : (
                      <FiFilePlus htmlFor="file" className="fw-bold fs-5" />
                    )}
                  </label>
                </div>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  accept="application/pdf"
                  style={{
                    display: "none",
                  }}
                  required
                />
              </div>
              <div className="form-group mt-2">
                <label htmlFor="detail" style={{ fontSize: ".8rem" }}>
                  รายละเอียด
                </label>
                <textarea
                  placeholder="รายละเอียด"
                  className="p-1 ps-2 fs-6 w-100 form-control"
                  id="detail"
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  style={{
                    color: "#000",
                    width: "60%",
                    border: "1.5px solid #E7E7E7",
                    borderRadius: "5px",
                  }}
                  rows="3"
                />
              </div>
              <div className="my-2">
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
                      color: "#000000",
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
                                className="ps-3 d-flex flex-row align-items-center"
                                style={{
                                  borderRadius: "12px",
                                  paddingBottom: "4.5px",
                                  paddingTop: "4.5px",
                                  paddingRight: "17px",
                                  background: "#FFB600",
                                  color: "#fff",
                                }}
                              >
                                <span
                                  className="text-truncate m-0"
                                  style={{
                                    fontSize: ".75rem",
                                    fontWeight: "500",
                                    maxWidth: "120px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  # {tag}
                                </span>
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
                          initialTags={postData.tag}
                          typeOfTags={"library"}
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-4 d-flex flex-row gap-2 justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setFormData(defaultValue);
                    navigate(-1);
                  }}
                  style={{
                    background: "#E7E7E7",
                    width: "35%",
                    borderRadius: "10px",
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    color: "#ffffff",
                    background: "#F89603",
                    width: "65%",
                    borderRadius: "10px",
                  }}
                >
                  {status === "update" ? "บันทึก" : "สร้างหัวข้อ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryCreatePost;

// Dropdown Menu สียังไม่ตรง เพราะกุทำไม่เป็น
// หมายถึงเวลากด dropdown ลงมาแล้วเลือก อันที่เลือกต้องเป็นสีส้มๆ
