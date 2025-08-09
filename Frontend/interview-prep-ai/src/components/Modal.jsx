import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children, hideHeader }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal Box */}
      <div
        className="relative z-10 w-full max-w-md px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
          {!hideHeader && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-amber-500 hover:text-amber-700 text-2xl font-bold"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
