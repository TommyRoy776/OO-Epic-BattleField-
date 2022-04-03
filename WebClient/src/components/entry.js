import '../App.css';
import bgVideo from '../video/bgVideo.mp4'
import awp from '../image/awp.png'
import io, { Socket } from "socket.io-client";
import { useState } from "react";
import {Link} from 'react-router-dom';

function Entry({Socket,username,setUsername}) {
  
  const joinChat = () =>{
    if(username !== ""){
       Socket.emit("join_room",username);
      // window.location.href='/chat'; 
    }
  }
  return (
    <header>
      <h1>OO Epic BattleField</h1>
      <input type="text" placeholder='username' onChange={
        (e) => {
          setUsername(e.target.value);
         // console.log(username);
        }} />
        <Link to = "/chat"  onClick={joinChat}>
          <img src={awp} />
        </Link>
    </header>
  )
}

export default Entry;