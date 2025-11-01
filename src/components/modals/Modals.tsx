import React from "react";
import "./modals.css";

export const DeleteAccountModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Delete Account</h2>
      <p className="modal-text">
        Are you sure you want to delete your account? This action is
        irreversible.
      </p>
      <div className="modal-buttons">
        <button onClick={onConfirm} className="modal-button confirm">
          Confirm
        </button>
        <button onClick={onCancel} className="modal-button cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export const SessionExpiredModal: React.FC<{
  onConfirm: () => void;
}> = ({ onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Session Expired</h2>
      <p className="modal-text">
        Your session has expired. Please log in again.
      </p>
      <button onClick={onConfirm} className="modal-button confirm">
        OK
      </button>
    </div>
  </div>
);

export const ErrorDeleteModal: React.FC<{
  onConfirm: () => void;
}> = ({ onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Error</h2>
      <button onClick={onConfirm} className="modal-button confirm">
        OK
      </button>
    </div>
  </div>
);
