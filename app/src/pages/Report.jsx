import React, { useEffect, useState } from "react";
import { GrFormNext } from "react-icons/gr";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../constants/function";
import axios from 'axios';
import Swal from 'sweetalert2'
import "../index.css";

const ReportList = [
  "Spam",
  "อนาจาร",
  "ความรุนแรง",
  "การล่วงละเมิด",
  "การก่อการร้าย",
  "คำพูดแสดงความเกียจชัง",
  "เกี่ยวกับเด็ก",
  "การฆ่าตัวตาย",
  "ข้อมูลเท็จ",
  "อื่นๆ",
];

const ReportProfile = [
  "สวมรอยเป็นบุคคลอื่น",
  "บัญชีปลอม",
  "ชื่อปลอม",
  "การโพสต์สิ่งที่ไม่เหมาะสม",
  "การคุกคามการกลั่นแกล้ง",
  "อื่นๆ",
];

function Report() {
  const headersAuth = config.Headers().headers;
  const location = useLocation();
  const navigate = useNavigate();
  const { caseID, hID, uID, type } = location.state || {};
  const [id, setId] = useState(hID || uID || '');
  const [changeCaseId, setChangeCaseId] = useState(caseID);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState('');
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 10000); 

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    setId(hID || uID || '');
  }, [hID, uID]);

  const sendReport = async (id) => {
    if (reportDetail === '') {
      Swal.fire({
        position: "center",
        title: "กรุณากรอกรายละเอียดเพิ่มเติม",
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
      title: "ยืนยันการรายงานหรือไม่?",
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
      const response = await axios.post(config.SERVER_PATH + `/api/user/report/`, {
        title: selectedReport,
        detail: reportDetail,
        type: type,
        id: id.toString()
      }, { headers: headersAuth, withCredentials: true });

      if (response.data.status === "ok") {
        console.log("send report success" , selectedReport , reportDetail);
        Swal.fire({
          position: "center",
          title: "การรายงานสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            title: 'swal-title-success',
            container: 'swal-container',
            popup: 'swal-popup-report',
          }
        });
        navigate(-1);
      }
    } catch (error) {
      console.error('There was an error fetching the members!', error);
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

  const handleSelectReport = (report, caseId) => {
    setSelectedReport(report);
    setChangeCaseId(caseId);
  };


  const renderReportList = (list, caseId) => (
    <div className="mt-3">
      <div className="fs-6 my-2 mx-4 fw-bold">
        <h3 className="fw-bold mt-5 mb-2">ระบุหัวข้อการายงาน</h3>
        {list.map((report, index) => (
          <div key={index} onClick={() => handleSelectReport(report, caseId)}>
            <div className="d-flex justify-content-between align-items-center">
              {report}
              <GrFormNext className="text-warning" />
            </div>
            <hr className="m-1" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportDetails = (caseId, cancelCaseId) => (
    <div className="mt-2">
      <div className="mx-4">
      <h4 className="fw-bold mt-4 mb-2">ยืนยันการรายงาน</h4>
      <textarea
        rows={4}
        className="mt-3 px-2 w-100"
        style={{ borderRadius: "10px"}}
        placeholder="รายละเอียดเพิ่มเติม..."
        value={reportDetail}
        onChange={(e) => setReportDetail(e.target.value)}
      ></textarea>
      <button className="btn btn-warning mt-2 mx-auto w-100" onClick={() => sendReport(id)}>
        ยืนยัน
      </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (changeCaseId) {
      case "reportList":
        return renderReportList(ReportList, "reportListDetails");
      case "reportListDetails":
        return renderReportDetails("reportListDetails", "reportList");
      case "reportProfile":
        return renderReportList(ReportProfile, "reportProfileDetails");
      case "reportProfileDetails":
        return renderReportDetails("reportProfileDetails", "reportProfile");
        default:
          if (isTimeout) {
            return <div>เกิดข้อผิดพลาด</div>;
          }
          return (
            <div>
              <l-tail-chase size="40" speed="1.75" color="rgb(255,133,0)"></l-tail-chase>
            </div>
          );
      }
    };

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        height: "calc(100vh - 180px)",
        marginTop: "90px",
        overflow: "hidden",
        fontSize: "3.5vw",
      }}
    >
      <div
        className="w-100"
        style={{
          height: "100%",
          paddingRight: "10px",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default Report;
