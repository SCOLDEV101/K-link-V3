import React, { useState, useEffect } from "react";
import { BiSolidCamera } from "react-icons/bi";
import { BsImageAlt } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { IoExitOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { RiUserForbidFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import config from "../constants/function"
import axios from 'axios';

function Option({ caseId, hID, type, bookmark, show }) {
  const headersAuth = config.Headers().headers;
  const [$bookmark, set$bookmark] = useState(false);
  const [ChangeCaseId, setChangeCaseId] = useState(caseId);
  const navigate = useNavigate();

  useEffect(() => {
    setChangeCaseId(caseId);
    set$bookmark(bookmark);
  }, [caseId, hID, type, bookmark]);


  const sendBookmark = async (hID) => {
    if (hID != '' && hID != null) {
      try {
        const response = await axios.post(config.SERVER_PATH + `/api/user/addOrDeleteBookmark/${hID}`, {}, { headers: headersAuth, withCredentials: true });
        if (response.data.status === "ok") {
          console.log("bookmark success")
        }
      } catch (error) {
        console.error('There was an error fetching the members!', error);
      }
    }
  };

  const handleReportProfile = () => {
    navigate('/report', { state: { caseID: 'reportProfile', hID: hID, type: type } });
  };

  const handleReportList = () => {
    navigate('/report', { state: { caseID: 'reportList', hID: hID, type: type } });

  };

  const handleBookMarkedClick = (HID) => {
    set$bookmark(!$bookmark);
    sendBookmark(HID);
  };

  const renderContent = () => {
    switch (ChangeCaseId) {
      case "EditPictureProfile":
        return (
          <div>
            <h4 className="offcanvas-title text-center fw-bold mb-3">
              เปลี่ยนรูปโปรไฟล์
            </h4>
            <div className="text-start fs-5 m-2">
              <BiSolidCamera className="mx-2 mb-1" />
              ถ่ายภาพ
            </div>
            <div className="text-start fs-5 m-2">
              <BsImageAlt className="mx-2 mb-1" />
              เลือกรูปจากคลังภาพ
            </div>
          </div>
        );

      case "ListOption":
        return (
          <div className="mt-4">
            <div
              className="text-start fs-5 m-2"
              onClick={() => handleBookMarkedClick(hID)}
            >
              {$bookmark ? (
                <>
                  <MdOutlineBookmark
                    className="mx-2 mb-1 fs-2"
                    style={{ color: "#FFB600" }}
                  />
                  บันทึกแล้ว
                </>
              ) : (
                <>
                  <MdOutlineBookmarkBorder className="mx-2 mb-1 fs-2" />
                  บันทึก
                </>
              )}
            </div>
            <div
              className="text-start fs-5 m-2"
              style={{ color: "#FF0101" }}
              onClick={handleReportList}
            >
              <TbMessageReport className="mx-2 mb-1 fs-2" />
              รายงาน
            </div>
          </div>
        );

      case "OptionAboutListUser":
        return (
          <div className="mt-3">
            <div className="text-start fs-5 m-2">
              <IoMdShareAlt className="mx-2 mb-1 fs-2" />
              แชร์กลุ่ม
            </div>
            <div className="text-start fs-5 m-2" style={{ color: "#FF0101" }}>
              <IoExitOutline className="mx-2 mb-1 fs-2" />
              ออกจากกลุ่ม
            </div>
          </div>
        );


      case "OptionAboutListAdmin":
        return (
          <div className="mt-3">
            <div className="text-start fs-5 m-2">
              <IoMdShareAlt className="mx-2 mb-1 fs-2" />
              แชร์กลุ่ม
            </div>
            <div className="text-start fs-5 m-2">
              <VscSettings className="mx-2 mb-1 fs-2" />
              ตั้งค่ากลุ่ม
            </div>
          </div>
        );


      case "OptionMemberAdmin":
        return (
          <div className="mt-4">
            <div className="text-start fs-5 m-2">
              <RiUserForbidFill className="mx-2 mb-1 fs-2" />
              ไล่ออกจากกลุ่ม
            </div>
            <div

              className="text-start fs-5 m-2"
              style={{ color: "#FF0101" }}
              onClick={handleReportProfile}
            >
              <TbMessageReport className="mx-2 mb-1 fs-2" />
              รายงาน
            </div>
          </div>
        );


      case "OptionMemberUser":
        return (
          <div className="mt-4">
            <div
              className="text-start fs-5 m-2"
              style={{ color: "#FF0101" }}
              onClick={handleReportProfile}
            >
              <TbMessageReport className="mx-2 mb-1 fs-2" />
              รายงาน
            </div>
          </div>
        );


      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <>
      {show && <img
        src="./dot.png"
        alt="option"
        style={{ cursor: "pointer" }}
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      />
      }
      <div
        className="mx-3 offcanvas offcanvas-bottom"
        tabIndex="-1"
        data-bs-scroll="true"
        id="offcanvasWithBothOptions"
        style={{
          borderRadius: "20px 20px 0px 0px",
          height: "50vh",
          backgroundColor: "#fff",
        }}
      >
        <div className="offcanvas-body">
          <div className="d-flex justify-content-center">
            <div
              className="w-25 mb-2"
              style={{
                borderBottom: "1.5vw solid #FFB600",
                borderRadius: "1vw",
              }}
            ></div>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default Option;
