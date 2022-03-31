import logo from './logo.svg';
import './App.css';
import bgVideo from './video/bgVideo.mp4'
import awp from './image/awp.png'
import io from "socket.io-client";
import {useState} from "react";
import Entry from './components/entry';
import Chat from './components/chat';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


function App() {
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Entry/>}></Route>
        <Route exact path='/chat' element={<Chat/>}></Route>
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
