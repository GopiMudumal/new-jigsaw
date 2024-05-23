/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useImagePath } from '../imgeContext';
import axios from 'axios';

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setImage, imagePath } = useImagePath();

  const [pieces, setPieces] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const imgRef = useRef(null);
  const usernames = ['gopi', 'varsha', 'abhijeet', 'Madhu'];

  async function postData(payload) {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/piece/save',
        payload
      );
      return response.data;
    } catch (error) {
      // Handle error, such as logging or displaying an error message
      console.error('Error fetching piece data:', error);
      return null;
    }
  }

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
          const username = usernames[pieceIndex % usernames.length];
          const piece = {
            sx: x * pieceWidth,
            sy: y * pieceHeight,
            dx: x * pieceWidth,
            dy: y * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
            username: username,
            pieceIndex: pieceIndex++, // Increment pieceIndex after assigning
          };
          newPieces.push(piece);
          const searchParams = new URLSearchParams(piece);
          const qrData = `http://localhost:5173/?${searchParams.toString()}`;
          QRCode.toDataURL(qrData, async (err, url) => {
            if (err) console.error(err);
            else {
              const payload = {
                sx: piece.sx,
                sy: piece.sy,
                dx: piece.dx,
                dy: piece.dy,
                width: piece.width,
                height: piece.height,
                username: piece.username,
                index: piece.pieceIndex,
                status: piece.status,
              };
              //  const data =  await postData(payload);
              //  console.log({dataPost:data})
              newQrCodes.push(url);
              if (newQrCodes.length === rows * cols) setQrCodes(newQrCodes);
            }
          });
        }
      }
    //   console.log({ newPieces, newQrCodes });
      setPieces(newPieces);
    };
    // imgRef.current.src = imagePath;
    imgRef.current.src =
      'https://flbulgarelli.github.io/headbreaker/static/pettoruti.jpg';
  }, []);

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
      {/* <input type="file" accept="image/*" onChange={handleImageSelect} /> */}
      <div>
        <Link to="/admin">Admin</Link>
        <br />
        <Link to="http://localhost:5173/?sx=250&sy=409&dx=250&dy=409&width=250&height=409&pieceIndex=1">
          Demo
        </Link>
      </div>
      <br />
      <br />
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
