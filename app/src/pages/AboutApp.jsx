import React from "react";

function AboutApp() {
  return (
    <div
      className="container-fluid p-0"
      style={{
        background: "linear-gradient(0deg, #F85B03, #F86A03, #F89603)",
        height: "100vh",
      }}
    >
      <div
        className="card fixed-bottom mx-3"
        style={{
          top: "100px",
          height: "100%",
          maxHeight: "100vh",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "5px 5px 0px rgba(0, 0, 0, .25)",
          zIndex: 15,
        }}
      >
        <div className="card-body mt-2 px-4">
          <h1 className=" fw-bolder">
            K-Link <span className="fs-6 fw-light">v.2.0.0a</span>
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro in
            magnam hic placeat velit asperiores voluptatibus atque? Corporis
            laborum tempore ea iure, tenetur, possimus eum illo, aspernatur iste
            est nihil? Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Ad, laudantium debitis soluta facilis doloremque eaque repellat
            officiis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutApp;
