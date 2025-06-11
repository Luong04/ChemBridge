import classNames from "classnames/bind";
import styles from "./Main.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainNavbar from "../../components/MainComponents/MainNavbar/MainNavbar";
import MainContent from "../../components/MainComponents/MainContent/MainContent";
import userApi from "../../api/userApi";

const cx = classNames.bind(styles);

const Main = () => {
  const [isSessionValid, setIsSessionValid] = useState(null);
  const [userName, setUserName] = useState(""); // Lưu userName để truyền cho MainNavbar
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Gọi API kiểm tra session
        const response = await userApi.checkSession();
        console.log("Phản hồi kiểm tra session:", response);

        if (response && response.logged_in) {
          console.log("Session hợp lệ, tiếp tục render Main");
          setUserName(response.user_name || "");
          setIsSessionValid(true);
        } else {
          console.log("Session không hợp lệ, chuyển hướng về login");
          setIsSessionValid(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra session:", error.response?.data || error.message);
        setIsSessionValid(false);
        navigate("/login");
      }
    };

    verifySession();
  }, [navigate]);

  if (isSessionValid === null) {
    return <div>Đang kiểm tra session...</div>;
  }

  if (!isSessionValid) {
    return null;
  }

  return (
    <div className={cx("main-container")}>
      <MainNavbar userName={userName} />
      <MainContent />
    </div>
  );
};

export default Main;