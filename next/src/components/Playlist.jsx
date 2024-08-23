// components/Playlist.js
import React from "react";
import YouTube from "react-youtube";
import styles from "./styles.module.css";

const Playlist = ({ videos }) => {
  const currentVideo = videos[0].id;

  return (
    <div>
      <div className="player">
        <p className="flex-1 mt-[16px] font-normal text-[18px] text-[#b0b0b0] leading-[32px]">
          My vibe
        </p>
        <YouTube videoId={currentVideo} className={styles.youtube} />
      </div>
    </div>
  );
};

export default Playlist;
