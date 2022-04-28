import '../App.css';
import bgVideo from '../video/bgVideo.mp4'
import awp from '../image/awp.png'
import io, { Socket } from "socket.io-client";
import {Link} from 'react-router-dom';
import Background from './background';
import Game from './game';
import React, { useEffect, useState,useRef } from "react";

function Entry({Socket,username,setUsername,playerId}) {
  
  const joinChat = async () =>{
       Socket.emit("join_room",username);
       console.log(`My player id ${playerId}`)
    
      // window.location.href='/chat'; 
  }
  


  return (
    <React.Fragment>
     <header>
      <h1>OO Epic BattleField</h1>
      <input type="text" placeholder='username' value={username} onChange={
        async (e) => {
          setUsername(e.target.value);
          await Socket.emit("requestID",username);
          Socket.on("sendID", (data) => {
         })       
         // console.log(username);
        }} />
        <Link to = { username !== "" ? "/game": "/"}  onClick={joinChat}>
          <img src={awp} />
        </Link>
        
    </header>
    <Background/>
    </React.Fragment>
 
  )
}

export default Entry;