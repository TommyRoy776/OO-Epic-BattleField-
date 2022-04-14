import '../App.css'
import bgVideo from '../video/bgVideo.mp4'
import bgm from '../music/theme.mp3'
import React, { useEffect, useState,useRef } from "react";


function Background(){
   return(
        <div className="video-container">
         
        <div className="color-overlay"></div>
        <video autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
   )
}

export default Background;