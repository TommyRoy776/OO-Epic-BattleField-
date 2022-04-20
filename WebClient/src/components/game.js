import '../App.css'
import React, { useEffect, useState, useRef } from "react";
import TeamA from '../image/survivor-shoot_rifle_2.png'
import TeamB from '../image/survivor-shoot_shotgun_2.png'



function Game({ charcter, Socket, playerId }) {
    const teamA = new Image();
    teamA.src = TeamA;

    class Player {

        constructor() {
            this.position = { x: 0, y: 0 }
            this.velocity = { x: 0, y: 0 }
            this.size = 80
            this.rotate = 0
            this.image = new Image();
        }
        create() {//create character on canvas
            let img = this.image;
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
            img.src = TeamA;
            let x = Math.round(window.innerWidth*Math.random())
            let y = Math.round(window.innerHeight*Math.random())
            img.onload = function () {

                ctx.drawImage(img, x, y, 80, 80);

            };
            this.position.x = x;
            this.position.y = y;
        }

        draw() { //everytime player moves, redraw it on canvas
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
            ctx.save();
            ctx.translate(
                this.position.x + this.size / 2,
                this.position.y + this.size / 2
            );
            ctx.rotate(this.rotate)
            ctx.translate(
                -this.position.x - this.size / 2,
                -this.position.y - this.size / 2
            );

            ctx.drawImage(this.image, this.position.x, this.position.y, 80, 80);
            ctx.restore();
        }

        update() { //update player status
            this.draw()
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
        }


    }

    class Bullet {
        constructor(x, y, radius, velocity, socket) {
            this.x = x
            this.y = y
            this.radius = radius
            this.velocity = velocity
            this.socket = socket
        }
        draw() {
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'black';
            ctx.fill();

        }

        update() {

            this.draw();
            this.x += this.velocity.x * 7
            this.y += this.velocity.y * 7
        }
    }

   //const [player, setPlayer] = useState({});
    //const [bullet,setBullet] = useState([]);

    //React ref for array of bullet, player,enemy and the keypress status 
    const bullet = useRef([]);
    const playerRef = useRef(null);
    const enemyRef = useRef(null);
    const keys = useRef({
        w: {
            pressed: false
        },
        s: {
            pressed: false
        },

        a: {
            pressed: false
        },
        d: {
            pressed: false
        }
    })

    const drawEnemy = (enemy) => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(
            enemy.position.x + enemy.size / 2,
            enemy.position.y + enemy.size / 2
        );
        ctx.rotate(enemy.rotate)
        ctx.translate(
            -enemy.position.x - enemy.size / 2,
            -enemy.position.y - enemy.size / 2
        );

        ctx.drawImage(teamA, enemy.position.x, enemy.position.y, 80, 80);
        ctx.restore();

    }


    const drawEnemyBullet = (bul) => {
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(bul.x, bul.y, bul.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        bul.x += bul.velocity.x * 7
        bul.y += bul.velocity.y * 7
    }



    const animate = () => { //refreshing animation on canvas
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clean all elements on the canvas
        fillCanvas();
        //players actions
        playerRef.current.update();
        if (enemyRef.current !== null) {
            drawEnemy(enemyRef.current);
        }

        if (keys.current.w.pressed && playerRef.current.position.y >= 0) {
            playerRef.current.velocity.y = -2;
      
        } else if (keys.current.s.pressed && playerRef.current.position.y + playerRef.current.size <= canvas.height) {
            playerRef.current.velocity.y = 2;
          
        } else {
            playerRef.current.velocity.y = 0;
       
        }

        if (keys.current.a.pressed && playerRef.current.position.x >= 0) {
            playerRef.current.velocity.x = -2;
        
        } else if (keys.current.d.pressed && playerRef.current.position.x + playerRef.current.size <= canvas.width) {
            playerRef.current.velocity.x = 2;
          
        } else {
            playerRef.current.velocity.x = 0;
    
        }


        Socket.emit('playerUpdate', playerRef.current) //update player movement to server
        bullet.current.forEach((bul, index) => { //update bullet position and delete out of range or hitted player bullets
            const dist = Math.hypot(bul.x - playerRef.current.position.x, bul.y - playerRef.current.position.y)
            if (bul.x + bul.radius > canvas.width || bul.x + bul.radius < 0 || bul.y + bul.radius < 0 || bul.y + bul.radius > canvas.height) {
                bullet.current.splice(index, 1);
            } 
            if (dist - bul.radius - playerRef.current.size / 2 < 1 ) {
                console.log("hit")
                Socket.emit("bulletRemove", index)
                Socket.emit("hit",Socket.id)

            }else {
                drawEnemyBullet(bul);
            }

        })

    }
    const fillCanvas = () => {// game background
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#DEB887";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const bulletlistener = (e) => { //trigger shooting
        const theX = playerRef.current.position.x + 72;
        const theY = playerRef.current.position.y + 60;
        const angle = Math.atan2(e.clientY - theY, e.clientX - theX)
        //console.log(angle)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        Socket.emit('bulletUpdate', new Bullet(theX, theY, 4, velocity, Socket.id));
        console.log(bullet.current);

    }

    const move = (e) => { //control movement
        switch (e.key) {
            case 'w':
                keys.current.w.pressed = true;
                break;
            case 's':
                keys.current.s.pressed = true;
                break;
            case 'a':
                keys.current.a.pressed = true;
                break;
            case 'd':
                keys.current.d.pressed = true;
                break;
        }
        
        
    }

    const rotation = (e) => { //player rotation
        const theX = playerRef.current.position.x + 72;
        const theY = playerRef.current.position.y + 60;
        const angle = Math.atan2(e.clientY - theY, e.clientX - theX)
        playerRef.current.rotate = angle;
    }

    const stopMove = (e) => {
        switch (e.key) {
            case 'w':

                playerRef.current.velocity.y = 0;
                keys.current.w.pressed = false;
                break;
            case 's':

                playerRef.current.velocity.y = 0;
                keys.current.s.pressed = false;
                break;

            case 'a':

                playerRef.current.velocity.x = 0;
                keys.current.a.pressed = false;
                break;
            case 'd':

                playerRef.current.velocity.x = 0;
                keys.current.d.pressed = false;
                break;


        }


    }



    useEffect(() => { //when the canvas loaded 
        console.log(playerId)
        const Theplayer = new Player();
        Theplayer.create();
        playerRef.current = Theplayer
        Socket.emit("newPlayer", playerRef.current); //initialize new player to everyone
        Socket.on("updatePlayers", (data) => { //load enemy
            console.log(`update ${data}`)
            for (let player in data) {
                console.log(player)
                if (player !== Socket.id) {
                    enemyRef.current = data[player]
                    drawEnemy(enemyRef.current)
                }
            }
        });
        const canvas = document.getElementById('canvas')
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.addEventListener("click", bulletlistener);
        window.addEventListener('keydown', move);
        window.addEventListener('keyup', stopMove);
        window.addEventListener('mousemove', rotation);
        fillCanvas();
        teamA.onload = function () { //start animation after teamA image loaded
            animate();
        }
    }, [])

    useEffect(() => {
        Socket.on("playermoved", (data) => {
            for (let player in data) {
                if (player !== Socket.id) {
                    enemyRef.current = data[player]
                }
            }
        })

    }, [Socket]); //listen to Socket change, get enemy info 

    useEffect(() => {
        Socket.on("bulletmoved", (data) => {
            bullet.current.push(data)
        })

    }, [Socket]); //listen to Socket change, tracing bullet movement  

    useEffect(() => {
        Socket.on("bulletRemoved", (data) => {
            bullet.current.splice(data, 1);
            console.log(`Bullet getting deleted: ${bullet.current[data]}`)
        })

    }, [Socket]); //listen to Socket change, remove bullets

    useEffect(() => {
        Socket.once("afterhit", (data) => {
            if(data === Socket.id){
               window.alert("Wasted")
            }else{
                window.alert("Mission passed respect+99")
            }
            window.open("/","_self");
        })

    }, [Socket]); //listen to Socket change, events of after one of the players getting hit  


    return (
        <canvas id="canvas">

        </canvas>
    )

}

export default Game;