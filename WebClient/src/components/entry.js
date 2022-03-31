import '../App.css';
import bgVideo from '../video/bgVideo.mp4'
import awp from '../image/awp.png'
import io from "socket.io-client";
import {useState} from "react";

function Entry(){
    const [username,setUsername] = useState("");
    return(
        <header>
        <h1>OO Epic BattleField</h1>
        <input type="text" placeholder='username' onChange={
          (e)=> {setUsername(e.target.value); 
          console.log(username);
        }}/>
        <button onClick={()=>{console.log('button clicked')}}>
          <img src={awp}/>
      </button>
      </header>
    )
}

export default Entry;