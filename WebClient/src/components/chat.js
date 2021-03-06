import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import '../App.css';
import bgm from '../music/theme.mp3';


function Chat({ username, Socket }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: "room",
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await Socket.emit("send_message", messageData); //wait for socket finished transmission
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        Socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [Socket]); //listen to Socket change 

    return (
        <React.Fragment>

            <audio autoplay loop>
                <source src={bgm} type="audio/mpeg" />
            </audio>
            <div className="chat-window">
                <div className="chat-header">
                    <p>Chat room: {username}</p>
                </div>
                <div className="chat-body">
                    {messageList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={username === messageContent.author ? "you" : "other"}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value = {currentMessage}
                        placeholder="Type something nice..."
                        onChange={(e) => {
                            setCurrentMessage(e.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    >

                    </input>
                    <button onClick={sendMessage}>&#9658;</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Chat;