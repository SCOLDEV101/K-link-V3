import React, { useState, useRef, useEffect } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import config from "../constants/function";

function AddTag({
  FunctionToSave,
  btnHTML,
  initialTags,
  typeOfTags,
}) {
  const headersAuth = config.Headers().headers;
  const [tags, setTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState(["Tag1", "Tag2", "Tag3"]);
  const inputRef = useRef(null);

  const EditTags = initialTags ? initialTags : "";
  const [searchParam, setSearchParam] = useState("");
  const [offcanvasToggle, setOffcanvasToggle] = useState(false)

  useEffect(() => {
    if (typeof EditTags !== "string") {
      setTags(initialTags);
    } else if (EditTags && EditTags.trim() !== "") {
      const tagsArray = EditTags.split(",").map((tag) => tag.trim());
      setTags(tagsArray);
    }
  }, [EditTags, offcanvasToggle]);

  useEffect(() => {
    getSuggestedTags(typeOfTags);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(
      () => getSuggestedTags(typeOfTags, searchParam),
      300
    );
    return () => clearTimeout(timeOutId);
  }, [searchParam]);

  useEffect(() => {
    const offcanvasElement = document.getElementById("addTagOffcanvas");
    setOffcanvasToggle(!offcanvasToggle);

    offcanvasElement.addEventListener("show.bs.offcanvas", setOffcanvasToggle);
    offcanvasElement.addEventListener("hide.bs.offcanvas", setOffcanvasToggle);
    return () => {
      offcanvasElement.removeEventListener("show.bs.offcanvas", setOffcanvasToggle);
      offcanvasElement.removeEventListener("hide.bs.offcanvas", setOffcanvasToggle);
    };
  }, []);

  const getSuggestedTags = async (type, search) => {
    const bodys = new FormData();
    bodys.append("activityName", "");
    bodys.append("startTime", "");
    bodys.append("location", "");
    bodys.append("search", search || "");
    bodys.append("type", type);

    for (const [key, value] of bodys.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("searchParam", searchParam);

    try {
      const tagsArray = await axios.post(
        config.SERVER_PATH + "/api/tag",
        bodys,
        {
          headers: headersAuth,
          withCredentials: true,
        }
      );
      if (tagsArray.status === 200) {
        console.log("tdadawda:", tagsArray.data.data);
        setSuggestedTags(tagsArray.data.data);
      }
    } catch (error) {}
  };

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

  const handleSearchedTags = (e) => {
    const searchParam = e.target.value;
    setSearchParam(searchParam);
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
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          height: "75%",
        }}
        tabIndex="-1"
        id="addTagOffcanvas"
        aria-labelledby="addTagOffcanvasLabel"
      >
        {/* <div
          className="position-absolute"
          style={{
            background: "#D9D9D9",
            borderRadius: "50%",
            right: "-5px",
            top: "-15px",
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
        </div> */}
        <div className="offcanvas-body h-100 pt-4 d-flex flex-column">
          <div className="mb-1 position-relative">
            <label style={{ fontSize: "1rem" }}>ค้นหา หรือ สร้างแท็ก</label>
            <div
              className={`d-flex flex-row gap-2 mt-1 align-items-center ${
                tags.length < 10 ? "border-dark" : "border-secondary"
              }`}
            >
              <input
                type="text"
                className={`form-control py-1 px-2 ${
                  tags.length >= 10 ? "text-muted" : ""
                }`}
                placeholder={
                  tags.length >= 10 ? "จำนวนแท็กสูงสุดแล้ว" : "พิมพ์ที่นี่"
                }
                name="searchTag"
                onChange={(e) => handleSearchedTags(e)}
                value={searchParam}
                style={{
                  border: "1px solid #E7E7E7",
                  borderRadius: "5px",
                }}
                ref={inputRef}
                disabled={tags.length >= 10}
              />
              <button
                className="btn text-nowrap py-0 border-0 px-1 fw-medium text-center d-flex flex-row justify-content-center align-items-center"
                style={{
                  background: "#F89603",
                  height: "35px",
                  color: "#FFFFFF",
                  width: "35%",
                }}
                onClick={handleAddTag}
                disabled={tags.length >= 10}
                type="button"
              >
                เพิ่ม
              </button>
            </div>
          </div>
          <h6 className="mt-2">
            แท็กทั้งหมด{" "}
            <span style={{ color: tags.length < 10 ? "#000000" : "#B3261E" }}>
              ({tags.length}/10)
            </span>
          </h6>
          <div
            className="d-flex flex-row flex-wrap gap-2"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          >
            {tags.map((tag, index) => (
              <div className="position-relative" key={index}>
                <div
                  className="ps-3 d-flex flex-row align-items-center"
                  style={{
                    borderRadius: "12px",
                    paddingBottom: "4.5px",
                    paddingTop: "4.5px",
                    paddingRight: "17px",
                    background: "#FFB600",
                    color: "#fff",
                  }}
                >
                  <span
                    className="text-truncate m-0"
                    style={{
                      fontSize: ".75rem",
                      fontWeight: "500",
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    # {tag}
                  </span>
                  <IoClose
                    className="position-relative"
                    style={{
                      right: "-10px",
                      color: "#FFB600",
                      background: "#ffff",
                      borderRadius: "5px",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveTag(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <h6>แท็กแนะนำ</h6>
            <div
              className="d-flex flex-wrap gap-2"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            >
              {suggestedTags &&
                suggestedTags.map((tag, index) => (
                  <button
                    key={index}
                    className="border-0 ps-3 d-flex flex-row align-items-center"
                    onClick={() => handleSelectSuggestedTag(tag)}
                    disabled={tags.length >= 10 || tags.includes(tag)}
                    style={{
                      borderRadius: "12px",
                      paddingBottom: "4.5px",
                      paddingTop: "4.5px",
                      paddingRight: "17px",
                      background: "#E7E7E7",
                      color: "#949494",
                    }}
                  >
                    <span
                      className="text-truncate m-0"
                      style={{
                        fontSize: ".75rem",
                        fontWeight: "500",
                        maxWidth: "120px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      # {tag}
                    </span>
                    <IoAdd
                      className="position-relative"
                      style={{
                        right: "-10px",
                        color: "#E7E7E7",
                        background: "#ffff",
                        borderRadius: "5px",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>
          <div className="position-absolute bottom-0 start-0 w-100 p-3">
            <button
              className="px-4 py-1 fw-medium border-0 w-100"
              data-bs-toggle="offcanvas"
              data-bs-target="#addTagOffcanvas"
              aria-controls="addTagOffcanvas"
              style={{
                background: "#FF8500",
                borderRadius: "6px",
                color: "#fff",
              }}
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
