import '../App.css'
import React, { useEffect, useState,useRef } from "react";
import TeamA from '../image/survivor-shoot_rifle_2.png'
import TeamB from '../image/survivor-shoot_shotgun_2.png'



function Game({charcter,Socket,playerId}){
   const teamA = new Image();
   teamA.src = TeamA; 

    class Player{
    
        constructor(){
           this.position = {x:0,y:0}
           this.velocity = {x:0,y:0}
           this.size = 80
           this.rotate =0
           this.image = new Image();
        }
        create(){
            let img = this.image;
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
             img.src = TeamA; 
             img.onload = function() {
                ctx.drawImage(img,0, window.innerHeight/2,80,80);
                
            };
            this.position.x = 0;
            this.position.y = window.innerHeight/2;
        }
    
        draw(){
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
            ctx.save();
            ctx.translate(
                this.position.x + this.size/2,
                this.position.y + this.size/2
            );
            ctx.rotate(this.rotate)
            ctx.translate(
                -this.position.x - this.size/2,
                -this.position.y - this.size/2
            );
    
            ctx.drawImage(this.image,this.position.x, this.position.y,80,80);
            ctx.restore();
        }
    
        update(){
            this.draw()
            this.position.y += this.velocity.y
        }
    
     
    }
    
    class Bullet{
        constructor(x,y,radius,velocity){
           this.x = x
           this.y = y
           this.radius = radius
           this.velocity = velocity
        }
        draw(){
            let canvas = document.getElementById('canvas')
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            ctx.fillStyle = 'black';
            ctx.fill();
            
        }
    
        update(){
            
            this.draw();
            this.x += this.velocity.x*7
            this.y += this.velocity.y*7
        }
    }

    const [player,setPlayer] = useState({});
    //const [bullet,setBullet] = useState([]);
    const bullet = useRef([]);
    const playerRef = useRef(null);
    const enemyRef = useRef(null);
    const enemyBulletRef = useRef([]);
    const keys = useRef({
        w:{
            pressed:false
        },
        s:{
            pressed:false
        }
    })

    const drawEnemy = (enemy) =>{
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(
            enemy.position.x + enemy.size/2,
            enemy.position.y + enemy.size/2
        );
        ctx.rotate(enemy.rotate)
        ctx.translate(
            -enemy.position.x - enemy.size/2,
            -enemy.position.y - enemy.size/2
        );

        ctx.drawImage(teamA,enemy.position.x, enemy.position.y,80,80);
        ctx.restore();
        
    }


    const drawEnemyBullet = (bul) =>{
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(bul.x,bul.y,bul.radius,0,Math.PI*2,false);
        ctx.fillStyle = 'black';
        ctx.fill();
    }


   
    const animate = () =>{
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        fillCanvas();
        //players actions
        playerRef.current.update();
        if(enemyRef.current !== null){
            drawEnemy(enemyRef.current);
        }
      
        if(keys.current.w.pressed && playerRef.current.position.y >= 0){
            playerRef.current.velocity.y = -2;
            //playerRef.current.rotate = -0.15;
        }else if(keys.current.s.pressed && playerRef.current.position.y+playerRef.current.size <= canvas.height){
            playerRef.current.velocity.y = 2;
            //playerRef.current.rotate = 0.15;
        }else{
            playerRef.current.velocity.y = 0;
           // playerRef.current.rotate = 0;
        }

        Socket.emit('playerUpdate', playerRef.current)
        bullet.current.forEach((bul,index) => { //update bullet position and delete out of range bullets
          if(bul.x+bul.radius > canvas.width || bul.x+bul.radius < 0 || bul.y+bul.radius <0 || bul.y+bul.radius > canvas.height){
               bullet.current.splice(index,1);
          }else{
            bul.update();
          }

          enemyBulletRef.current.forEach((bul,index)=>{
            drawEnemyBullet(bul);
          })
          Socket.emit('bulletUpdate',bullet.current);
         
        })

    }
    const fillCanvas = () =>{
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#DEB887";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

     const bulletlistener = (e) =>{
         const theX = playerRef.current.position.x+72;
         const theY =  playerRef.current.position.y+60;
         const angle = Math.atan2(e.clientY - theY,e.clientX - theX)
         //console.log(angle)
         const velocity = {
             x:Math.cos(angle),
             y:Math.sin(angle)
         }
         bullet.current.push(new Bullet(theX,theY,4,velocity))
         console.log(bullet.current);
        
     }

     const move = (e) =>{ //control movement
        switch(e.key){
          case 'w':
              keys.current.w.pressed = true;
              break;
          case 's':
            keys.current.s.pressed = true;
              break;
        }
     }

     const rotation = (e) =>{
        const theX = playerRef.current.position.x+72;
        const theY =  playerRef.current.position.y+60;
        const angle = Math.atan2(e.clientY - theY,e.clientX - theX)
        playerRef.current.rotate = angle;
     }

     const stopMove = (e) =>{
        switch(e.key){
          case 'w':
              
              playerRef.current.velocity.y = 0;
              keys.current.w.pressed = false;
              break;
          case 's':
      
            playerRef.current.velocity.y = 0;
            keys.current.s.pressed = false;
              break;
        }
     }

     

    useEffect(()=>{ //when the canvas onload 
        console.log(playerId)
         const Theplayer = new Player(); 
         Theplayer.create();
         setPlayer(Theplayer);
         playerRef.current =  Theplayer
         console.log(playerRef.current);
         Socket.emit("newPlayer",playerRef.current);
         Socket.on("updatePlayers", (data) => {
            console.log("update")
            for(let player in data){
               if(player !== Socket.id){
                   enemyRef.current = data[player]
               }
            }
            drawEnemy(enemyRef.current)
        });
         const canvas = document.getElementById('canvas')
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
         //setBullet(pre => [...pre,thebullet]);
         canvas.addEventListener("click", bulletlistener);
         window.addEventListener('keydown',move);
         window.addEventListener('keyup',stopMove);
         window.addEventListener('mousemove',rotation);
         fillCanvas();
         teamA.onload = function(){
            animate();
         }
    },[])

  
 

    useEffect(() => {
        Socket.on("playermoved",(data)=>{
            console.log("moving")
            for(let player in data){
               if(player !== Socket.id){
                   enemyRef.current = data[player]
               }
            }
        })
      
    }, [Socket]); //listen to Socket change 
    

    return( 
    <canvas id="canvas">
     
    </canvas>
    )
 
}

export default Game;