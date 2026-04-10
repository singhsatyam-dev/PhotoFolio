import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { AlbumForm } from "../albumForm/AlbumForm";
import { toast } from "react-toastify";

export const AlbumsList = ({ onAlbumClick }) => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [albumAddLoading, setAlbumAddLoading] = useState(false);
  // create function to get all the album from the firebase.
  const [showForm, setShowForm] = useState(false);
  // create function to handle adding of the album

  //fetch all albums
  const getAlbums = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "albums"));

      const albumData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAlbums(albumData);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  //add new album
  const handleAddAlbum = async (albumName) => {
    try {
      setAlbumAddLoading(true);

      await addDoc(collection(db, "albums"), {
        name: albumName,
        createdAt: new Date(),
      });

      toast.success("Album created successfully");

      getAlbums();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding album:", error);
      toast.error("Failed to create album");
    } finally {
      setAlbumAddLoading(false);
    }
  };

  //fetch on mount
  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <>
      <div>
        {/* Add Album Button */}
        <button onClick={() => setShowForm(true)}>Add album</button>

        {/* Show Form */}
        {showForm && (
          <AlbumForm
            onAdd={handleAddAlbum}
            onCancel={() => setShowForm(false)}
            loading={albumAddLoading}
          />
        )}

        {/* Loading */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {albums.map((album) => (
              <div key={album.id} onClick={() => onAlbumClick(album.name)}>
                <h3>{album.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
