import React from "react";
import Snare from "../assets/snare.svg";
import Tom1 from "../assets/tom1.svg";
import Tom2 from "../assets/tom2.svg";
import FloorTom from "../assets/floor.svg";
import HihatTop from "../assets/hihat.svg";
import Crash from "../assets/crash.svg";
import Ride from "../assets/ride.svg";
import Kick from "../assets/kick.svg";

export default function drumset(props) {
  return (
    <div className="drumset">
      <div className="kick-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Kick} alt="" datakey="kick" className="kick"></img>
      </div>
      <div className="snare-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Snare} alt="" datakey="snare" className="snare"></img>
      </div>
      <div className="tom1-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Tom1} alt="" datakey="tom1" className="tom1"></img>
      </div>
      <div className="tom2-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Tom2} alt="" datakey="tom2" className="tom2"></img>
      </div>
      <div className="floor-tom-pad" onClick={(e) => props.toggleSound(e)}>
        <img
          src={FloorTom}
          alt=""
          datakey="floor-tom"
          className="floor-tom"
        ></img>
      </div>
      <div className="crash-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Crash} alt="" datakey="crash" className="crash"></img>
      </div>
      <div className="ride-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={Ride} alt="" datakey="ride" className="ride"></img>
      </div>

      <div className="hihat-pad" onClick={(e) => props.toggleSound(e)}>
        <img src={HihatTop} alt="" datakey="hihat" className="hihat"></img>
      </div>
    </div>
  );
}
