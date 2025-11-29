import React, { useRef, useEffect, useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
}) => {
  const modalRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Delay setting visibility to allow for transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "auto";
      };
    } else {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop/Overlay - Click to close */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ease-out ${
          isVisible ? "bg-opacity-20 opacity-100" : "bg-opacity-0 opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full z-50 transform transition-all duration-200 ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h3>
          </div>

          {/* Modal Body */}
          <div className="px-6 pb-4">{children}</div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {cancelText}
            </button>
            {onSubmit && (
              <button
                type="button"
                onClick={onSubmit}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {submitText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;