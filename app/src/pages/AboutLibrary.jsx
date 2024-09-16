import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import config from "../constants/function";
import axios from "axios";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../index.css";
import Header from "../components/Header";

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

      pagesRef.current.forEach(page => observer.observe(page));

      return () => {
        pagesRef.current.forEach(page => observer.unobserve(page));
      };
    }
  }, [numPages]);

  const fetchData = async () => {
    console.log(hID);
    
    // Mock data for testing
    const mockData = {
      subject: "Sample Subject",
      filename: "sample.pdf",
      owner: "John Doe",
      uploadDate: "2024-09-08",
      filesizeInBytes: 123456,
      file: "./65010051 Lab 10.pdf", // Provide a path if you have a local file to render with react-pdf
    };

    setFileData(mockData);
    setFetchdataLoading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Header FileData={FileData} />
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
              style={{ position: "relative", width: "75vw", margin: "0 auto", overflowY: "scroll", height: "80vh", marginTop: "100px" }}
              ref={containerRef}
            >
              <Document className="my-2 bg-dark"
                file={FileData.file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div
                    key={index + 1}
                    data-page-number={index + 1}
                    ref={(el) => pagesRef.current[index] = el}
                    style={{ marginBottom: "20px" }}
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
              style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                backgroundColor: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                zIndex: "1050"
              }}
            >
              Page {currentPage} of {numPages}
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