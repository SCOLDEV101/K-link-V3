import React, { useEffect, useState } from "react";

export function ButtonWithAlert({ btnTitle, btnFunction, dataContent }) {
  return (
    <>
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalCenter"
        style={{ background: "#FFB600" }}
      >
        {btnTitle}
      </button>
      <RecheckModal modalDataContent={dataContent} modalFunc={btnFunction} />
    </>
  );
}

function RecheckModal({ modalDataContent, modalFunc }) {
  const [showModal, setShowModal] = useState(false);

  const handleHide = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered m-auto"
          style={{ maxWidth: "280px" }}
        >
          <div
            className="modal-content pb-3 border-3 border-dark"
            style={{
              borderRadius: "15px 15px 30px 30px", // tl tr bl br
            }}
          >
            <div
              className="modal-header p-0 bg-warning"
              style={{
                width: "100%",
                height: "9px",
                borderRadius: "15px 15px 0 0",
                border: "3px solid #000",
                borderTop: "0px",
              }}
            ></div>
            <div className="modal-body d-flex flex-column justify-content-center align-items-center pt-1 px-4">
              {modalDataContent !== undefined && modalDataContent} {/* ใส่ content มาเป็น html ได้เลย */}
            </div>
            <div className="d-flex flex-row gap-3">
              <button
                onClick={() => {
                  modalFunc !== undefined && modalFunc(); {/* function ที่จะให้ทำเมื่อกดปุ่มใน modal */}
                  setShowModal(true);
                }}
                type="button"
                data-bs-dismiss="modal"
                className="btn w-100 ms-3"
                style={{ background: "#FFB600" }}
              >
                ตกลง
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn w-100 me-3"
                style={{ background: "#D9D9D9" }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
      <Alert dataSet={0} showModal={showModal} onHide={handleHide} />
    </>
  );
}

export function AlertTryAgain() {
  return (
    <>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered m-auto"
          style={{ maxWidth: "280px" }}
        >
          <div
            className="modal-content pb-3 border-3 border-dark"
            style={{
              borderRadius: "15px 15px 30px 30px", // tl tr bl br
            }}
          >
            <div
              className="modal-header p-0 bg-warning"
              style={{
                width: "100%",
                height: "9px",
                borderRadius: "15px 15px 0 0",
                border: "3px solid #000",
                borderTop: "0px",
              }}
            ></div>
            <div className="modal-body d-flex flex-column justify-content-center align-items-center pt-1">
              <h3 className="m-0">การเชื่อมต่อมีปัญหา</h3>
              <h3 className="m-0" style={{ color: "#FFB600" }}>
                !! โปรดลองอีกครั้ง !!
              </h3>
            </div>
            <div className="d-flex flex-row gap-3">
              <button
                type="button"
                className="btn w-100 ms-3"
                style={{ background: "#FFB600" }}
              >
                ลองอีกครั้ง
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn w-100 me-3"
                style={{ background: "#D9D9D9" }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Alert({ dataSet, showModal, onHide }) {
  const alertDataSet = [
    {
      title: "เกิดข้อผิดพลาด",
      style: {
        background: "#FF0101",
      },
    },
    {
      title: "ส่งคำขอเข้ากลุ่มแล้ว",
      style: {
        background: "#7CB518",
      },
    },
    {
      title: "สร้างกลุ่มสำเร็จ",
      style: {
        background: "#7CB518",
      },
    },
    {
      title: "สร้างโพสสำเร็จ",
      style: {
        background: "#7CB518",
      },
    },
    {
      title: "ออกจากกลุ่มแล้ว",
      style: {
        background: "#FF0101",
      },
    },
    {
      title: "ลบกลุ่มสำเร็จ",
      style: {
        background: "#FF0101",
      },
    },
    {
      title: "ไล่ออกแล้ว",
      style: {
        background: "#FF0101",
      },
    },
    {
      title: "ลบโพสสำเร็จ",
      style: {
        background: "#FF0101",
      },
    },
    {
      title: "การรายงานเสร็จสิ้น",
      style: {
        background: "#FF0101",
      },
    },
  ];

  useEffect(() => { // ทำ toggle ค่า true/false ไว้แล้ว จะได้กดได้หลายๆรอบต่อการโหลดเว็ปหน้าเดียว จะได้ไม่ต้องรี browser ใหม่
    if (showModal) {
      const modalElement = document.getElementById("alertModal");
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();

      const timer = setTimeout(() => {
        modal.hide();
        if (onHide) onHide();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showModal, onHide]);

  return (
    <div
      className="modal fade bd-example-modal-sm"
      id="alertModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="smallModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-sm mx-auto fixed-bottom"
        style={{ maxWidth: "180px", marginBottom: "120px", }}
      >
        <div className="modal-content" style={{...alertDataSet[dataSet].style, borderRadius: "20px",}}>
          <div className="modal-body d-flex flex-column justify-content-center align-items-center px-2 py-3 fw-bold fs-6 text-white">
            {dataSet !== undefined && alertDataSet[dataSet] // ใส่ content มาเป็น text ได้เลย
              ? alertDataSet[dataSet].title
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
