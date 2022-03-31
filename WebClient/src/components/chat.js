import io from "socket.io-client";
import React, {useState,useEffect} from "react";

function Chat(){
    useEffect(() => {const socket = io.connect("http://localhost:3001");},[])
    return(
        <React.Fragment>
         <div className="chat-container">
           <div className="chat-header">
              <p>OO Chat Room</p>
           </div>
           <div className="chat-body">

           </div>
           <div className="chat-footer">
               <input
                type="text"
                placeholder="Type something nice..."
               >
                 
               </input>
               <button></button>
           </div>
         </div>
        </React.Fragment>
    )
}

export default Chat;