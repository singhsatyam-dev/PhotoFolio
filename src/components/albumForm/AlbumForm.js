import styles from "./albumForm.module.css";
import { useRef } from "react";

export const AlbumForm = ({ loading, onAdd, onCancel }) => {
  const albumNameInput = useRef();

  // function  to handle the clearing of the form
  const handleClear = () => {
    albumNameInput.current.value = "";
  };

  // function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const albumName = albumNameInput.current.value.trim();

    if (!albumName) return;

    onAdd(albumName);

    //clear input after submit
    albumNameInput.current.value = "";
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear} disabled={loading}>
          Clear
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button disabled={loading}>Create an Album</button>
      </form>
    </div>
  );
};
