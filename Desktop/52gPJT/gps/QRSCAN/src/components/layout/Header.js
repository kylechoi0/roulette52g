import React from "react";
import { useNavigate } from "react-router-dom";
import { FaIdCard, FaMobileAlt, FaClipboardCheck, FaCog } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <FaIdCard className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                GPS
              </span>
            </button>
            <span className="text-xl sm:text-2xl text-gray-600">
              GS동해전력
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-2 sm:space-x-4">
            <NavButton
              icon={FaMobileAlt}
              text="휴대폰 미소지"
              onClick={() => navigate("/card-entry")}
              color="blue"
            />
            <NavButton
              icon={FaClipboardCheck}
              text="단속"
              onClick={() => navigate("/enforcement")}
              color="red"
            />
            <NavButton
              icon={FaCog}
              text="설정"
              onClick={() => navigate("/settings")}
              color="gray"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ icon: Icon, text, onClick, color }) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color]}
        flex items-center space-x-2
        px-4 py-2 rounded-lg
        text-white font-medium
        transition-all duration-200
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
};

export default Header;
