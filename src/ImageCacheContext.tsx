import React, { createContext, useState, useContext } from "react";
import { getFile } from "./utils/imagesApi";

type ImageCacheType = {
  imageCache: Map<string, string>;
  getImage: (imagePath: string) => Promise<string>;
};

const ImageCacheContext = createContext<ImageCacheType | undefined>(undefined);

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState(new Map<string, string>());

  const getImage = async (imagePath: string): Promise<string> => {
    if (cache.has(imagePath)) {
      return cache.get(imagePath)!;
    }

    const imageUrl = await getFile(imagePath);
    setCache((prevCache) => new Map(prevCache).set(imagePath, imageUrl));

    return imageUrl;
  };

  return (
    <ImageCacheContext.Provider value={{ imageCache: cache, getImage }}>
      {children}
    </ImageCacheContext.Provider>
  );
};

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error("useImageCache must be used within an ImageCacheProvider");
  }
  return context;
};
