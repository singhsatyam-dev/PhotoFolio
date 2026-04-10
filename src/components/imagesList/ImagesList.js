import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export const ImagesList = ({ albumName, onBack }) => {
  //These state and functions are create just for your convience you can create modify or delete the state as per your requirement.
  const [images, setImages] = useState([]);
  const [allImages, setAllImages] = useState([]); // for search
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const searchInput = useRef();
  // async function
  const getImages = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "images"),
        where("albumName", "==", albumName),
      );

      const querySnapshot = getDocs(q);

      const imageData = (await querySnapshot).docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageData);
      setAllImages(imageData);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

  useEffect(() => {
    if (albumName) getImages();
  }, [albumName]);

  // function to handle toggle next image
  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };
  // function to handle toggle previous image
  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  // function to handle cancel
  const handleCancel = () => {
    setActiveImageIndex(null);
  };
  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent((prev) => !prev);

    if (searchIntent) {
      setImages(allImages);
      searchInput.input.value = "";
    }
  };
  // function to handle search functionality for image
  const handleSearch = async () => {
    try {
      const text = searchInput.current.value.toLowerCase();

      const filtered = allImages.filter((img) => {
        img.title.toLowerCase().includes(text);
      });

      setImages(filtered);
    } catch (error) {
      console.error("Error adding image:", error);
    } finally {
      setImgLoading(false);
    }
  };

  // async functions
  const handleAdd = async ({ title, url }) => {
    try {
      setImgLoading(true);

      await addDoc(collection(db, "images"), {
        title,
        url,
        albumName,
      });

      toast.success("Image added successfully");

      getImages();
      setAddImageIntent(false);
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Failed to add image");
    } finally {
      setImgLoading(false);
    }
  };
  // function to handle update image
  const handleUpdate = async ({ title, url }) => {
    try {
      setImgLoading(true);

      const imageRef = doc(db, "images", updateImageIntent.id);

      await updateDoc(imageRef, { title, url });

      toast.success("Image updated successfully");

      getImages();
      setUpdateImageIntent(null);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    } finally {
      setImgLoading(false);
    }
  };
  // function to handle delete image
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "images", id));
      toast.success("Image deleted successfully");
      getImages();
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to delete image");
    } finally {
      setImgLoading(false);
    }
  };

  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={onBack}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAdd}
            albumName={albumName}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {albumName}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}
        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>
              <div
                className={`${styles.delete} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
