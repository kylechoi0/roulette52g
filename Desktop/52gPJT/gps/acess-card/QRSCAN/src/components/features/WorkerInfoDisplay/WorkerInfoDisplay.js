import React from "react";

const WorkerInfoDisplay = ({ worker }) => {
  if (!worker) return null;

  const {
    name,
    phoneNumber,
    primaryContractor,
    subContractor,
    construction,
    safetyEducationCompleted,
    confidentialityAgreed,
    bloodPressureChecked,
    photoUrl,
  } = worker;

  const StatusBadge = ({ completed, label }) => (
    <div
      className={`px-3 py-1 rounded-full text-sm ${
        completed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {label}: {completed ? "완료" : "미완료"}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-start space-x-4">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-600">{phoneNumber}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              원도급사: {primaryContractor}
            </p>
            <p className="text-sm text-gray-600">협력업체: {subContractor}</p>
            <p className="text-sm text-gray-600">공사내용: {construction}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <StatusBadge completed={safetyEducationCompleted} label="안전교육" />
        <StatusBadge completed={confidentialityAgreed} label="보안서약" />
        <StatusBadge completed={bloodPressureChecked} label="혈압측정" />
      </div>
    </div>
  );
};

export default WorkerInfoDisplay;
