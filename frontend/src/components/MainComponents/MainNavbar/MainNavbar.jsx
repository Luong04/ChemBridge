import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BUTTON_LIST = [
  {
    id: "overview-button",
    href: "/",
    text: "Về trang chủ",
    icon: "🏠", // Icon Trang chủ
  },
  {
    id: "study-button",
    href: "/main",
    text: "Học tập",
    icon: "🧪", // Icon Học tập (Hóa học)
  },
];

function Navbar() {
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleReportClick = () => {
    setReportDropdownOpen(!reportDropdownOpen);
  };

  const handleRevenueClick = () => {
    navigate("/revenue");
    setReportDropdownOpen(false);
  };

  return (
    <>
      {/* Font Google Roboto */}
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#2c3e50",
          fontFamily: "Roboto, sans-serif",
        }}
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          {/* Brand */}
          <a
            className="navbar-brand fw-bold"
            href="/"
            style={{ color: "white", fontSize: "1.5rem" }}
          >
            ChemBridge
          </a>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul
              className="navbar-nav me-auto"
              style={{ gap: "10px", marginLeft: "20px" }}
            >
              {BUTTON_LIST.map((button) => {
                return (
                  <li key={button.text} className="nav-item">
                    <a
                      className="nav-link d-flex align-items-center px-3 py-2"
                      href={button.href}
                      style={{
                        color: "white",
                        minWidth: "140px",
                        borderRadius: "8px",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#3B8665")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      <span className="me-2" style={{ fontSize: "1.2rem" }}>
                        {button.icon}
                      </span>
                      <span>{button.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
