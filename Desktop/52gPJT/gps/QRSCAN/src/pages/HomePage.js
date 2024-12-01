import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMobileAlt, FaClipboardCheck, FaChartBar } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "휴대폰 미소지자",
      description: "휴대폰 미소지자 출입 관리",
      icon: FaMobileAlt,
      path: "/card-entry",
      color: "blue",
    },
    {
      title: "단속",
      description: "현장 단속 관리",
      icon: FaClipboardCheck,
      path: "/enforcement",
      color: "red",
    },
    {
      title: "출입 현황",
      description: "실시간 출입 현황",
      icon: FaChartBar,
      path: "/entry-status",
      color: "green",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        GPS 근로자 출입 관리 시스템
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              p-6 rounded-xl shadow-md
              bg-gradient-to-br
              ${
                item.color === "blue"
                  ? "from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50"
                  : item.color === "red"
                  ? "from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50"
                  : "from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50"
              }
              transition-all duration-200
              hover:shadow-lg
              group
            `}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <item.icon
                className={`
                  w-12 h-12
                  ${
                    item.color === "blue"
                      ? "text-blue-500 group-hover:text-blue-600"
                      : item.color === "red"
                      ? "text-red-500 group-hover:text-red-600"
                      : "text-green-500 group-hover:text-green-600"
                  }
                `}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-gray-600">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
