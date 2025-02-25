import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useProfileAccount } from "../contextProivder/ProfileAccoutProvider";
import config from "../constants/function";
import Swal from 'sweetalert2'


function EditMyAccount() {
  const { profileData } = useProfileAccount();
  const navigate = useNavigate();
  
  const [EditprofileData, setEditProfileData] = useState({
    profileImage: "",
    username: "",
    fullname: "",
    telephone: "",
    aboutMe: "",
  });

  const [originalProfileImage, setOriginalProfileImage] = useState(""); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("13");
      try {
        const res = await axios.get(config.SERVER_PATH + `/api/user/memberInfo/`, {
          headers: config.Headers().headers,
        });
        if (res.data.status === "ok") {
          setEditProfileData(res.data.data);
          setOriginalProfileImage(res.data.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("12");
    const hasChanged = !compareObjects(profileData, EditprofileData);
    setIsDataChanged(hasChanged);
  }, [EditprofileData, profileData]);

  const compareObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleImageChange = (e) => {
    console.log("11");
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileData({
          ...EditprofileData,
          profileImage: reader.result, 
        });
      };
      reader.readAsDataURL(file);
    }
  };


  
  const updateProfileData = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: "ต้องการบันทึกหรือไม่?",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: 'swal-container',
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button', 
        cancelButton: 'swal-confirmRed-button'    
      }
    });
  
    if (result.isConfirmed) {
      if (!isDataChanged && !selectedImage) {
        console.log("ไม่มีการเปลี่ยนแปลงข้อมูล");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("username", EditprofileData.username);
        formData.append("fullname", EditprofileData.fullname);
        formData.append("telephone", EditprofileData.telephone);
        formData.append("aboutMe", EditprofileData.aboutMe);
  
        if (selectedImage) {
          formData.append("image", selectedImage); 
        } else {
          formData.append("image", originalProfileImage); 
        }
        console.log("formData :",formData)
        const responseUpdateProfile = await axios.post(
          config.SERVER_PATH + "/api/user/updateAccount",
          formData,
          { headers: config.Headers().headers, withCredentials: true }
        );
        console.log("Update successful:", responseUpdateProfile.data);
        Swal.fire({
          position: "center",
          title: "แก้ไขโปรไฟล์สำเร็จ",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-success',
            container: 'swal-container',
            popup: 'swal-popup-success',
          }
        });
        navigate("/aboutmyaccount");
      } catch (error) {
        console.error("Update failed:", error);
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
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData({
      ...EditprofileData,
      [name]: value,
    });
  };

  const inputs = [
    { name: "username", label: "ชื่อเล่น", type: "text" },
    { name: "telephone", label: "เบอร์โทรศัพท์", type: "text" },
    { name: "aboutMe", label: "เกี่ยวกับฉัน", type: "textarea" },
  ];

  return (
  <div
  className="container-fluid p-0"
  style={{
    background: "linear-gradient(0deg, #F85B03, #F86A03, #F89603)",
    height: "100vh",
    margin: 0,
  }}
  >
    <div
      className="card pt-4 px-3 mx-4 mt-5"
      style={{
        top: "100px",
        maxHeight: "100vh",
        background: "#fff",
        borderRadius: "20px",
        zIndex: 15,
        boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
      }}
    >
      <form>
        <div className="d-flex justify-content-center align-items-center position-relative">
          <div
            className="rounded-circle border"
            style={{ width: "100px", height: "100px" }}
          >
          <img
            src={
              EditprofileData.profileImage &&
              EditprofileData.profileImage.startsWith("data:image/")
                ? EditprofileData.profileImage
                : EditprofileData.profileImage
                ? `${config.SERVER_PATH}/uploaded/profileImage/${EditprofileData.profileImage}`
                : "/Empty-Profile-Image.svg"
            }
            alt="profile"
            className="rounded-circle"
            style={{ width: "100px", height: "100px" , boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          />
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-profile-image"
            onChange={handleImageChange}
          />
          <label
            htmlFor="upload-profile-image"
            className="position-absolute d-flex justify-content-center align-items-center rounded-circle"
            style={{
              width: "45px",
              height: "45px",
              background: "#c2bebb",
              cursor: "pointer",
              bottom: 0,
              left: "52%",
            }}
          >
            <FaCamera className="fs-3" />
          </label>
        </div>

        {inputs.map((input, index) => (
          <div key={index} className="mb-2">
            {input.name !== "aboutMe" && (
      <label className="mb-1" style={{ fontSize: "0.8rem" }}>
        {input.label}
      </label>
    )}
            {input.type === "textarea" ? (
              <textarea
                className="form-control mt-4"
                placeholder="เกี่ยวกับฉัน"
                style={{backgroundColor: "#E7E7E7" , borderRadius:"10px"}}
                name={input.name}
                value={EditprofileData[input.name]}
                onChange={handleInputChange}
                rows="6"
              />
            ) : (
              <>
                <input
                  type={input.type}
                  className="form-control border-0 px-1 p-0 fs-4"
                  style={{
                    fontWeight: "600",
                    background:"#F6F6F6",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  name={input.name}
                  value={EditprofileData[input.name]}
                  onChange={handleInputChange}
                />
                <hr className="m-0" style={{ borderTop: "2px solid #000" }} />
              </>
            )}
          </div>
        ))}
        <div className="my-3">
        <button className='border-0 p-2 w-100'style={{borderRadius:"10px" , backgroundColor:"#FFB600" , marginTop:"10px" ,fontSize: "1rem" }}
        onClick={updateProfileData}
          >
            บันทึก
            <FiSave className="mx-2"/>
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default EditMyAccount;
