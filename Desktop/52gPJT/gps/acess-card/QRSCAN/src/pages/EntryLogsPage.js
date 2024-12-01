import React from "react";
import EntryLogs from "../components/features/EntryLogs/EntryLogs";

const EntryLogsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">출입 기록 관리</h1>
      <EntryLogs />
    </div>
  );
};

export default EntryLogsPage;
