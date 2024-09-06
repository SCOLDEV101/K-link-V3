import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";


const ProfileAccountContext = createContext();

export function ProfileAccoutProvider({ children }) {
  // const Data = {
  //   profileImage: "",
  //   username: "Jhong",
  //   fullname: "Jhong KUUY",
  //   telephone: "0899999999",
  //   aboutMe: "Ai Jhong",
  // };
  const [profileData, setprofileData] = useState({
    profileImage: "",
    username: "",
    fullname: "",
    telephone: "",
    aboutMe: "",
  });

  useEffect(() => {
    async function GetProfileAccountData() {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/users`
      );
      setprofileData({
        profileImage: "",
        username: data[0].username,
        fullname: data[0].name,
        telephone: data[0].phone,
        aboutMe: data[0].website,
      });
    }
    GetProfileAccountData();
  }, []);
  return (
    <ProfileAccountContext.Provider value={{ profileData, setprofileData }}>
      {children}
    </ProfileAccountContext.Provider>
  );
}

export function useProfileAccount() {
  const context = useContext(ProfileAccountContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
