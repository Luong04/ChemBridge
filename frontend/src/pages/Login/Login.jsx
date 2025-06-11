import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css';

import './Login.css';
import { BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import userApi from "../../api/userApi";
import { useNavigate } from 'react-router-dom';

const Login = ({ session, setSession }) => {
    const [isActive, setIsActive] = useState(false);
    const [value, setValue] = useState(); // phone number
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsActive(true);
        setError(''); // Clear error khi chuyển form
    };

    const handleLoginClick = () => {
        setIsActive(false);
        setError(''); // Clear error khi chuyển form
    };

    const handleOnLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Gọi API đăng nhập
            await userApi.getLogin({
                username: username.trim(),
                password: password,
            });

            // Gọi API kiểm tra session để lấy thông tin session
            const sessionResponse = await userApi.checkSession();
            console.log("Session response:", sessionResponse);

            if (sessionResponse && sessionResponse.logged_in) {
                // Lưu session data từ /session/check
                const sessionData = {
                    userName: sessionResponse.user_name,
                    sessionId: sessionResponse.session_id,
                    // Các trường khác nếu có (id, full_name, email, phone)
                };

                setSession(sessionData);
                console.log("Login successful, session stored:", sessionData);
                navigate("/main"); // Không truyền session qua state
            } else {
                setError("Không thể lấy thông tin session. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data;
                if (status === 401) {
                    setError("Tên đăng nhập hoặc mật khẩu không đúng");
                } else if (status === 400) {
                    setError("Vui lòng nhập đầy đủ thông tin");
                } else {
                    setError(typeof errorMessage === "string" ? errorMessage : "Đăng nhập thất bại");
                }
            } else {
                setError("Không thể kết nối đến server. Vui lòng thử lại!");
            }
        } finally {
            setIsLoading(false);
        }
    };      

    const handleOnSignUp = async (e) => {
        e.preventDefault();

        // Validate input
        if (!username || !password || !email || !fullname) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Email không hợp lệ");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await userApi.getSignUp({
                username: username.trim(),
                password: password,
                email: email.trim(),
                fullname: fullname.trim(),
                value: value // phone number
            });

            console.log("Registration response:", response);

            if (response) {
                alert("Đăng ký thành công!");
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration failed:", error);

            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data;

                if (status === 409) {
                    setError("Tên người dùng đã tồn tại");
                } else if (status === 400) {
                    setError(typeof errorMessage === 'string' ? errorMessage : "Thông tin đăng ký không hợp lệ");
                } else {
                    setError("Đăng ký thất bại");
                }
            } else {
                setError("Không thể kết nối đến server. Vui lòng thử lại!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="login-body-page">
                <Link to="/"><BsXLg size={45} className="exit-icon" /></Link>
                <div className={`login-container ${isActive ? 'active' : ''}`} id="container">
                    {/* SIGN UP FORM */}
                    <div className="form-container sign-up">
                        <form onSubmit={handleOnSignUp}>
                            <h1>Create Account</h1>
                            <div className="col-12 social-login">
                                <i className="fa-brands fa-google-plus-g google"></i>
                            </div>
                            <span>or use your email for registration</span>

                            {/* Error message for Sign Up */}
                            {error && isActive && (
                                <div className="error-message" style={{
                                    color: '#ff6b6b',
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username *"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={value}
                                onChange={setValue}
                                className="PhoneInputInput"
                                disabled={isLoading}
                            />
                            <input
                                type="password"
                                placeholder="Password *"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    backgroundColor: isLoading ? '#ccc' : '',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Đang đăng ký...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    {/* SIGN IN FORM */}
                    <div className="form-container sign-in">
                        <form onSubmit={handleOnLogin}>
                            <h1>Sign In</h1>
                            <div className="col-12 social-login">
                                <i className="fa-brands fa-google-plus-g google"></i>
                            </div>
                            <span>or use your username and password</span>

                            {/* Error message for Sign In */}
                            {error && !isActive && (
                                <div className="error-message" style={{
                                    color: '#ff6b6b',
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <a href="#">Forget Your Password?</a>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    backgroundColor: isLoading ? '#ccc' : '',
                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    {/* TOGGLE PANELS */}
                    <div className="toggle-container">
                        <div className="toggle">
                            <div className="toggle-panel toggle-left">
                                <h1>Welcome Back!</h1>
                                <p>Enter your personal details to use all of site features</p>
                                <button className="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
                            </div>
                            <div className="toggle-panel toggle-right">
                                <h1>Hello, Friend!</h1>
                                <p>Register with your personal details to use all of site features</p>
                                <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;