import logo from './logo.svg';
import './App.css';
import bgVideo from './video/bgVideo.mp4'
import awp from './image/awp.png'
import io from "socket.io-client";
import Entry from './components/entry';
import Chat from './components/chat';
import bgm from './music/theme.mp3'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import React, {useState,useEffect} from "react";

//const socket = io.connect("http://localhost:3001");

function App() {
  const [socket, setSocket] = useState();
  const [username, setUsername] = useState("");
  useEffect(() => {setSocket(io.connect(`http://${window.location.hostname}:3001`));console.log(window.location.hostname)},[])
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Entry Socket={socket} username={username} setUsername={setUsername}/>}></Route>
        <Route exact path='/chat' element={<Chat username="" Socket={socket} />}></Route>
      </Routes>
      <div className="video-container">
        <div className="color-overlay"></div>
        <video autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
    </Router>
  );
}

export default App;
