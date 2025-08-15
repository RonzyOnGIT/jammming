import styles from './Toast.module.css';

const Toast = ({ status, show }) => {

  return (
    <div className={`${styles.toastContainer} ${show ? styles.show : ""} ${status === "success" ? styles.success : styles.fail}`}>
      <p>{status === "success" ? "Playlist created!" : "Failed to create playlist"}</p>
    </div>
  );
  
};

export default Toast;