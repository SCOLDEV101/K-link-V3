import React, { useEffect, useState } from "react";
import List from "../components/List";
import SearchButton from "../components/SearchButton";
import { IoAddCircle } from "react-icons/io5";
import axios from "axios";
import config from "../constants/function";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { useSearchList } from "../contextProivder/SearchListProvider";


function HomePage() {
  const { searchListsArray } = useSearchList(); // search context
  const [listItem, setListItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 3; //8
  const maxRetries = 1;


  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (searchListsArray.length === 0) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, loading]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.SERVER_PATH}/api/hobby/showAllGroup?page=${page}&perPage=${itemsPerPage}`,
        {
          headers: {
            ...config.Headers().headers,
          },
          withCredentials: true,
        }
      );
      if (response.data.status === "ok") {
        console.log("Fetched data:", response.data.listItem);
        if (page !== lastPage) {
          console.log("page !== lastPage");
          setListItem((prevList) => [...prevList, ...response.data.listItem]);
          setLastPage(page);
        } else {
          console.log("ELSE: page !== lastPage");
          setListItem(response.data.listItem);
        }
        if (response.data.listItem.length < itemsPerPage) {
          console.log("response.data.listItem.length < itemsPerPage");
          setHasMore(false);
        }
        console.log("ELSESESEES");
        setRetryCount(0);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setRetryCount((prevCount) => prevCount + 1);
      if (retryCount >= maxRetries - 1) {
        setHasMore(false);
        setError("");
      }
    }
  };

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
        className="w-75 m-auto p-2 my-2"
        style={{ position: "sticky", top: "0", zIndex: 1 }}
      >
        <SearchButton fromFeature={"hobby"} />
      </div>
      <div
        className="position-relative"
        style={{ overflow: "auto", overflowY: "scroll" , maxWidth:"500px" , width:"90vw"}}
      >
        {searchListsArray.length > 0 ? (
          <List listItem={searchListsArray} fetchData={fetchData} />
        ) : (
          <List listItem={listItem} fetchData={fetchData} />
        )}
        {loading && (
          <div className="d-flex flex-row justify-content-center align-content-start pb-3">
            <l-tail-chase
              size="40"
              speed="1.75"
              color="rgb(255,133,0)" 
            ></l-tail-chase>
          </div>
        )}
        {error && (
          <p style={{ textAlign: "center", marginTop: "10px", color: "red" }}>
            {error}
          </p>
        )}
        <div ref={ref} style={{ height: "1px" }} />
      </div>
      <div style={{ zIndex: 1 }}>
        <a href="/hobbycreategroup">
          <div
            style={{
              width: "10vw",
              height: "10vw",
              position: "fixed",
              right: "10%",
              bottom: "22%",
              borderRadius: "50%",
              backgroundColor: "#f6f6f6",
            }}
          ></div>

          <IoAddCircle
            style={{
              color: "#FFB600",
              width: "20vw",
              height: "20vw",
              position: "fixed",
              right: "5%",
              bottom: "20%",
              borderRadius: "50%",
              padding: "2%",
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default HomePage;
