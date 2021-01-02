import { observable, makeObservable } from "mobx";

window.AudioContex = window.AudioContext || window.webiktAudioContext;

export default class Store {
  construcutor() {
    makeObservable(this, {
      arrayOfBuffers: observable,
      currentDrumset: observable,
      context: observable,
    });
  }
  arrayOfBuffers = [1, 2];
  currentDrumset = "drumset1";

  context = new AudioContext();
}
