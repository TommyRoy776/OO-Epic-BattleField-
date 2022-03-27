import logo from './logo.svg';
import './App.css';
import bgVideo from './video/bgVideo.mp4'
import awp from './image/awp.png'
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001"); //connect to server

function App() {
  return (
    <div className="App">
      <header>
        <h1>OO Epic BattleField</h1>
        <button>
          <img src={awp}/>
      </button>
      </header>
      <div className="video-container">
        <div className="color-overlay"></div>
        <video autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default App;
