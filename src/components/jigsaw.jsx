/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useImagePath } from '../imgeContext';

const DemoPuzzle = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const { imagePath } = useImagePath();
  const canvasRef = useRef(null);
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const img = useRef(new Image());

  async function fetchPieceData() {
    try {
      const response = await axios.get('http://localhost:3000/api/piece/');
      return response.data;
    } catch (error) {
      // Handle error, such as logging or displaying an error message
      console.error('Error fetching piece data:', error);
      return null;
    }
  }

  async function updateStatus() {
    const idxSearch = searchParams.get('pieceIndex');
    try {
      const response = await axios.put(
        `http://localhost:3000/api/piece/${idxSearch}`,
        { status: true }
      );
      console.log({ updateStatus: response.data });
      return response.data;
    } catch (error) {
      // Handle error, such as logging or displaying an error message
      console.error('Error fetching piece data:', error);
      return null;
    }
  }

  // will be fired when user scans a QR and visits this app
  useEffect(() => {
    // if query params present, only then run this effect
    // if (searchParams.get('sx')) return;
    const sx = searchParams.get('sx');
    const sy = searchParams.get('sy');
    const dx = searchParams.get('dx');
    const dy = searchParams.get('dy');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const pieceIndex = searchParams.get('pieceIndex');

    img.current.onload = async function () {
      // const rows = 2;
      // const cols = 2;
      // const pieceWidth = img.current.width / cols;
      // const pieceHeight = img.current.height / rows;
      await updateStatus();
      const piecesData = await fetchPieceData();
      const userData = calculateScores(piecesData);
      console.log({ userData });
      setUsers(userData);
      const newPieces = piecesData.map((piece) => ({
        sx: piece.sx,
        sy: piece.sy,
        dx: piece.dx,
        dy: piece.dy,
        width: piece.width,
        height: piece.height,
        pieceIndex: piece.index,
        status: piece.status,
      }));

      // Step to add  setPieces(newPieces);

      /**
      const newPieces = [];
      let pieceIndex = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          pieceIndex = pieceIndex++;

          const piece = {
            sx: x * pieceWidth,
            sy: y * pieceHeight,
            dx: x * pieceWidth,
            dy: y * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
            pieceIndex: pieceIndex,
          };

          newPieces.push(piece);
        }
      }
      setPieces(newPieces);

       */

      const idxSearch = searchParams.get('pieceIndex');
      drawPiece(idxSearch, newPieces);
    };

    img.current.src =
      'https://flbulgarelli.github.io/headbreaker/static/pettoruti.jpg';
  }, []);

  // if query params present, DO NOT RUN THIS EFFECT
  // useEffect(() => {
  //   if (searchParams.get('sx')) return;
  //   const newPieces = [];
  //   const fetchQrCodes = async () => {
  //     const fetchedData = await fetchPieceData();
  //     const qrImages = fetchedData.map((piece) => piece.qrLink);
  //     setQrCodes(qrImages);
  //     setPieces(newPieces);
  //   };

  //   fetchQrCodes();

  //   // img.current.onload = async function () {
  //   // const rows = 2;
  //   // const cols = 2;
  //   // const pieceWidth = img.current.width / cols;
  //   // const pieceHeight = img.current.height / rows;
  //   // const newPieces = [];
  //   // const newQrCodes = [];
  //   // let pieceIndex = 0; // Start pieceIndex at 0
  //   // for (let y = 0; y < rows; y++) {
  //   //   for (let x = 0; x < cols; x++) {
  //   //     const piece = {
  //   //       sx: x * pieceWidth,
  //   //       sy: y * pieceHeight,
  //   //       dx: x * pieceWidth,
  //   //       dy: y * pieceHeight,
  //   //       width: pieceWidth,
  //   //       height: pieceHeight,
  //   //       pieceIndex: pieceIndex++, // Increment pieceIndex after assigning
  //   //     };
  //   //     newPieces.push(piece);
  //   //     const searchParams = new URLSearchParams(piece);
  //   //     const qrData = `http://localhost:5173/?${searchParams.toString()}`;
  //   //     QRCode.toDataURL(qrData, (err, url) => {
  //   //       if (err) console.error(err);
  //   //       else {
  //   //         newQrCodes.push(url);
  //   //         if (newQrCodes.length === rows * cols) setQrCodes(newQrCodes);
  //   //       }
  //   //     });
  //   //   }
  //   // }
  //   // setPieces(newPieces);
  //   // drawPiece(0, newPieces);
  //   // };

  //   // img.current.src =
  //   //   'https://flbulgarelli.github.io/headbreaker/static/pettoruti.jpg';
  // }, [searchParams]);

  const calculateScores = (data) => {
    const userScores = {};

    data.forEach(({ username, status }) => {
      if (status) {
        if (userScores[username]) {
          userScores[username] += 1;
        } else {
          userScores[username] = 1;
        }
      }
    });

    return Object.entries(userScores).map(([username, score]) => ({
      username,
      score,
    }));
  };

  const drawPiece = (index, pieces) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through all pieces and draw them if their status is true
    pieces.forEach((piece) => {
      if (piece.status) {
        ctx.drawImage(
          img.current,
          piece.sx,
          piece.sy,
          piece.width,
          piece.height,
          piece.dx,
          piece.dy,
          piece.width,
          piece.height
        );
      }
    });

    /**
    if (index < pieces.length) {
      const piece = pieces[index];
      ctx.drawImage(
        img.current,
        piece.sx,
        piece.sy,
        piece.width,
        piece.height,
        piece.dx,
        piece.dy,
        piece.width,
        piece.height
      );
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
 */
  };

  const handleNextPiece = () => {
    const nextIndex = (currentPieceIndex + 1) % pieces.length;
    setCurrentPieceIndex(nextIndex);
    drawPiece(nextIndex, pieces);
  };

  const handleScan = (data) => {
    if (data) {
      try {
        const piece = JSON.parse(data);
        drawPieceByCoordinates(piece);
      } catch (err) {
        console.error('Error parsing QR code data:', err);
      }
    }
  };

  const drawPieceByCoordinates = (piece) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      img.current,
      piece.sx,
      piece.sy,
      piece.width,
      piece.height,
      piece.dx,
      piece.dy,
      piece.width,
      piece.height
    );
  };

  const handleError = (err) => {
    console.error(err);
  };

  console.log({ users });
  return (
    <div style={{ display: 'flex', marginTop: '30px', gap: '30px' }}>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          border: '2px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          maxWidth: '400px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          Leader Board
        </div>
        <div
          style={{
            display: 'flex',
            gap: '100px',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px',
            marginBottom: '10px',
          }}
        >
          <span>Username</span>
          <span>Score</span>
        </div>
        {users.length &&
          users.map((user, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                margin: '5px 0',
                padding: '5px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
              }}
            >
              <span>{user.username}</span>
              <span>{user.score}</span>
            </div>
          ))}
      </div>
      <canvas
        id="puzzleCanvas"
        ref={canvasRef}
        width="800"
        height="600"
        style={{ border: '1px solid black' }}
      ></canvas>
      {/* <button id="nextPieceButton" onClick={handleNextPiece}>
        Next Piece
      </button> */}
      <div>
        {/* {qrCodes.map((qrCode, index) => (
          <img key={index} src={qrCode} alt={`QR code for piece ${index}`} />
        ))} */}
        {/* <img key={index} src={qrCodes[0]} /> */}
      </div>
    </div>
  );
};

export default DemoPuzzle;
