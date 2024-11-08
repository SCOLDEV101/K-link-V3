import React, { useEffect, useState } from "react";
import { FilterTag } from "../components/FilterTag";
import List from "../components/List";
import axios from "axios";
import config from "../constants/function";
import { useInView } from "react-intersection-observer";

function MyPost() {
  const [listItem, setListItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [selectedCategoryVariables, setSelectedCategoryVariables] = useState([]);
  const headersCookie = config.Headers().headers;
  const itemsPerPage = 3;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, isLoading]);

  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${config.SERVER_PATH}/api/user/myPost?page=${page}&perPage=${itemsPerPage}`,
        { headers: headersCookie }
      );
      setIsLoading(false);
      if (response.data.status === "ok") {
        setListItem((prevList) => [...prevList, ...response.data.data]);
        console.log(response.data.data);
        if (response.data.data.length < itemsPerPage) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  const categories = [
    // { name: "Hobby", checkVariable: "isHobby" },
    // { name: "Library", checkVariable: "isLibrary" },
    // { name: "Tutoring", checkVariable: "isTutoring" },
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
        ? prevSelected.filter((checkVariable) => checkVariable !== variableCheck)
        : [...prevSelected, variableCheck]
    );
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
        className="position-relative"
        style={{
          overflowX:"hidden",
          overflowY: "scroll",
          maxWidth: "550px",
          width: "95vw",
        }}
      >
        {filteredLists.length > 0 ? (
          <List listItem={filteredLists} />
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
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <l-tail-chase size="40" speed="1.75" color="rgb(255,133,0)"></l-tail-chase>
          </div>
        )}
        <div ref={ref} style={{ height: "1px" }} />
      </div>
    </div>
  );
}

export default MyPost;
