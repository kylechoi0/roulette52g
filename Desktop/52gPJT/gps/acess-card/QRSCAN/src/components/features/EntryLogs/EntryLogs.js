import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseConfig";

const EntryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const logsQuery = query(
        collection(db, "entryLogs"),
        orderBy("timestamp", "desc"),
        limit(50)
      );

      const logsSnapshot = await getDocs(logsQuery);
      const logsList = logsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLogs(logsList);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("출입 기록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">로딩 중...</div>;

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">최근 출입 기록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                근로자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구분
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.timestamp.toDate()).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {log.workerPhotoUrl && (
                      <img
                        src={log.workerPhotoUrl}
                        alt=""
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {log.workerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.workerCompany}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.entryType === "CHECKIN"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.entryType === "CHECKIN" ? "입장" : "퇴장"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntryLogs;
