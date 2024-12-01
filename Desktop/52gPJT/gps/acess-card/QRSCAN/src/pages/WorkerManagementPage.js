import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../services/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const WorkerManagementPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    primaryContractor: "",
    subContractor: "",
    construction: "",
    safetyEducationCompleted: false,
    confidentialityAgreed: false,
    bloodPressureChecked: false,
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const workersCollection = collection(db, "workers");
      const workersSnapshot = await getDocs(workersCollection);
      const workersList = workersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkers(workersList);
    } catch (err) {
      console.error("Error fetching workers:", err);
      setError("근로자 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedWorker) {
        await updateDoc(doc(db, "workers", selectedWorker.id), formData);
      } else {
        await addDoc(collection(db, "workers"), formData);
      }
      fetchWorkers();
      resetForm();
    } catch (err) {
      console.error("Error saving worker:", err);
      setError("근로자 정보 저장 중 오류가 발생했습니다.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(
        storage,
        `worker-photos/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, photoUrl }));
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("사진 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (workerId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "workers", workerId));
      fetchWorkers();
    } catch (err) {
      console.error("Error deleting worker:", err);
      setError("근로자 삭제 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      primaryContractor: "",
      subContractor: "",
      construction: "",
      safetyEducationCompleted: false,
      confidentialityAgreed: false,
      bloodPressureChecked: false,
    });
    setSelectedWorker(null);
    setIsEditing(false);
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">근로자 관리</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              원도급사
            </label>
            <input
              type="text"
              value={formData.primaryContractor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  primaryContractor: e.target.value,
                }))
              }
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              협력업체
            </label>
            <input
              type="text"
              value={formData.subContractor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subContractor: e.target.value,
                }))
              }
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공사/작업 내용
            </label>
            <input
              type="text"
              value={formData.construction}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  construction: e.target.value,
                }))
              }
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사진
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="input"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.safetyEducationCompleted}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    safetyEducationCompleted: e.target.checked,
                  }))
                }
                className="rounded text-primary-500 focus:ring-primary-500"
              />
              <span>안전교육 이수</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.confidentialityAgreed}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confidentialityAgreed: e.target.checked,
                  }))
                }
                className="rounded text-primary-500 focus:ring-primary-500"
              />
              <span>보안서약 동의</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bloodPressureChecked}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bloodPressureChecked: e.target.checked,
                  }))
                }
                className="rounded text-primary-500 focus:ring-primary-500"
              />
              <span>혈압 측정</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "수정" : "등록"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">근로자 목록</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전화번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  원도급사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  협력업체
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{worker.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.primaryContractor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.subContractor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          worker.safetyEducationCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        안전교육:{" "}
                        {worker.safetyEducationCompleted ? "완료" : "미완료"}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          worker.confidentialityAgreed
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        보안서약:{" "}
                        {worker.confidentialityAgreed ? "완료" : "미완료"}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                          worker.bloodPressureChecked
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        혈압측정:{" "}
                        {worker.bloodPressureChecked ? "완료" : "미완료"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedWorker(worker);
                        setFormData(worker);
                        setIsEditing(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerManagementPage;
