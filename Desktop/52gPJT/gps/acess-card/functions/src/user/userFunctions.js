const functions = require("firebase-functions");
const admin = require("firebase-admin");

const convertTimestampToISOString = (timestamp) => {
  if (!timestamp) return null;

  // Timestamp 객체인 경우
  if (timestamp?.toDate instanceof Function) {
    return timestamp.toDate().toISOString();
  }

  // Date 객체인 경우
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  // ISO 문자열인 경우
  if (typeof timestamp === "string") {
    try {
      return new Date(timestamp).toISOString();
    } catch (error) {
      console.error("Date conversion error:", error);
      return null;
    }
  }

  return null;
};

exports.getUserInfo = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    try {
      // 1. 데이터 검증
      if (!data.userId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "사용자 ID가 필요합니다."
        );
      }

      // 2. 사용자 정보 조회
      const workerDoc = await admin
        .firestore()
        .collection("workers")
        .doc(data.userId)
        .get();

      if (!workerDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "사용자를 찾을 수 없습니다."
        );
      }

      const userData = workerDoc.data();

      // Timestamp를 ISO string으로 변환
      const convertTimestampToISOString = (timestamp) => {
        if (!timestamp) return null;
        return timestamp.toDate ? timestamp.toDate().toISOString() : null;
      };

      // 3. 응답 반환
      return {
        status: "SUCCESS",
        message: "사용자 정보를 성공적으로 조회했습니다.",
        data: {
          ...userData,
          docId: workerDoc.id,
          safetyEducationDate: convertTimestampToISOString(
            userData.safetyEducationDate
          ),
          entryEndDate: convertTimestampToISOString(userData.entryEndDate),
          updatedAt: convertTimestampToISOString(userData.updatedAt),
          createdAt: convertTimestampToISOString(userData.createdAt),
        },
      };
    } catch (error) {
      console.error("[getUserInfo]", error);
      throw new functions.https.HttpsError(
        "internal",
        "사용자 정보 조회 중 오류가 발생했습니다."
      );
    }
  });

exports.updateUserVehicle = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    try {
      // 1. 데이터 검증
      if (!data.userId || !data.vehicleInfo) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "필수 파라미터가 누락되었습니다."
        );
      }

      // 2. 차량 정보 업데이트
      const vehicleData =
        typeof data.vehicleInfo === "string"
          ? data.vehicleInfo
          : `${data.vehicleInfo.license} (${data.vehicleInfo.type})`;

      await admin.firestore().collection("workers").doc(data.userId).update({
        vehicle: vehicleData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. 응답 반환
      return {
        status: "SUCCESS",
        message: "차량 정보가 업데이트되었습니다.",
        data: { vehicle: vehicleData },
      };
    } catch (error) {
      console.error("[updateUserVehicle]", error);
      throw new functions.https.HttpsError(
        "internal",
        "차량 정보 업데이트 중 오류가 발생했습니다."
      );
    }
  });

exports.updateUserCompany = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    try {
      // 1. 데이터 검증
      if (!data.userId || !data.company) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "필수 파라미터가 누락되었습니다."
        );
      }

      // 2. 회사 정보 업데이트
      await admin.firestore().collection("workers").doc(data.userId).update({
        subCompany: data.company,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. 응답 반환
      return {
        status: "SUCCESS",
        message: "소속 정보가 업데이트되었습니다.",
        data: { subCompany: data.company },
      };
    } catch (error) {
      console.error("[updateUserCompany]", error);
      throw new functions.https.HttpsError(
        "internal",
        "소속 정보 업데이트 중 오류가 발생했습니다."
      );
    }
  });

exports.updateSafetyEducation = functions
  .region("asia-northeast3")
  .https.onCall(async (data, context) => {
    try {
      // 1. 데이터 검증
      if (!data.userId || !data.qrValue) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "필수 파라미터가 누락되었습니다."
        );
      }

      // 2. QR 코드 검증
      const today = new Date().toISOString().split("T")[0];
      const expectedQRValue = `safety_${today}`;

      if (data.qrValue !== expectedQRValue) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "유효하지 않은 QR 코드입니다."
        );
      }

      // 3. 안전교육 정보 업데이트
      await admin.firestore().collection("workers").doc(data.userId).update({
        safetyEducationCompleted: true,
        safetyEducationDate: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 4. 응답 반환
      return {
        status: "SUCCESS",
        message: "안전교육 인증이 완료되었습니다.",
        data: {
          safetyEducationCompleted: true,
          safetyEducationDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("[updateSafetyEducation]", error);
      throw new functions.https.HttpsError(
        "internal",
        "안전교육 인증 중 오류가 발생했습니다."
      );
    }
  });
