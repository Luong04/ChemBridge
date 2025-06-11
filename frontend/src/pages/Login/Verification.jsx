import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";

import "./Verification.css";
import { BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!verificationCode || verificationCode.trim() === "") {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Gọi API validation với userInput là mã xác thực
      const response = await userApi.postValidation({ 
        userInput: verificationCode.trim() 
      });
      
      console.log("Verification response:", response);
      
      // Kiểm tra response thành công
      if (response && response.message === "Đăng ký tài khoản thành công") {
        alert(`${response.message}! User ID: ${response.user_id}`);
        navigate("/login");
      } else {
        setError("Xác thực không thành công");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data;
        
        if (status === 404) {
          setError("Mã xác thực không tồn tại hoặc đã hết hạn");
        } else if (status === 400) {
          setError("Mã xác thực không hợp lệ");
        } else {
          setError(typeof errorMessage === 'string' ? errorMessage : "Lỗi xác thực");
        }
      } else if (error.request) {
        setError("Không thể kết nối đến server. Vui lòng thử lại!");
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Logic để gửi lại mã xác thực (nếu có API)
    try {
      setError("");
      // Có thể thêm API call để resend code ở đây
      alert("Mã xác thực mới đã được gửi đến email của bạn!");
    } catch (error) {
      setError("Không thể gửi lại mã xác thực");
    }
  };

  return (
    <div>
      <div className="verify-body-page">
        {/* Nút thoát */}
        <Link to="/login" className="exit-link">
          <BsXLg size={30} className="exit-icon" />
        </Link>
        
        <div className="verify-container">
          <header>
            <i className="bx bxs-check-shield"></i>
          </header>
          
          <form onSubmit={handleVerificationSubmit}>
            <h2>Enter OTP Code</h2>
            <p>Check your email to get verification code</p>
            
            {/* Hiển thị lỗi nếu có */}
            {error && (
              <div className="error-message" style={{ 
                color: '#ff6b6b', 
                marginBottom: '15px', 
                padding: '10px',
                backgroundColor: '#ffe0e0',
                borderRadius: '5px',
                border: '1px solid #ff6b6b'
              }}>
                {error}
              </div>
            )}
            
            <div className="input-field-verify">
              <input
                type="text"
                id="verificationCode"
                placeholder="Nhập mã xác thực"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setError(""); // Clear error khi user nhập
                }}
                disabled={isLoading}
                maxLength={50} // Giới hạn độ dài mã
                style={{ 
                  marginRight: "15px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: error ? "2px solid #ff6b6b" : "1px solid #ccc",
                  fontSize: "16px"
                }}
                required
              />
              
              <button 
                type="submit" 
                disabled={isLoading || !verificationCode.trim()}
                style={{ 
                  padding: "10px 20px",
                  backgroundColor: isLoading ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px"
                }}
              >
                {isLoading ? "Đang xác thực..." : "Verify"}
              </button>
            </div>
            
            {/* Link để gửi lại mã */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Không nhận được mã?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Gửi lại
                </button>
              </p>
            </div>
            
            {/* Link quay lại login */}
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <Link 
                to="/login" 
                style={{ 
                  color: "#007bff", 
                  textDecoration: "none",
                  fontSize: "14px"
                }}
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;