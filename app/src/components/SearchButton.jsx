import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";


function SearchButton({ fromFeature }) {
  return (
    <div >
      <Link to={"/search"} state={{ feature: fromFeature }}
      >
        <div  className="btn w-100 px-3 py-1 text-start"
        style={{
          borderRadius: "26px",
          backgroundColor: "#E7E7E7",
        }}>Search...</div>
          <div className="px-3 py-1" style={{border:"10px solid #ffffff" , borderRadius:'26px',position:"absolute", top:"10%",right:"0",background: "linear-gradient(to right, #F96E20 2%, #FBBF66 49%, #F89603 100%)"
}}><FaSearch className="text-white" style={{marginBottom:"0.1rem"}}/></div>
      </Link>
    </div>
  );
}

export default SearchButton;
