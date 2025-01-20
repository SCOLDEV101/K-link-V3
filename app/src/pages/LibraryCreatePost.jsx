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
    // const _newFormData_ = { ..._FormData_, tag: tags.join(", "), files: [file] };
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
        const result = await Swal.fire({
          title: "ยืนยันการแก้ไขหรือไม่?",
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
      }
      } else {
        console.log("11");
        const result = await Swal.fire({
          title: "ยืนยันการสร้างโพสหรือไม่?",
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteGroup = async (hID) => {
    alert("Are you sure you want to delete");
    try {
      await axios
        .delete(config.SERVER_PATH + "/api/library/delete/" + hID, {
          headers: config.Headers().headers,
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            console.log("Delete tutoring group success");
            navigate("/tutoring");
          } else {
            alert("Something went wrong: โปรดลองอีกครั้ง");
          }
        });
    } catch (error) {
      console.error("ERROR: ", error);
      alert("error 500: SERVER ERROR");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(0deg, #F85B03, #F86A03, #F89603)",
        overflow: "hidden",
      }}
    >
      <div
        className="w-100"
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          className="card m-4"
          style={{
            position: "relative",
            top: "100px",
            border: "2px solid #d9d9d9",
            borderRadius: "20px",
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
                  ชื่อวิชา <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="activityName"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  placeholder="ชื่อวิชา หรือ โพสต์"
                  required
                />
              </div>
              {postData.flies && <div className="">ไฟล์เก่า</div>}
              <div className="form-group mt-2">
                <label htmlFor="file" style={{ fontSize: ".8rem" }}>
                  {postData.flies
                    ? "อัปโหลดไฟล์ใหม่ (เฉพาะ PDF)"
                    : "อัปโหลดไฟล์ (เฉพาะ PDF)"}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  accept="application/pdf"
                  required
                />
              </div>
              <div className="form-group mt-2 mx-2">
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
                      .find(
                        (faculty) => faculty.facultyID === formData.facultyID
                      )
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
                          className="text-center"
                        >
                          {section.sectionName}
                        </option>
                      ))}
                </select>
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
                          initialTags={postData.tag}
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-3 d-flex flex-row gap-3 justify-content-center align-items-center">
                <button
                  type="submit"
                  className="btn"
                  style={{ background: "#FFB600", width: "100%" }}
                >
                  {status === "update" ? "บันทึก" : "สร้าง"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setFormData(defaultValue);
                    navigate(-1);
                  }}
                  style={{ background: "#D9D9D9", width: "100%" }}
                >
                  ยกเลิก
                </button>
              </div>
              {status === "update" && (
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
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryCreatePost;
