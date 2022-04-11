import '../App.css'
import React, { useEffect, useState,useRef } from "react";
import TeamA from '../image/survivor-shoot_rifle_2.png'
import TeamB from '../image/survivor-shoot_shotgun_2.png'


class Player{
    
    constructor(){
       this.x=0
       this.y=0
    }
    create(){
        let img = new Image();
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d');
         img.src = TeamA; 
         img.onload = function() {
            ctx.drawImage(img,0, canvas.height/2,80,80);
            
        };
        this.x = 0;
        this.y = window.innerHeight/2;
      
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
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
function Game({charcter}){
    
    const [player,setPlayer] = useState({});
    const [bullet,setBullet] = useState([]);
    const canvas = document.getElementById('canvas')
  

    const animate = () =>{
        
        requestAnimationFrame(animate);
       // console.log('go')
        /*thebullet.draw();
        thebullet.update();*/
        //console.log(bullet)
        bullet.forEach((bul) => {
          bul.update();
         
        })

    }
    const fillCanvas = () =>{
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#DEB887";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const shoot = (e) =>{
        
        console.log(player)
        const x = e.clientX 
        const y = e.clientY 
       
    }
    
    const listener = (e) =>{
        shoot(e) 
     }

     const bulletlistener = (e) =>{
         const theX = player.x+72;
         const theY =  player.y+60;
         const angle = Math.atan2(e.clientY - player.y,e.clientX - player.x)
         console.log(angle)
         const velocity = {
             x:Math.cos(angle),
             y:Math.sin(angle)
         }
        setBullet((prev) => [...prev,new Bullet(theX,theY,4,velocity)])
     }


    useEffect(()=>{
         const Theplayer = new Player(); 
         Theplayer.create();
         setPlayer(Theplayer);
         //const thebullet = new Bullet(Theplayer.x,Theplayer.y,4,{x:1,y:1});
         const canvas = document.getElementById('canvas')
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
         //setBullet(pre => [...pre,thebullet]);
         fillCanvas();
    

    },[])
    
 /*  useEffect(() => {
        console.log(player);
        console.log(bullet);
      }, [player,bullet]);*/
      

useEffect(() => {
      const canvas = document.getElementById('canvas')
      canvas.addEventListener("click", listener);
      return () => canvas.removeEventListener("click", listener);
    },[player])
   
    useEffect(() => {
        const canvas = document.getElementById('canvas')
        canvas.addEventListener("click", bulletlistener);
        return () => canvas.removeEventListener("click", bulletlistener);
      },[bullet,player])
   
    animate();
    return( 
    <canvas id="canvas">
     
    </canvas>
    )
 
}

export default Game;