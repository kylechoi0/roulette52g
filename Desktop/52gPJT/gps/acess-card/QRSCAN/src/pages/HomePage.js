import React, { useState } from "react";
import QRScanner from "../components/features/QRScanner/QRScanner";
import WorkerInfoDisplay from "../components/features/WorkerInfoDisplay/WorkerInfoDisplay";
import { db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const HomePage = () => {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (workerId) => {
    if (!workerId) return;

    setLoading(true);
    setError(null);

    try {
      const workerDoc = await getDoc(doc(db, "workers", workerId));

      if (!workerDoc.exists()) {
        setError("근로자 정보를 찾을 수 없습니다.");
        setWorker(null);
        return;
      }

      setWorker({ id: workerDoc.id, ...workerDoc.data() });
    } catch (err) {
      console.error("Error fetching worker:", err);
      setError("근로자 정보를 불러오는 중 오류가 발생했습니다.");
      setWorker(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        GS동해전력 출입관리 시스템
      </h1>

      <div className="space-y-8">
        <QRScanner onScan={handleScan} />

        {loading && <div className="text-center text-gray-600">로딩 중...</div>}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {worker && <WorkerInfoDisplay worker={worker} />}
      </div>
    </div>
  );
};

export default HomePage;
