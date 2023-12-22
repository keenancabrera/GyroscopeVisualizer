import { Clock } from "three";

const clock = new Clock()

class Loop {
  constructor(camera, scene, renderer, controls, solution) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.controls = controls
    this.updatables = []
    this.solution = solution
    this.isPaused = false
    this.stepSize = 1/240
  }

   start(state, paused = false) {
    this.isPaused = paused

    clock.getDelta()
    this.renderer.setAnimationLoop(() => {
      if(this.isPaused == false){
        this.tick()
      }
      else {
        this.Pause(state)
      }
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    })
  }

  Pause(state) {
    this.isPaused = true
    for(const object of this.updatables){
      object.tick(state)
    }
    this.renderer.render(this.scene, this.camera)
  }
  
  tick() {
    let delta = clock.getDelta()
    for (const object of this.updatables){
      object.tick(this.solution[0])
    }

    for(let i = 0; i <= Math.round(delta/this.stepSize); i++){
      this.solution.shift()
    }

    // console.log(this.solution.length)
  }
}

export { Loop };