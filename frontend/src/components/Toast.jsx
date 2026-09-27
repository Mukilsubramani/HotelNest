// Small popup toast notification component
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/hotelSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const { visible, message, type } = useSelector((state) => state.hotels.toast);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div className={`toast-container toast-${type}`}>
      <span className="toast-icon">{type === 'success' ? '✅' : '⚠️'}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => dispatch(hideToast())}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
