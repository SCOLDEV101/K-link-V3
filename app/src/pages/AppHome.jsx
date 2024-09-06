import React, { useState, useEffect } from 'react';
import { PiNavigationArrowDuotone } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const images = [
  '/slide/s1.jpeg',
  '/slide/s2.jpg',
  '/slide/s3.jpg',
];

const Menu = [
  { img: '/home_menus/Hobbyicon.png', title: "Hobby", path: "/hobby" },
  { img: '/home_menus/Libraryicon.png', title: "Library", path: "/library" },
  { img: '/home_menus/Tutoringicon.png', title: "Tutoring", path: "/tutoring" },
];

function AppHome() {
  const [adsCurrentIndex, setAdsCurrentIndex] = useState(0);
  const [menuCurrentIndex, setMenuCurrentIndex] = useState(0);
  const [adsIntervalId, setAdsIntervalId] = useState(null);
  const [adsTouchStartX, setAdsTouchStartX] = useState(null);
  const [adsTouchEndX, setAdsTouchEndX] = useState(null);
  const [menuTouchStartX, setMenuTouchStartX] = useState(null);
  const [menuTouchEndX, setMenuTouchEndX] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAdsCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    setAdsIntervalId(interval);

    return () => clearInterval(interval);
  }, []);

  const resetAdsInterval = () => {
    if (adsIntervalId) {
      clearInterval(adsIntervalId);
    }
    const newInterval = setInterval(() => {
      setAdsCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    setAdsIntervalId(newInterval);
  };

  const nextSlideAds = () => {
    setAdsCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetAdsInterval();
  };

  const prevSlideAds = () => {
    setAdsCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    resetAdsInterval();
  };

  const goToSlideAds = (index) => {
    setAdsCurrentIndex(index);
    resetAdsInterval();
  };

  const nextSlideMenu = () => {
    setMenuCurrentIndex((prevIndex) => (prevIndex + 1) % Menu.length);
  };

  const prevSlideMenu = () => {
    setMenuCurrentIndex((prevIndex) => (prevIndex - 1 + Menu.length) % Menu.length);
  };

  const goToSlideMenu = (index) => {
    setMenuCurrentIndex(index);
  };

  const handleAdsTouchStart = (e) => {
    setAdsTouchStartX(e.touches[0].clientX);
  };

  const handleAdsTouchMove = (e) => {
    setAdsTouchEndX(e.touches[0].clientX);
  };

  const handleAdsTouchEnd = () => {
    if (adsTouchStartX && adsTouchEndX) {
      if (adsTouchStartX - adsTouchEndX > 50) {
        nextSlideAds();
      } else if (adsTouchEndX - adsTouchStartX > 50) {
        prevSlideAds();
      }
      setAdsTouchStartX(null);
      setAdsTouchEndX(null);
    }
  };

  const handleMenuTouchStart = (e) => {
    setMenuTouchStartX(e.touches[0].clientX);
  };

  const handleMenuTouchMove = (e) => {
    setMenuTouchEndX(e.touches[0].clientX);
  };

  const handleMenuTouchEnd = () => {
    if (menuTouchStartX && menuTouchEndX) {
      if (menuTouchStartX - menuTouchEndX > 50) {
        nextSlideMenu();
      } else if (menuTouchEndX - menuTouchStartX > 50) {
        prevSlideMenu();
      }
      setMenuTouchStartX(null);
      setMenuTouchEndX(null);
    }
  };

  const indicatorAdsStyle = (index, currentIndex) => ({
    height: '1vw',
    width: '1vw',
    backgroundColor: currentIndex === index ? '#FFB600' : '#D9D9D9',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    cursor: 'pointer',
  });

  const indicatorMenuStyle = (index, currentIndex) => ({
    height: '1vw',
    width: currentIndex === index ? '10vw' : '5vw',
    backgroundColor: currentIndex === index ? '#FFB600' : '#D9D9D9',
    display: 'inline-block',
    margin: '0 1px',
    cursor: 'pointer',
  });

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div style={{
      height: "calc(100vh - 180px)",
      marginTop: "90px",
      overflow: "hidden",
      fontSize: "3.5vw",
    }}>
      <div className="d-flex flex-column align-items-center justify-content-center">
        {/* Ads Section */}
        <div id='ads' className="d-flex flex-column align-items-center justify-content-center mt-3"
          onTouchStart={handleAdsTouchStart}
          onTouchMove={handleAdsTouchMove}
          onTouchEnd={handleAdsTouchEnd}
          style={{ transition: "transform 1s ease-in-out" }}
        >
          <div className="position-relative overflow-hidden bg-light" style={{ width: "80%", height: "10%", borderRadius:"10px" }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '130px' }}>
            <img
              src={images[adsCurrentIndex]}
              // src='./'
              alt="slider"
              style={{ objectFit: 'cover', width: '300px', height: '130px' }}
            />
          </div>
            <button
              onClick={prevSlideAds}
              className="position-absolute top-0 bottom-0 d-flex align-items-center justify-content-center"
              style={{ width: '10vw', backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'white', border: 'none', cursor: 'pointer', zIndex: 2, left: '0' }}
            >
              <PiNavigationArrowDuotone style={{ transform: 'rotate(315deg)', fontSize: "10vw" }} />
            </button>
            <button
              onClick={nextSlideAds}
              className="position-absolute top-0 bottom-0 d-flex align-items-center justify-content-center"
              style={{ width: '10vw', backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'white', border: 'none', cursor: 'pointer', zIndex: 2, right: '0' }}
            >
              <PiNavigationArrowDuotone style={{ transform: 'rotate(135deg)', fontSize: "10vw" }} />
            </button>
            <div className="position-absolute w-100 d-flex justify-content-center align-items-center" style={{ bottom: '10px' }}>
              {images.map((_, index) => (
                <span
                  key={index}
                  onClick={() => goToSlideAds(index)}
                  style={indicatorAdsStyle(index, adsCurrentIndex)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div id='menu'
          onTouchStart={handleMenuTouchStart}
          onTouchMove={handleMenuTouchMove}
          onTouchEnd={handleMenuTouchEnd}
        >
          <div className="position-relative mx-auto mt-5 d-flex justify-content-center " style={{ transition: "transform 1s ease-in-out" }}
          >
            <button
              onClick={prevSlideMenu}
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{ bottom: '45%', color: '#D9D9D9', border: 'black', padding: '10px', cursor: 'pointer', zIndex: 2, right: '100%', backgroundColor: '#f6f6f6'}}
            >
              <PiNavigationArrowDuotone style={{ transform: 'rotate(315deg)', fontSize: "15vw", color: "#000000" }} />
            </button>
            <div>
              <img
                src={process.env.PUBLIC_URL + Menu[menuCurrentIndex].img}
                alt="slider"
                className="d-flex align-items-center justify-content-center"
                style={{ objectFit: 'cover', borderRadius: "50%", width: "50vw", height: "50vw", transition: "transform 1s ease-in-out" }}
                onClick={() => handleMenuClick(Menu[menuCurrentIndex].path)}
              />
              <h2 className='fw-bold text-center mt-3' onClick={() => handleMenuClick(Menu[menuCurrentIndex].path)}>{Menu[menuCurrentIndex].title}</h2>
            </div>
            <div className="position-absolute w-100 d-flex justify-content-center align-items-center" style={{ bottom: '-5%' }}>
              {Menu.map((_, index) => (
                <span
                  key={index}
                  onClick={() => goToSlideMenu(index)}
                  style={indicatorMenuStyle(index, menuCurrentIndex)}
                />
              ))}
            </div>
            <button
              onClick={nextSlideMenu}
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{ bottom: '45%', color: '#D9D9D9', border: 'black', padding: '10px', cursor: 'pointer', zIndex: 2, left: '100%', backgroundColor: '#f6f6f6'}}
            >
              <PiNavigationArrowDuotone style={{ transform: 'rotate(135deg)', fontSize: "15vw", color: "#000000" }} />
            </button>
          </div>
        </div>
        <div className="text text-center text-secondary" style={{ marginTop: 110 }}>POWERED BY SCOLDEV</div>
      </div>
    </div>
  );
}

export default AppHome;
