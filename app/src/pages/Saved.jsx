import React, { useEffect, useState } from "react";
import { FilterTag } from "../components/FilterTag";
import List from "../components/List";
import axios from "axios";
import config from "../constants/function";

function Saved() {
  const [bookmark_List, setBookmark_List] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookMarkLists();

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(loadingTimeout);
  }, []);


  const fetchBookMarkLists = async () => {
    try {
      const bookMarkLists = await axios.get(
        config.SERVER_PATH + "/api/user/viewBookmark",
        { headers: config.Headers().headers, withCredentials: true }
      );
      console.log(bookMarkLists.data.data);
      if (bookMarkLists.data.status === "ok") {
        setIsLoading(false);
        setBookmark_List(bookMarkLists.data.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching :", error);
    }
  };

  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [selectedCategoryVariables, setSelectedCategoryVariables] = useState(
    []
  );
  const categories = [
    { name: "Hobby", checkVariable: "isHobby" },
    { name: "Library", checkVariable: "isLibrary" },
    { name: "Tutoring", checkVariable: "isTutoring" },
    { name: "กลุ่มที่เข้าร่วมแล้ว", checkVariable: "isMember" },
    { name: "กลุ่มที่รอการตอบรับ", checkVariable: "isRequest" },
    { name: "โพสต์ของฉัน", checkVariable: "isLeader" },
  ];

  const toggleCategoryName = (name, variableCheck) => {
    setSelectedCategoryNames((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((categoryName) => categoryName !== name)
        : [...prevSelected, name]
    );
    setSelectedCategoryVariables((prevSelected) =>
      prevSelected.includes(variableCheck)
        ? prevSelected.filter(
            (checkVariable) => checkVariable !== variableCheck
          )
        : [...prevSelected, variableCheck]
    );
    console.log("log[" + selectedCategoryNames + "]");
    console.log("log[" + selectedCategoryVariables + "]");
  };

  const filteredLists = selectedCategoryVariables.length
    ? bookmark_List.filter((list) =>
        selectedCategoryVariables.some((category) => list.FilterTag[category])
      )
    : bookmark_List;

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        height: "calc(100vh - 180px)",
        marginTop: "90px",
        overflow: "hidden",
      }}
    >
      <div
        className="w-100 py-1 px-0 bg-white"
        style={{ position: "sticky", top: "0", zIndex: 3 }}
      >
        <FilterTag
          selectedCategoryNames={selectedCategoryNames}
          toggleCategoryName={toggleCategoryName}
          categories={categories}
        />
      </div>
      <div
        className="position-relative"
        style={{
          overflow: "auto",
          overflowY: "scroll",
          maxWidth: "550px",
          width: "95vw",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <l-tail-chase
              size="40"
              speed="1.75"
              color="rgb(255,133,0)"
            ></l-tail-chase>
          </div>
        ) : bookmark_List.length > 0 ?  (
        <List listItem={filteredLists} fetchData={null} /> 
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: "#D9D9D9",
          }}
        >
          ไม่มีโพสต์
        </div>
      )}
      </div>
    </div>
  );
}

export default Saved;
