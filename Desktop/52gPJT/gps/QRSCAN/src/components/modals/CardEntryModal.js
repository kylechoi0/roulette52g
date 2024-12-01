import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../configuration/firebaseConfig";

const CardEntryModal = ({ onClose }) => {
  const [scanning, setScanning] = useState(true);

  const handleScan = async (data) => {
    if (data) {
      try {
        // QR 코드에서 workerId 추출
        const workerId = data.text; // QR 코드 형식에 따라 파싱 로직 조정 필요

        // records 컬렉션에 출입 기록 저장
        const recordData = {
          workerId,
          workStatus: "CHECKIN", // 기본값으로 CHECKIN 설정
          createdAt: Timestamp.now(),
          entryType: "CARD",
          deviceId: "CARD_READER_01",
        };

        await addDoc(collection(db, "records"), recordData);

        setScanning(false);
        alert("출입이 정상적으로 처리되었습니다.");
        onClose();
      } catch (error) {
        console.error("출입 기록 저장 중 오류 발생:", error);
        alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
    alert("QR 스캔 중 오류가 발생했습니다.");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">QR 코드 스캔</h2>
      {scanning && (
        <QrReader
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          className="w-full"
        />
      )}
    </div>
  );
};

export default CardEntryModal;
