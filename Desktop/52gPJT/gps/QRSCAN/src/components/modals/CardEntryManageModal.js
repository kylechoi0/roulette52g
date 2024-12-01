import React, { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configuration/firebaseConfig";

const CardEntryManageModal = () => {
  const { state, toggleModal } = useApp();
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const workersRef = collection(db, "workers");
        const q = query(workersRef, where("isActive", "==", true));
        const snapshot = await getDocs(q);
        const workersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkers(workersData);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setError("근로자 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (state.modals.addWorker?.isOpen) {
      fetchWorkers();
    }
  }, [state.modals.addWorker?.isOpen]);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || worker.entryType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleClose = () => {
    toggleModal("addWorker", false);
  };

  const handleWorkerSelect = (workerId) => {
    setSelectedWorkers((prev) => {
      if (prev.includes(workerId)) {
        return prev.filter((id) => id !== workerId);
      }
      return [...prev, workerId];
    });
  };

  const handleSubmit = async () => {
    // 선택된 근로자 처리 로직
    console.log("Selected workers:", selectedWorkers);
    handleClose();
  };

  if (!state.modals.addWorker?.isOpen) return null;

  return (
    <Modal isOpen={true} onClose={handleClose} title="미소지자 등록" size="lg">
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="이름 또는 회사로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="CARD">카드</option>
            <option value="QR">QR</option>
          </select>
        </div>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                selected={selectedWorkers.includes(worker.id)}
                onSelect={() => handleWorkerSelect(worker.id)}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedWorkers.length}명 선택됨
          </div>
          <div className="space-x-4">
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedWorkers.length === 0}
            >
              등록
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const WorkerCard = ({ worker, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-xl cursor-pointer transition-all duration-200
        ${
          selected
            ? "bg-blue-50 ring-2 ring-blue-500"
            : "bg-white hover:bg-gray-50 ring-1 ring-gray-200"
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1"
        />
        <div>
          <h3 className="font-bold text-gray-900">{worker.name}</h3>
          {worker.company && (
            <p className="text-sm text-gray-600">{worker.company}</p>
          )}
          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`
              px-2 py-1 text-xs rounded-full
              ${
                worker.entryType === "CARD"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }
            `}
            >
              {worker.entryType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEntryManageModal;
