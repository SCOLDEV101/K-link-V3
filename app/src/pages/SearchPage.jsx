import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { facultiesAndMajors } from "../constants/constants";
import axios from "axios";
import { useSearchList } from "../contextProivder/SearchListProvider";
import config from "../constants/function";

function SearchPage() {
  const { setSearchListsArray } = useSearchList();
  const location = useLocation();
  const { feature } = location.state || {};
  const [fetching, setFetching] = useState(false); // for waiting fetching 
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [randomFaculties, setRandomFaculties] = useState([]);
  const [randomMajors, setRandomMajors] = useState([]);
  const [isFalse, setIsFalse] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    const faculties = getRandomItems(facultiesAndMajors, 3);
    setRandomFaculties(faculties);
    let majors = [];
    faculties.forEach((faculty) => {
      const allMajors = faculty.majors;
      const selectedMajors = getRandomItems(allMajors, 2);
      majors = majors.concat(selectedMajors);
    });
    setRandomMajors(majors);
  }, []);

  const handleItemClick = (value) => {
    setInputValue(value);
  };

  const handleSearch = async () => {
    console.log("inputValue ::", inputValue, ":", feature);
    setFetching(true); // แสดงสถานะกำลังดึงข้อมูล
  
    try {
      const response = await axios.post(
        `${config.SERVER_PATH}/api/search/${feature}`,
        { keyword: inputValue },
        { headers: config.Headers().headers, withCredentials: true }
      );
  
      if (response.data.status === "ok") {
        console.log("res.data.listItem ::", response.data.listItem);
        setSearchListsArray(response.data.listItem); // ส่งผลลัพธ์การค้นหากลับ
        goBack();
      } else if (response.data.status === "failed") {
        console.log("Search has no results");
        setIsFalse(true);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setFetching(false); 
      setIsFalse(true);
    }
  };
  

  return (
    <>
      <div className="container-fluid pt-4 px-4">
        <div className="d-flex flex-row align-items-center gap-2 mb-4">
          <button
            onClick={goBack}
            className="d-flex justify-content-center align-items-center border-0 bg-transparent ps-0"
          >
            <FaArrowLeft
              style={{
                fontWeight: "bold",
                fontSize: "30px",
                color: "#D9D9D9",
                filter: "drop-shadow(3px 3px 1px rgba(0, 0, 0, .25))",
              }}
            />
          </button>
          <div
            className="d-flex flex-row align-items-center gap-2 rounded-pill px-3 py-2 w-100"
            style={{
              background: "#D9D9D9",
              boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              className="border-0 bg-transparent w-100"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsFalse(false);
              }}
              style={{
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <FaSearch
              style={{ fontWeight: "bold", fontSize: "24px" }}
              onClick={handleSearch}
            />
          </div>
        </div>
        {fetching && (
          <div className="d-flex justify-content-center align-items-center">
            <h5 className="text-secondary"> กำลังค้นหา... </h5>
          </div>
        )}
        {isFalse && (
          <div className="d-flex justify-content-center align-items-center">
            <h5 className="text-secondary">--- ไม่พบผลการค้นหา ---</h5>
          </div>
        )}
        {/* <div className="">
          <h2
            className="fw-bold"
            style={{
              color: "white",
              WebkitTextStrokeWidth: "1px",
              WebkitTextStrokeColor: "#D9D9D9",
            }}
          >
            คณะ
          </h2>
          <div className="d-flex flex-row flex-wrap justify-content-start gap-2 pt-2 mb-3">
            {randomFaculties.map((faculty, index) => (
              <div
                key={index}
                className="badge rounded-pill text-dark px-3 py-2"
                style={{
                  background: "#FFB600",
                  boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                  cursor: "pointer",
                }}
                onClick={() => handleItemClick(faculty.facultyName)}
              >
                {faculty.facultyName}
              </div>
            ))}
          </div>
          <h2
            className="fw-bold"
            style={{
              color: "white",
              WebkitTextStrokeWidth: "1px",
              WebkitTextStrokeColor: "#D9D9D9",
            }}
          >
            สาขา
          </h2>
          <div className="d-flex flex-row flex-wrap justify-content-start gap-2 pt-2">
            {randomMajors.map((major, index) => (
              <div
                key={index}
                className="badge rounded-pill text-dark px-3 py-2"
                style={{
                  background: "#FFB600",
                  boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                  cursor: "pointer",
                }}
                onClick={() => handleItemClick(major)}
              >
                {major}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}

function getRandomItems(array, numItems) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

export default SearchPage;
