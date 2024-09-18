import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import config from "../constants/function";
import axios from "axios";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutLibrary() {
  const { id: hID } = useParams();
  // const { id: hID } = location.state || {};
  const headersCookie = config.Headers().headers;
  const [fetchdataloading, setFetchdataLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [FileData, setFileData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef(null);
  const pagesRef = useRef([]);

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

  useEffect(() => {
    if (pagesRef.current.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        const visiblePages = entries.filter(entry => entry.isIntersecting);
        if (visiblePages.length > 0) {
          const visiblePageNumber = parseInt(visiblePages[0].target.dataset.pageNumber, 10);
          setCurrentPage(visiblePageNumber);
        }
      }, { threshold: 1 });
  
      pagesRef.current.forEach(page => {
        if (page) observer.observe(page); // Only observe if page is not null
      });
  
      return () => {
        pagesRef.current.forEach(page => {
          if (page) observer.unobserve(page); // Ensure the element exists before unobserving
        });
      };
    }
  }, [numPages]);
  

  const fetchData = async () => {
    console.log(hID);
    try {
      const response = await axios.get(
        `${config.SERVER_PATH}/api/library/aboutLibrary/${hID}`,
        {
          headers: headersCookie,
        }
      );
      console.log(response.data);
      if (response.data.status === "ok") {
        console.log("1");
        setFileData(response.data.data);
        console.log(response.data.data);
        setFetchdataLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setFetchdataLoading(false);
    }
    
    // Mock data for testing
    // const mockData = {
    //   subject: "Sample Subject",
    //   filename: "sample.pdf",
    //   owner: "John Doe",
    //   uploadDate: "2024-09-08",
    //   filesizeInBytes: 123456,
    //   file: "/65010051 Lab 10.pdf", // Provide a path if you have a local file to render with react-pdf
    // };

    // setFileData(mockData);
    // setFetchdataLoading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Header FileData={FileData} />
      <Footer FileData={FileData} />
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
              style={{ position: "relative", width: "75vw", margin: "0 auto", overflowY: "scroll", height: "80vh", marginTop: "100px" ,marginBottom:"100px" , scrollbarWidth:"none"}}
              ref={containerRef}
            >
              <Document className="my-2"
                file={FileData.filepageurl}
                onLoadSuccess={onDocumentLoadSuccess}
                
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div
                    key={index + 1}
                    data-page-number={index + 1}
                    ref={(el) => pagesRef.current[index] = el}
                    style={{ marginBottom: "20px",
                    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", 
                    }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={window.innerWidth * 0.75}
                    />
                  </div>
                ))}
              </Document>
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
              {currentPage} จาก {numPages}
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
    </>
  );
}

export default AboutLibrary;




 // Comment out the API call and use mock data instead
    // try {
    //   const response = await axios.get(
    //     `${config.SERVER_PATH}/api/library/aboutLibrary/${hID}`,
    //     {
    //       headers: headersCookie,
    //     }
    //   );

    //   if (response.data.status === "ok") {
    //     setFileData(response.data.data);
    //     setFetchdataLoading(false);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data: ", error);
    //   setFetchdataLoading(false);
    // }