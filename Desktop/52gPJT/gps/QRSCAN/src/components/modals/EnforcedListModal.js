import React from "react";
import { useApp } from "../../contexts/AppContext";
import Modal from "../common/Modal";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

const EnforcedListModal = () => {
  const { state, toggleModal } = useApp();

  const handleClose = () => {
    toggleModal("enforcedList", false);
  };

  // Dummy data for demonstration
  const enforcementList = [
    {
      id: 1,
      location: "1층 로비",
      description: "미승인 출입 시도",
      timestamp: "2024-01-20 14:30",
    },
    {
      id: 2,
      location: "주차장 입구",
      description: "QR코드 미소지",
      timestamp: "2024-01-20 15:45",
    },
  ];

  if (!state.modals.enforcedList?.isOpen) return null;

  return (
    <Modal isOpen={true} onClose={handleClose} title="단속 내역">
      <div className="space-y-4">
        {enforcementList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            단속 내역이 없습니다
          </div>
        ) : (
          enforcementList.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <p className="text-gray-900">{item.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaClock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default EnforcedListModal;
