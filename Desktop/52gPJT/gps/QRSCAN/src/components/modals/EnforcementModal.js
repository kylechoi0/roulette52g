import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

const EnforcementModal = () => {
  const { state, toggleModal } = useApp();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    toggleModal("enforcement", false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement enforcement submission logic
      console.log("Enforcement submitted:", { location, description });
      handleClose();
    } catch (error) {
      console.error("Error submitting enforcement:", error);
    }
  };

  if (!state.modals.enforcement?.isOpen) return null;

  return (
    <Modal isOpen={true} onClose={handleClose} title="단속하기">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="단속 위치"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="단속 위치를 입력하세요"
            required
          />
          <Input
            label="단속 내용"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="단속 내용을 입력하세요"
            required
            multiline
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit">등록</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EnforcementModal;
