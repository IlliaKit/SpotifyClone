import React, { createContext, useState } from "react";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [trackData, setTrackData] = useState(null); 

  return (
    <AudioContext.Provider
      value={{ isPlaying, setIsPlaying, sound, setSound, trackData, setTrackData }}
    >
      {children}
    </AudioContext.Provider>
  );
};
