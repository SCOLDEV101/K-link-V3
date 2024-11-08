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
            <div className="row row-cols-lg-auto px-2 mt-2">
            <div className="col-2 m-auto">
            <IoWarningOutline style={{color:"#B3261E" , marginLeft:"0.2rem"}} className="fs-1 fw-bold"/>
            </div>

            <div className="col-10">
            <p className="fw-bold my-0">
                ldogjoerihjhufihuwihffg
                gegjareoig9eajgogpfsdighuisdfhgu
                isfdfg
                gie9ighidfghidfhidfhgihdfiughdighdi
            </p> 
            </div>
            </div>
         <p style={{textIndent: "2em"}} className="my-3 text-wrap">
            ldogjoerihjwirojtoiwjpiwjgpehjpoerog
            fojdfijsdifjidsjfpsdjfisdfj
            kfosjgiohpojgdiohdiughiuhtegihfgiudshfgfgh
            ghiufdhgiudhgihiughfihgufdhgiuhghugighihg้uk
            erigherihgierniinbiifogjoisfd
            </p> 
         </li> 
      </ul>
    </div>
  );
}

export default AboutReport;

