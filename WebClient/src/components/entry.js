import '../App.css';
import bgVideo from '../video/bgVideo.mp4'
import awp from '../image/awp.png'
import io, { Socket } from "socket.io-client";
import React, { useState } from "react";
import {Link} from 'react-router-dom';
import Background from './background';
import Game from './game';

function Entry({Socket,username,setUsername}) {
  
  const joinChat = () =>{
       Socket.emit("join_room",username);
      // window.location.href='/chat'; 
  }
  return (
    <React.Fragment>
     <header>
      <h1>OO Epic BattleField</h1>
      <input type="text" placeholder='username' value={username} onChange={
        (e) => {
          setUsername(e.target.value);
         // console.log(username);
        }} />
        <Link to = {/*username !== "" ? "/chat": "/"*/  username !== "" ? "/game": "/"}  onClick={joinChat}>
          <img src={awp} />
        </Link>
        
    </header>
    <Background/>
    </React.Fragment>
 
  )
}

export default Entry;