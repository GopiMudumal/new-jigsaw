/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useImagePath } from '../imgeContext';

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setImage, imagePath } = useImagePath();

  const [pieces, setPieces] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const imgRef = useRef(null);

  // Function to handle image selection
  //   const handleImageSelect = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = function (event) {
  //         imgRef.current.src = event.target.result;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  useEffect(() => {
    const newPieces = [];
    imgRef.current = new Image();
    imgRef.current.onload = async function () {
      const rows = 2;
      const cols = 2;
      const pieceWidth = imgRef.current.width / cols;
      const pieceHeight = imgRef.current.height / rows;
      const newPieces = [];
      const newQrCodes = [];
      let pieceIndex = 0; // Start pieceIndex at 0
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const piece = {
            sx: x * pieceWidth,
            sy: y * pieceHeight,
            dx: x * pieceWidth,
            dy: y * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
            pieceIndex: pieceIndex++, // Increment pieceIndex after assigning
          };
          newPieces.push(piece);
          const searchParams = new URLSearchParams(piece);
          const qrData = `http://localhost:5173/?${searchParams.toString()}`;
          QRCode.toDataURL(qrData, (err, url) => {
            if (err) console.error(err);
            else {
              newQrCodes.push(url);
              if (newQrCodes.length === rows * cols) setQrCodes(newQrCodes);
            }
          });
        }
      }
      console.log({ newPieces, newQrCodes });
      setPieces(newPieces);
    };
    imgRef.current.src = imagePath;
  }, [searchParams, imagePath]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imagePath = event.target.result;
        setImage(imagePath); // Set the image path using setImage function from the context
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageSelect} />
      <br />
      {imgRef.current && (
        <img
          src={imgRef.current.src}
          alt="Selected Image"
          style={{ maxWidth: '100%', maxHeight: '300px' }}
        />
      )}
      <br />
      {qrCodes.map((qrCode, index) => (
        <div key={index}>
          <img src={qrCode} alt={`QR Code ${index}`} />
        </div>
      ))}
    </div>
  );
}

export default Admin;
