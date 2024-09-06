import React, { useEffect, useState } from "react";
import { FilterTag } from "../components/FilterTag";
import List from "../components/List";
import axios from "axios";
import config from "../constants/function";

function MyPost() {
  const [listItem, setlistItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headersCookie = config.Headers().headers;

  useEffect(() => {
    fetchData();
    
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.SERVER_PATH + `/api/user/myPos`, { headers: headersCookie })
        .then((res) => {
          setIsLoading(false); 
          if (res.data.status === "ok") {
            console.log("myPost res :", res.data.data);
            setlistItem(res.data.data);
          } else if (res.data.status === "failed") {
            console.log("not found");
            setlistItem([]);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          throw err.response.data;
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [selectedCategoryVariables, setSelectedCategoryVariables] = useState([]);

  const categories = [
    { name: "Hobby", checkVariable: "isHobby" },
    { name: "Library", checkVariable: "isLibrary" },
    { name: "Tutoring", checkVariable: "isTutoring" },
    { name: "กลุ่มที่เข้าร่วมแล้ว", checkVariable: "isMember" },
    { name: "กลุ่มที่รอการตอบรับ", checkVariable: "isRequest" },
    { name: "โพสต์ของฉัน", checkVariable: "isCreator" },
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
    ? listItem.filter((list) =>
        selectedCategoryVariables.some((category) => list.FilterTag[category])
      )
    : listItem;

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
        className="mx-auto px-4 position-relative"
        style={{ overflowY: "auto", width: "100%" }}
      >
        {isLoading ? (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems:"center",
      height: "50vh",
    }}
  >
    <l-tail-chase size="40" speed="1.75" color="rgb(255,133,0)"></l-tail-chase>
  </div>
        ) : filteredLists.length > 0 ? (
          <List listItem={filteredLists} />
        ) : (
          <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems:"center",
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

export default MyPost;
