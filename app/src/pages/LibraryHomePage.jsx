import React, { useState, useEffect, useRef } from "react";
import List from "../components/List";
import SearchButton from "../components/SearchButton";
import axios from "axios";
import config from "../constants/function";
import { useInView } from "react-intersection-observer";
import { TfiMenuAlt } from "react-icons/tfi";
import { GrClose } from "react-icons/gr";
import { GoBook } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSearchList } from "../contextProivder/SearchListProvider";

function LibraryHomePage() {
  const { searchListsArray } = useSearchList(); // search context
  const [listItem, setListItem] = useState([]);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const headersAuth = config.Headers().headers;
  const itemsPerPage = 3; //8
  const maxRetries = 1;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const modalRef = useRef(null);
  
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      await axios
        .get(
          config.SERVER_PATH +
            `/api/library/showAllLibrary?page=${page}&perPage=${itemsPerPage}`,
          { headers: headersAuth, withCredentials: true }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            console.log("res.data.status", res.data.data);
            
            setListItem((prevList) => [...prevList, ...res.data.data]);
            if (res.data.data.length < itemsPerPage) {
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
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
        className="w-75 m-auto p-2 my-2 bg-white"
        style={{ position: "sticky", top: "0", zIndex: 1 }}
      >
        <SearchButton fromFeature={"library"} />
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

      <div style={{ zIndex: 1 }} onClick={toggleModal}>
        <div
          style={{
            backgroundColor: "#FFB600",
            borderRadius: "50%",
            width: "20vw",
            height: "20vw",
            position: "fixed",
            right: "5%",
            bottom: "20%",
            padding: "2%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TfiMenuAlt
            style={{
              color: "#ffffff",
              width: "10vw",
              height: "10vw",
            }}
            onClick={toggleModal}
          />
        </div>
        {isModalVisible && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              zIndex: 2,
            }}
          >
            <div
              ref={modalRef}
              style={{
                position: "absolute",
                right: "0%",
                bottom: "18%",
                borderRadius: "10px",
                padding: "20px",
                marginTop:"10%"
              }}
            >
              <div
                className="d-flex justify-content-end align-items-center"
                style={{
                  backgroundColor: "#ffffff",
                  border: "0.5px solid black",
                  borderRadius: "100px",
                  width: "auto",
                  height: "20vw",
                  position: "relative",
                  boxShadow: "0px 5px 0px rgba(255, 182, 0, 1)",
                }}
                onClick={() => navigate("/librarycreatepost")}
              >
                <div className="d-flex justify-content-center align-items-center px-4">
                  {" "}
                  สร้างโพสต์{" "}
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    background: "#7CB518",
                    borderRadius: "50%",
                    width: "20vw",
                    height: "20vw",
                  }}
                >
                  <FaRegEdit
                    style={{
                      color: "#ffffff",
                      width: "10vw",
                      height: "10vw",
                      borderColor: "",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </div>

              <div
                className="d-flex justify-content-end align-items-center mt-3"
                style={{
                  backgroundColor: "#ffffff",
                  border: "0.5px solid black",
                  borderRadius: "100px",
                  width: "auto",
                  height: "20vw",
                  position: "relative",
                  boxShadow: "0px 5px 0px rgba(255, 182, 0, 1)",
                }}
                onClick={() => navigate("/tutoring")}
              >
                <div className="d-flex justify-content-center align-items-center px-3">
                  {" "}
                  กลุ่มติวหนังสือ{" "}
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    background: "#001B79",
                    borderRadius: "50%",
                    width: "20vw",
                    height: "20vw",
                  }}
                >
                  <GoBook
                    style={{
                      color: "#ffffff",
                      width: "10vw",
                      height: "10vw",
                      borderColor: "",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </div>

              <div
                className="d-flex justify-content-end align-items-center mt-3"
                style={{
                  backgroundColor: "#ffffff",
                  border: "0.5px solid black",
                  borderRadius: "100px",
                  width: "auto",
                  height: "20vw",
                  position: "relative",
                  boxShadow: "0px 5px 0px rgba(255, 182, 0, 1)",
                }}
                onClick={() => setIsModalVisible(false)}
              >
                <div className="d-flex justify-content-center align-items-center px-5">
                  {" "}
                  ปิด{" "}
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    background: "#FF0101",
                    borderRadius: "50%",
                    width: "20vw",
                    height: "20vw",
                  }}
                >
                  <GrClose
                    style={{
                      color: "#ffffff",
                      width: "10vw",
                      height: "10vw",
                      borderColor: "",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LibraryHomePage;
