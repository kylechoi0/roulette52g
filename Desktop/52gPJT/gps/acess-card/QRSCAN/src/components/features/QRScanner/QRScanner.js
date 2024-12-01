import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRScanner = ({ onScan }) => {
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      onScan(result?.text);
    }
  };

  const handleError = (err) => {
    setError(err.message);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="aspect-square overflow-hidden rounded-lg">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            onError={handleError}
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 text-center text-gray-600">
          QR 코드를 스캔하세요
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
