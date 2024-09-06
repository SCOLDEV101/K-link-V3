import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import SettingPage from "../pages/SettingPage";
import AboutMyAccount from "../pages/AboutMyAccount";
import EditMyAccount from "../pages/EditMyAccount";
import { ProfileAccoutProvider } from "../contextProivder/ProfileAccoutProvider";
import HomePage from "../pages/HomePage";
import Saved from "../pages/Saved";
import MemberPage from "../pages/MemberPage";
import MyPost from "../pages/MyPost";
import Notification from "../pages/Notification";
import AboutOtherAccount from "../pages/AboutOtherAccount";
import AcceptFriendRequest from "../pages/AcceptFriendRequest";
import TutoringCreateGroup from "../pages/TutoringCreateGroup";
import CreateGroupPage from "../pages/CreateGroupPage";
import AboutHobbyGroup from '../pages/AboutHobbyGroup';
import InviteFriend from "../pages/InviteFriend";
import FormAdd from "../pages/Login";
import Report from "../pages/Report";
import AppHome from "../pages/AppHome";
import SearchPage from "../pages/SearchPage";
import TutoringHomepage from "../pages/TutoringHomepage";
import LibraryHomePage from "../pages/LibraryHomePage";
import { SearchListProvider } from "../contextProivder/SearchListProvider";
import AboutTutoringGroup from "../pages/AboutTutoringGroup";
import AboutApp from "../pages/AboutApp";
import LibraryCreatePost from "../pages/LibraryCreatePost";
import ProtectedRoute from "../components/ProtectRoute";

export const RouterPathAndName = [
    {
        path: "/",
        name: "LOGIN",
        element: <Layout><FormAdd /></Layout>,
    },
    {
        path: "/hobby",
        name: "HOBBY",
        element: <ProtectedRoute><Layout><SearchListProvider><HomePage /></SearchListProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/members",
        name: "MEMBER",
        element: <ProtectedRoute><Layout><MemberPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/mypost",
        name: "MY POST",
        element: <ProtectedRoute><Layout><MyPost /></Layout></ProtectedRoute>,
    },
    {
        path: "/setting",
        name: "SETTING",
        element: <ProtectedRoute><Layout><SettingPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/notification",
        name: "NOTIFY",
        element: <ProtectedRoute><Layout><Notification /></Layout></ProtectedRoute>,
    },
    {
        path: "/aboutmyaccount",
        name: "เกี่ยวกับบัญชี",
        element: <ProtectedRoute><Layout><ProfileAccoutProvider><AboutMyAccount /></ProfileAccoutProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/aboutmyaccount/editmyaccount",
        name: "แก้ไขบัญชี",
        element: <ProtectedRoute><Layout><ProfileAccoutProvider><EditMyAccount /></ProfileAccoutProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/aboutaccount",
        name: "เกี่ยวกับบัญชี",
        element: <ProtectedRoute><Layout><AboutOtherAccount /></Layout></ProtectedRoute>,
    },
    {
        path: "/acceptRequest",
        name: "คำขอเข้าร่วมกลุ่ม",
        element: <ProtectedRoute><Layout><AcceptFriendRequest /></Layout></ProtectedRoute>,
    },
    {
        path: "/tutoringcreategroup",
        name: "สร้างกลุ่มติว",
        element: <ProtectedRoute><Layout><TutoringCreateGroup /></Layout></ProtectedRoute>,
    },
    {
        path: "/tutoringeditgroup",
        name: "แก้ไขกลุ่มติว",
        element: <ProtectedRoute><Layout><TutoringCreateGroup /></Layout></ProtectedRoute>,
    },
    {
        path: "/hobbycreategroup",
        name: "สร้างกลุ่ม",
        element: <ProtectedRoute><Layout><CreateGroupPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/hobbyeditgroup",
        name: "แก้ไขกลุ่ม",
        element: <ProtectedRoute><Layout><CreateGroupPage /></Layout></ProtectedRoute>,
    },
    {
        path: "/abouthobbygroup",
        name: "เกี่ยวกับกลุ่ม",
        element: <ProtectedRoute><Layout><AboutHobbyGroup /></Layout></ProtectedRoute>,
    },
    {
        path: "/abouttutoringgroup",
        name: "เกี่ยวกับกลุ่ม",
        element: <ProtectedRoute><Layout><AboutTutoringGroup /></Layout></ProtectedRoute>,
    },
    {
        path: "/invitefriend",
        name: "ชวนเพื่อน",
        element: <ProtectedRoute><Layout><InviteFriend /></Layout></ProtectedRoute>,
    },
    {
        path: "/report",
        name: "รายงาน",
        element: <ProtectedRoute><Layout><Report /></Layout></ProtectedRoute>,
    },
    {
        path: "/bookmark",
        name: "ที่บันทึกไว้",
        element: <ProtectedRoute><Layout><Saved /></Layout></ProtectedRoute>,
    },
    {
        path: "/home",
        name: "HOME",
        element: <ProtectedRoute><Layout><AppHome /></Layout></ProtectedRoute>,
    },
    {
        path: "/search",
        name: "SEARCH",
        element: <ProtectedRoute><Layout><SearchListProvider><SearchPage /></SearchListProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/tutoring",
        name: "TUTORING",
        element: <ProtectedRoute><Layout><SearchListProvider><TutoringHomepage /></SearchListProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/library",
        name: "LIBRARY",
        element: <ProtectedRoute><Layout><SearchListProvider><LibraryHomePage /></SearchListProvider></Layout></ProtectedRoute>,
    },
    {
        path: "/librarycreatepost",
        name: "สร้างโพสต์",
        element: <ProtectedRoute><Layout><LibraryCreatePost /></Layout></ProtectedRoute>,
    },
    {
        path: "/aboutapp",
        name: "เกี่ยวกับแอพ",
        element: <ProtectedRoute><Layout><AboutApp /></Layout></ProtectedRoute>,
    },
];


export const routers = createBrowserRouter(
    Object.values(RouterPathAndName).map(({ path, element }) => ({
        path,
        element,
    }))
);