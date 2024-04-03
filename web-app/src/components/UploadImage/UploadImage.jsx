import React from "react";
import { useState, useEffect } from "react";
import { storage, db } from "../../firebase/FirebaseConfigImage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ref as refren, push } from "firebase/database";

import { RiCloseFill } from "react-icons/ri";

import "./UploadImage.css";

const UploadImage = ({
  eventId,
  hasPickedAnImage,
  hasSentAnImage,
  hasSentAnImageStatus,
}) => {
  const [selectedImages, setSelectedImages] = useState(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const updatedSelectedImages = [];

    for (let i = 0; i < files.length; i++) {
      updatedSelectedImages.push(files[i]);
    }

    setSelectedImages(updatedSelectedImages);

    hasPickedAnImage();
  };

  const handleRemoveImage = () => {
    setSelectedImages(null);
  };

  const handleUpload = async () => {
    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const imageRef = ref(storage, image.name);

        try {
          const snapshot = await uploadBytes(imageRef, image);
          const downloadUrl = await getDownloadURL(snapshot.ref);

          const imagesRef = refren(db, "/images");
          push(imagesRef, {
            eventId: eventId,
            imageUrl: downloadUrl,
            timestamp: new Date().getTime(),
          });
        } catch (e) {
          console.log("error uploading image:", e);
        }
      }
      hasSentAnImage();
      console.log("Succès ! L'image est bien en base de donnée !");
    } else {
      console.error("No images selected");
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "#F9FAFF",
          width: "100%",
          aspectRatio: "16/9",
          alignItems: "center",
          justifyContent: "center",
          border: selectedImages ? "none" : "2.5px #83ADFF dashed",
          borderRadius: "15px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <input
          type="file"
          id="file-5"
          className="inputfile inputfile-4"
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="file-5">
          <figure>
            <svg
              width="42"
              height="34"
              viewBox="0 0 42 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1.5"
                y="1.5"
                width="39"
                height="31"
                rx="1.5"
                stroke="white"
                strokeWidth="3"
              />
              <path
                d="M1.5 28.5L9.43225 17.3777L17 27L28 13.5L40.5 27.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="11" cy="10" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </figure>{" "}
          <span>Télécharger une image</span>
        </label>

        {selectedImages && (
          <>
            {selectedImages.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Image sélectionnée ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    color: "white",
                    border: "none",
                    padding: "2px",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RiCloseFill
                    style={{
                      color: "#83ADFF",
                      fontWeight: "700",
                    }}
                    size={30}
                  />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      {selectedImages && hasSentAnImageStatus === false && (
        <button
          type="button"
          style={{
            padding: "15px 20px",
            backgroundColor: "#83ADFF",
            borderRadius: "30px",
            border: "none",
            fontWeight: "700",
            color: "white",
          }}
          onClick={handleUpload}
        >
          Valider cette image
        </button>
      )}
    </div>
  );
};

export default UploadImage;
