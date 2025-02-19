import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

function AddTag({ FunctionToSave, btnHTML, initialTags }) {
  const [tags, setTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([
    "Tag1", "Tag2", "Tag3", "Tag4", "Tag5"
  ]);
  const inputRef = useRef(null);

  const EditTags = initialTags ? initialTags : "";

  useEffect(() => {
    if (EditTags !== "") {
      const tagsArray = EditTags.map((tag) => tag.trim());
      setTags(tagsArray);
    }
  }, [EditTags]);

  const handleAddTag = () => {
    if (tags.length < 10) {
      const inputValue = inputRef.current.value.trim();
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
        inputRef.current.value = "";
      }
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
  };

  const handleSaveTags = () => {
    if (FunctionToSave !== undefined) {
      FunctionToSave(tags);
    }
  };

  const handleSelectSuggestedTag = (tag) => {
    if (tags.length < 10 && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <>
      {btnHTML ? (
        btnHTML
      ) : (
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#addTagOffcanvas"
          aria-controls="addTagOffcanvas"
        >
          Toggle Add Tag Offcanvas
        </button>
      )}

      <div
        className="offcanvas offcanvas-bottom mx-2"
        style={{
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          height: "75%",
        }}
        tabIndex="-1"
        id="addTagOffcanvas"
        aria-labelledby="addTagOffcanvasLabel"
      >
        <div
          className="position-absolute"
          style={{
            background: "#D9D9D9",
            borderRadius: "50%",
            right: "-5px",
            top: "-15px",
            zIndex:"1"
          }}
        >
          <IoClose
            style={{
              right: "20px",
              color: "#FFB600",
              fontSize: "40px",
            }}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body" style={{
          scrollbarWidth: "50px",
          scrollbarColor: "#FFA500 #F0F0F0", 
          overflowY: "auto",
          }}>
          <div className="mb-1">
            <label style={{ fontSize: "0.65rem" }}>
              <span style={{ color: "red" }}>*</span>คุณสามารถใส่แท็กได้ไม่เกิน
              10 แท็ก
            </label>
            <div
              className={`d-flex flex-row gap-2 border border-2 rounded-3 p-1 align-items-center ${
                tags.length < 10 ? "border-dark" : "border-secondary"
              }`}
            >
              <input
                type="text"
                className={`form-control border-0 ${
                  tags.length >= 10 ? "text-muted" : ""
                }`}
                placeholder={
                  tags.length >= 10 ? "ไม่สามารถเพิ่มแท็กได้" : "Add tag ..."
                }
                ref={inputRef}
                disabled={tags.length >= 10}
              />
              <button
                className="btn text-nowrap py-0 px-1 fw-medium text-center d-flex align-items-center"
                style={{ background: "#FFB600", height: "35px" }}
                onClick={handleAddTag}
                disabled={tags.length >= 10}
                type="button"
              >
                <FaPlus className="me-1 text-white fs-3" />
                เพิ่มแท็กนี้
              </button>
            </div>
          </div>
          <h6>
            เลือกแท็กแล้ว{" "}
            <span
              className={`${tags.length < 10 ? "text-muted" : "text-danger"}`}
            >
              {tags.length}/10 แท็ก
            </span>
          </h6>
          <div
            className="d-flex flex-row flex-wrap gap-2 mt-2 pt-2"
            style={{ maxHeight: "250px", overflowY: "auto" }}
          >
            {tags.map((tag, index) => (
              <div className="position-relative" key={index}>
                <div
                  className="badge rounded-pill text-dark px-3 py-2 text-truncate"
                  style={{
                    background: "#FFB600",
                    boxShadow: "3px 3px 2px rgba(0, 0, 0, .25)",
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tag}
                </div>
                <IoClose
                  className="position-absolute"
                  style={{
                    top: "-5px",
                    right: "-5px",
                    color: "#FFB600",
                    background: "#D9D9D9",
                    borderRadius: "50%",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveTag(index)}
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <h6>แท็กแนะนำ:</h6>
            <div className="d-flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => (
                <button
                  key={index}
                  className="btn btn-outline-warning rounded-pill px-3 py-1"
                  onClick={() => handleSelectSuggestedTag(tag)}
                  disabled={tags.length >= 10 || tags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center mt-3">
            <button
              className="btn rounded-pill px-4 py-1 fw-medium"
              data-bs-toggle="offcanvas"
              data-bs-target="#addTagOffcanvas"
              aria-controls="addTagOffcanvas"
              style={{ background: "#FFFF", border: "3px solid #FFB600" }}
              onClick={handleSaveTags}
              type="button"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTag;
