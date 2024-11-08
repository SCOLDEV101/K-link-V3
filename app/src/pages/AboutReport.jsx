import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";



function AboutReport() {
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
            <div className="d-flex">
            <IoWarningOutline style={{color:"#B3261E"}} className="fs-1 fw-bold"/>
             <span className="fw-bold mx-2">ldogjoerihjhufihuwihffg
                gegjareoig9eajgogpfsdighuisdfhguisfdfg
                gie9ighidfghidfhidfhgihdfiughdighdi</span> 
            </div>
         <p style={{textIndent: "2em"}} className="my-3">ldogjoerihjwirojtoiwjpiwjgpehjpoerog
            fojdfijsdifjidsjfpsdjfisdfj
            kfosjgiohpojgdiohdiughiuhtegihfgiudshfgfgh
            ghiufdhgiudhgihiughfihgufdhgiuhghugighihgoijf8ehtyeiyitoijfiodj
            erigherihgierniinbiifogjoisfd</p> 
         </li> 
      </ul>
    </div>
  );
}

export default AboutReport;

