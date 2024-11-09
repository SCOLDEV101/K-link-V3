import React from "react";
import { useLocation } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";



function AboutReport() {
  const location = useLocation();
  const { reportType } = location.state || {}; 

  return (
    <div className="container px-3 py-2" style={{ height: "100vh" }}>
      <ul
        className="list-unstyled d-grid gap-3 pb-3"
        style={{ position: "relative", top: "100px"}}
      >
         <li className="d-flex align-items-start flex-column border-none p-3 bg-white" 
        style={{
          borderRadius:"15px",
          boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
          }} 
          >
            <div className="row row-cols-lg-auto px-2 mt-2">
            <div className="col-2 m-auto">
            <IoWarningOutline style={{color:"#B3261E" , marginLeft:"0.2rem"}} className="fs-1 fw-bold"/>
            </div>

            <div className="col-10">
            {reportType === "user" ? <p className="fw-bold fs-2 my-0">คุณถูกรายงาน</p> 
             : reportType === "group" ? <p className="fw-bold fs-2 my-0">กลุ่มของคุณถูกรายงาน</p>
              : null  }
            </div>
            </div>
            {reportType === "user" ? (
  <p style={{ textIndent: "2em" }} className="my-3 text-wrap fs-6">
    คุณอาจทำพฤติกรรมที่ไม่สอดคล้องกับ{" "}
    <span className="text-decoration-underline fw-bold" style={{color: "#FF4800" }}>มาตรฐานชุมชน</span>
    {" "}ของเรา หากไม่เป็นความจริง คุณสามารถ ส่งคำขอร้องให้ตรวจสอบ
  </p>
) : reportType === "group" ? (
  <p style={{ textIndent: "2em" }} className="my-3 text-wrap fs-6">
    กลุ่มของท่านมีเนื้อหาที่อาจ ไม่สอดคล้องกับ{" "}
    <span className="text-decoration-underline fw-bold" style={{ color: "#FF4800" }}>มาตรฐานชุมชน</span>
    {" "}ของเรา หากไม่เป็นความจริง คุณสามารถ ส่งคำขอร้องให้ตรวจสอบ เราจะให้เจ้าหน้าที่ตรวจสอบกลุ่มนี้อีกครั้ง
  </p>
) : null}

         </li> 
      </ul>
    </div>
  );
}

export default AboutReport;

