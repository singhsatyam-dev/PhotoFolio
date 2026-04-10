import styles from "./App.module.css";
import { useState } from "react";

// components imports
import { Navbar } from "./components/navbar/Navbar";
import { AlbumsList } from "./components/albumsList/AlbumsList";
import { ImagesList } from "./components/imagesList/ImagesList";

// react toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";

function App() {
  // Track selected album
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // When user clicks an album
  const handleAlbumClick = (albumName) => {
    setSelectedAlbum(albumName);
  };

  // Go back to albums
  const handleBack = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className={styles.App}>
      <ToastContainer />
      <Navbar />
      <div className={styles.content}>
        {!selectedAlbum ? (
          <AlbumsList onAlbumClick={handleAlbumClick} />
        ) : (
          <ImagesList albumName={selectedAlbum} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

export default App;
