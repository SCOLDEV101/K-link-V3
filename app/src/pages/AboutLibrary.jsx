import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import config from "../constants/function";
import axios from "axios";
import "../index.css";
import { useInView } from 'react-intersection-observer';
import Header from "../components/Header";
import Footer from "../components/Footer";

function PageImage({ url, pageNumber, setCurrentPage }) {
  const { ref, inView } = useInView({
    threshold: 1, 
  });

  useEffect(() => {
    if (inView) {
      setCurrentPage(pageNumber);
    }
  }, [inView, pageNumber, setCurrentPage]);

  

  return (
    <div
      data-page-number={pageNumber}
      style={{ 
        marginBottom: "20px",
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", 
      }}
    >
      <img
        src={`${config.SERVER_PATH}${url}`}
        alt={`Page ${pageNumber}`}
        style={{ width: '100%' }} 
        ref={ref}
        data-page-number={pageNumber}
      />
    </div>
  );
}

function AboutLibrary() {
  const { id : groupID } = useParams();
  const headersCookie = config.Headers().headers;
  const [fetchdataloading, setFetchdataLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [FileData, setFileData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fetchdataloading) {
        setTimeoutReached(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [fetchdataloading]);

  useEffect(() => {
    fetchData();
  }, []);

  

  const fetchData = async () => {
    console.log(groupID);
    try {
      const response = await axios.get(
        `${config.SERVER_PATH}/api/library/aboutGroup/${groupID}`,
        {
          headers: headersCookie,
        }
      );
      console.log(response.data);
      if (response.data.status === "ok") {
        console.log("1");
        setFileData(response.data.data);
        setFetchdataLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setFetchdataLoading(false);
    }
  };

  return (
    <>
      {!timeoutReached ? (
        fetchdataloading ? (
          <div
            className="d-flex flex-row justify-content-center align-content-start pb-3"
            style={{ marginTop: "100px" }}
          >
            <l-tail-chase size="40" speed="1.75" color="rgb(255,133,0)"></l-tail-chase>
          </div>
        ) : FileData ? (
          <div>
            <div
              style={{ 
                position: "relative", 
                width: "75vw", 
                margin: "0 auto", 
                overflowY: "scroll", 
                height: "80vh", 
                marginTop: "100px", 
                marginBottom: "100px", 
                scrollbarWidth: "none"
              }}
            >
              {FileData.filepageurl.map((url, index) => (
                <PageImage
                  key={index}
                  url={url}
                  pageNumber={index + 1}
                  setCurrentPage={setCurrentPage}
                />
              ))}
            </div>
            <div
              className="px-3 py-1"
              style={{
                position: "fixed",
                top: "105px",
                right: "20px",
                backgroundColor: "rgba(217, 217, 217, 0.8)",
                color: "#79747E",
                borderRadius: "5px",
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                zIndex: 1050,
                fontSize:"14px"
              }}
            >
              {currentPage} จาก {FileData.totalpages}
            </div>
          </div>
        ) : (
          <div
            className="d-flex flex-row justify-content-center align-content-start pb-3 text-center"
            style={{ marginTop: "100px", color: "#D9D9D9" }}
          >
            ไม่พบข้อมูล
          </div>
        )
      ) : (
        <div
          className="d-flex flex-row justify-content-center align-content-start pb-3 text-center"
          style={{ marginTop: "100px", color: "#D9D9D9" }}
        >
          ไม่พบข้อมูล
        </div>
      )}

      
      {FileData && (
        <>
        <Header FileData={FileData} />
        <Footer FileData={FileData}/>
        
        </>
      )}
    </>
  );
}

export default AboutLibrary;
