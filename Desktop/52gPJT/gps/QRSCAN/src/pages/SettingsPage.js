import React from "react";
import { FaCog } from "react-icons/fa";

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">설정</h1>
      </div>

      <div className="space-y-4">
        <SettingItem
          title="앱 버전"
          description="현재 버전: 1.0.0"
          icon={FaCog}
        />
      </div>
    </div>
  );
};

const SettingItem = ({ title, description, icon: Icon }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
