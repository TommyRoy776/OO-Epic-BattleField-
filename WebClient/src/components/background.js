import '../App.css'
import bgVideo from '../video/bgVideo.mp4'



function Background(){
   return(
        <div className="video-container">
        <div className="color-overlay"></div>
        <video autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
   )
}

export default Background;