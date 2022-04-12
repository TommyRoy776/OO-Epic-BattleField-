import '../App.css'
import bgVideo from '../video/bgVideo.mp4'
import bgm from '../music/theme.mp3'
import React, { useEffect, useState,useRef } from "react";


function Background(){
   return(
        <div className="video-container">
          <iframe src={bgm} type="audio/mp3" allow="autoplay" id="audio" style={{display:'none'}}></iframe>
          <audio autoPlay>
            <source src={bgm} type="audio/mp3"/>
        </audio>
        <div className="color-overlay"></div>
        <video autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
   )
}

export default Background;