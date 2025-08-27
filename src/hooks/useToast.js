// hooks/useToast.js
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  const showError = useCallback((message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  const showLoading = useCallback((message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options,
    });
  }, []);

  const updateToast = useCallback((toastId, options) => {
    toast.update(toastId, options);
  }, []);

  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast,
    dismissToast,
  };
};