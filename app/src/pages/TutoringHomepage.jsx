import React, { useEffect, useState } from "react";
import List from "../components/List";
import SearchButton from "../components/SearchButton";
import { IoAddCircle } from "react-icons/io5";
import axios from "axios";
import config from "../constants/function";
import { useInView } from "react-intersection-observer";
import { useSearchList } from "../contextProivder/SearchListProvider";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";


function TutoringHomepage() {
  const { searchListsArray } = useSearchList(); // search context
  const [listItem, setListItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const headersAuth = config.Headers().headers;
  const itemsPerPage = 3; //10
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
      await axios
        .get(
          config.SERVER_PATH +
            `/api/tutoring/showAllGroup?page=${page}&perPage=${itemsPerPage}`,
          { headers: headersAuth, withCredentials: true }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            console.log("res.data.data", res.data.listItem);
            setListItem((prevList) => [...prevList, ...res.data.listItem]);
            if (res.data.listItem.length < itemsPerPage) {
              setHasMore(false);
            }
            setRetryCount(0);
            setError(null);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
      <div className="card p-3 border-0 mx-3 w-100 " style={{borderRadius:"0",borderBottomRightRadius: "15px" ,borderBottomLeftRadius:"15px", boxShadow: "0px 0px px rgba(0, 0, 0, 0.25)", }}>
        <SearchButton fromFeature={"tutoring"} />
      </div>
      <div
        className="position-relative"
        style={{ overflow: "auto", overflowY: "scroll" , maxWidth:"550px" , width:"95vw"}}
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
      <div
        className="position-fixed"
        style={{
          bottom: "15%",
          right: "5%",
          backgroundColor: "#FFB600",
          borderRadius: "50%",
        }}
      >
        <Link
          to="/librarycreatepost"
          className="btn fw-bold position-relative"
          style={{
            boxShadow: "0px 4px 13px rgba(0, 0, 0, .20)",
            borderRadius: "50%",
            padding: "0.75rem",
          }}
        >
          <FaPlus className="text-white fs-1" />
        </Link>
      </div>
    </div>
  );
}

export default TutoringHomepage;
