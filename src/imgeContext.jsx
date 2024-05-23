/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

// Create a context for the image path
const ImageContext = createContext({});

// Create a provider component to wrap around other components
export const ImageProvider = ({ children }) => {
  const [imagePath, setImagePath] = useState(null); // Initial value is null

  const setImage = (path) => {
    setImagePath(path);
  };

  return (
    <ImageContext.Provider value={{ imagePath, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to access the image path and set it
export const useImagePath = () => useContext(ImageContext);
