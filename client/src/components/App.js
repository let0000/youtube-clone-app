import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import Auth from "../hoc/auth";
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage";
import NavBar from "./views/NavBar/NavBar";
import { Suspense } from "react";
import Footer from "./views/Footer/Footer";
import VideoDetailPage from "./views/VideoDetailPage/VideoDetailPage";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthVideoUploadPage = Auth(VideoUploadPage, true);
  const AuthVideoDetailPage = Auth(VideoDetailPage, null);

  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: "75px", minHeight: "calc(100vh - 80px)" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<AuthLandingPage />} />
            <Route path="/login" element={<AuthLoginPage />} />
            <Route path="/register" element={<AuthRegisterPage />} />
            <Route path="/video/upload" element={<AuthVideoUploadPage />} />
            <Route path="/video/:videoId" element={<AuthVideoDetailPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
