import logo from './logo.svg';
import './App.css';
import bgVideo from './video/bgVideo.mp4'
import awp from './image/awp.png'
import io, { Socket } from "socket.io-client";
import Entry from './components/entry';
import Chat from './components/chat';
import bgm from './music/theme.mp3'
import Game from './components/game'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


import React, {useState,useEffect} from "react";

//const socket = io.connect("http://localhost:3001");

function App() {
  const [socket, setSocket] = useState();
  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState(0);

  useEffect( async() => {
  let temp = io.connect(`http://${window.location.hostname}:3001`)
  setSocket(temp);
  console.log(window.location.hostname)
  await temp.emit("requestID")
  temp.on("sendID", async (data) => {
    setPlayerId(data);
  })       
},[])


  return (
  <Router>
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Entry Socket={socket} username={username} setUsername={setUsername} playerId = {playerId}/>}></Route>
        <Route exact path='/chat' element={<Chat username={username} Socket={socket} />}></Route>
        <Route exact path='/game' element={<Game playerId={playerId} username={username} Socket={socket}/>}></Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
