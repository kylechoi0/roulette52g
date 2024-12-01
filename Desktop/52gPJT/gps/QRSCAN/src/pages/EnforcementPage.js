import React from "react";
import { useApp } from "../contexts/AppContext";
import { FaUserShield, FaList } from "react-icons/fa";

const EnforcementPage = () => {
  const { toggleModal } = useApp();

  const handleEnforcement = () => {
    toggleModal("enforcement", true);
  };

  const handleViewList = () => {
    toggleModal("enforcedList", true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          단속 관리
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ActionCard
          title="단속하기"
          description="현장 단속을 시작합니다"
          icon={FaUserShield}
          onClick={handleEnforcement}
          color="blue"
        />
        <ActionCard
          title="단속 내역"
          description="단속 내역을 확인합니다"
          icon={FaList}
          onClick={handleViewList}
          color="green"
        />
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon: Icon, onClick, color }) => {
  const colors = {
    blue: "from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50",
    green:
      "from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50",
  };

  const iconColors = {
    blue: "text-blue-500 group-hover:text-blue-600",
    green: "text-green-500 group-hover:text-green-600",
  };

  return (
    <button
      onClick={onClick}
      className={`
        p-6 rounded-xl shadow-md
        bg-gradient-to-br ${colors[color]}
        transition-all duration-200
        hover:shadow-lg
        group
      `}
    >
      <div className="flex items-center space-x-4">
        <Icon className={`w-12 h-12 ${iconColors[color]}`} />
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default EnforcementPage;
