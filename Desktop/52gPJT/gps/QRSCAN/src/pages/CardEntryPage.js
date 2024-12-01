import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaQrcode,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useApp } from "../contexts/AppContext";
import { db } from "../configuration/firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const CardEntryPage = () => {
  const navigate = useNavigate();
  const { toggleModal } = useApp();

  const handleAddWorker = () => {
    toggleModal("addWorker", true);
  };

  const handleScanQR = () => {
    toggleModal("cardEntry", true);
  };

  const handleWorkStatus = async (workerId, status) => {
    try {
      const recordData = {
        workerId,
        workStatus: status,
        createdAt: Timestamp.now(),
        entryType: "CARD",
        deviceId: "CARD_READER_01",
      };

      await addDoc(collection(db, "records"), recordData);

      alert(`${status === "CHECKIN" ? "출근" : "퇴근"} 처리가 완료되었습니다.`);
    } catch (error) {
      console.error("출퇴근 기록 저장 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          휴대폰 미소지자 관리
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ActionCard
          title="미소지자 등록"
          description="휴대폰 미소지자를 등록합니다"
          icon={FaUserPlus}
          onClick={handleAddWorker}
          color="blue"
        />
        <ActionCard
          title="QR 스캔"
          description="QR코드를 스캔하여 출입을 확인합니다"
          icon={FaQrcode}
          onClick={handleScanQR}
          color="green"
        />
        <ActionCard
          title="출근 기록"
          description="출근 시간을 기록합니다"
          icon={FaSignInAlt}
          onClick={() => handleWorkStatus("WORKER_ID", "CHECKIN")}
          color="blue"
        />
        <ActionCard
          title="퇴근 기록"
          description="퇴근 시간을 기록합니다"
          icon={FaSignOutAlt}
          onClick={() => handleWorkStatus("WORKER_ID", "CHECKOUT")}
          color="red"
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
    red: "from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50",
  };

  const iconColors = {
    blue: "text-blue-500 group-hover:text-blue-600",
    green: "text-green-500 group-hover:text-green-600",
    red: "text-red-500 group-hover:text-red-600",
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

export default CardEntryPage;
