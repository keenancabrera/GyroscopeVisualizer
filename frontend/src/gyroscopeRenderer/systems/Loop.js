import { Clock } from "three";

const clock = new Clock()

class Loop {
  constructor(camera, scene, renderer, controls) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.controls = controls
    this.updatables = []
    this.solution = []
    this.i = 0
    this.isPaused = false
    this.stepSize = 1/240
  }

   start(state) {
    this.i = 0
    this.isPaused = false
    let lenSolution = this.solution.length
    clock.getDelta()
    this.renderer.setAnimationLoop(() => {
      if(this.i < lenSolution && this.isPaused == false){
        this.tick()
      }
      if (this.i >= lenSolution && this.isPaused == false){
        this.Pause(state)
      }
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    })
  }

  Pause(state) {
    // this.renderer.setAnimationLoop(null);
    this.isPaused = true
    for(const object of this.updatables){
      object.tick(state)
    }
    this.renderer.render(this.scene, this.camera)
  }
  
  tick() {
    let delta = clock.getDelta()
    for (const object of this.updatables){
      object.tick(this.solution[this.i])
    }
    this.i += Math.round(delta/this.stepSize)
  }
}

export { Loop };