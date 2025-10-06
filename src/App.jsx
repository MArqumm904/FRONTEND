import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Friends from "./pages/friends";
import Notifications from "./pages/notifications";
import Saved from "./pages/saved";
import Groups from "./pages/groups";
import Pages from "./pages/pages";
import Browse from "./pages/browse";
import PostModalPage from "./pages/PostModalPage";
import PageModalPage from "./pages/PageModalPage";
import Profile from "./pages/profile";
import CheckLoginOrNot from "./pages/CheckLoginOrNot";
import Preloader from "./components/preloader/Preloader";
import GroupHome from "./components/groupscomp/group_main_home";
import Reels from "./pages/reels";
import "./App.css";
import Messages from "./pages/Messages";
import PageProfile from "./pages/PageProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/preloader" element={<Preloader />} />
        <Route path="/" element={<CheckLoginOrNot><Home /></CheckLoginOrNot>} />
        <Route path="/post/:postId" element={<PostModalPage />} />
        <Route path="/page/:pageId" element={<PageModalPage />} />
        <Route path="/friends" element={<CheckLoginOrNot><Friends /></CheckLoginOrNot>} />
        <Route path="/notifications" element={<CheckLoginOrNot><Notifications /></CheckLoginOrNot>} />
        <Route path="/saved" element={<CheckLoginOrNot><Saved /></CheckLoginOrNot>} />
        <Route path="/reels" element={<CheckLoginOrNot><Reels /></CheckLoginOrNot>} />
        <Route path="/groups" element={<CheckLoginOrNot><Groups /></CheckLoginOrNot>} />
        <Route path="/pages" element={<CheckLoginOrNot><Pages /></CheckLoginOrNot>} />
        <Route path="/browse" element={<CheckLoginOrNot><Browse /></CheckLoginOrNot>} />
        <Route path="/profile/:id" element={<CheckLoginOrNot><Profile /></CheckLoginOrNot>} />
        <Route path="/messages" element={<CheckLoginOrNot><Messages /></CheckLoginOrNot>} />
        <Route path="/group_main_home/:id" element={<CheckLoginOrNot><GroupHome /></CheckLoginOrNot>} />
        <Route path="/pageprofile/:id" element={<PageProfile />} />
      </Routes>
    </Router>
  );
}

export default App;