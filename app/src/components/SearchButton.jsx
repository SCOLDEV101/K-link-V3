import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";


function SearchButton({ fromFeature }) {
  return (
    <div className="d-flex justify-content-center">
      <Link to={"/search"} state={{ feature: fromFeature }}
        className="w-100 btn border-0 m-auto"
        style={{
          borderRadius: "20px",
          backgroundColor: "#fff",
          fontSize: "1rem",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          maxWidth: "520px",
          textDecoration: "none",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="px-1">Search</div>
          <div className="px-1"><FaSearch /></div>
        </div>
      </Link>
    </div>
  );
}

export default SearchButton;
