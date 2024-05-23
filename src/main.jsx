import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ImageProvider } from './imgeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ImageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ImageProvider>
  </React.StrictMode>
);
