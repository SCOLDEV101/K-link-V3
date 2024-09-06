import React, { useEffect, useState } from "react";
// import Login from '../constants/function.js'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../constants/function";
import Swal from 'sweetalert2'
import "../index.css";



function FormAdd() {
  // const [login, setLogin] = useState({});
  const navigate = useNavigate();

  const Login = async () => {
    await axios
      .get(config.SERVER_PATH + "/api/login", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "ok") {
          document.cookie = "token=" + res.data.token;
          console.log("login success");
          // Swal.fire({
          //   position: "center",
          //   title: "Welcome to K-LINK",
          //   showConfirmButton: false,
          //   timer: 2000,
          //   customClass: {
          //     title: 'swal-title-success',
          //     container: 'swal-container',
          //     popup: 'swal-popup-success',
          //   }
          // }); พอยให้เอาออก
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Try again'
        })
      });
  };

  return (
    <>
      <div
        className="container d-flex mt-auto flex-column justify-content-center"
        style={{
          background: "linear-gradient(0deg, #FB6204, #F68302)",
          height: "100vh",
        }}
      >
        <div className="d-flex flex-column justify-content-center align-items-center gap-2" style={{ marginTop: 120 }}>
          <img
            src="/Login.svg"
            alt=""
            className="mb-2"
            style={{ width: "180px", height: "180px" }}
          />
          <span className="fs-6 fw-bold text-white mb-1">
            Login as guest account.
          </span>
          <button
            className="btn w-100 fs-4 fw-bolder"
            style={{
              background: "white",
              boxShadow: "3px 5px 0px rgba(0,0,0,0.25)",
              borderRadius: "10px",
              color: "#F96C03",
            }}
            onClick={Login}
            type="button"
          >
            Login
          </button>
        </div>
        <div className="text text-center text-secondary" style={{ marginTop: 200 }}>POWERED BY SCOLDEV</div>
      </div>
    </>
  );
}

export default FormAdd;
