# Gyroscope Visualizer
A webapp that simulates the motion of a symmetric gyroscope. Written using Vue and THREE.js.

## Interface 
View in [Github Pages](https://keenancabrera.github.io/GyroscopeVisualizer/)

<img width="1358" alt="Screenshot 2023-11-15 at 8 53 41 AM" src="https://github.com/keenancabrera/GyroscopeVisualizer/assets/148273199/bf7b5036-850b-4721-a336-c09091d674f4">

SI units are used throughout. A brief explanation of each of the GUI elements:

##### Parameters
* l (meters) : the distance between the cylinder and the fixed point of rotation
* a (meters) : the radius of the cylinder
* h (meters) : the height of the cylinder
* g (meters/second ^ 2) : the strength of gravity

##### State Variables
* 𝛉 (radians) : The polar angle that describes the position of the system in the X-Y (horizontal) plane
* 𝜙 (radians) : The azimuthal angle that describes the systems' position relative to the Z axis (vertical)
* 𝛙 (radians) : The angle that describes the rotation of the cylinder along the axis of the rod
* ω<sub>𝛉</sub> (radians/second): Angular velocity corresponding to 𝛉
* ω<sub>𝜙</sub> (radians/second): Angular velocity corresponding to 𝜙
* ω<sub>𝛙</sub> (radians/second): Angular velocity corresponding to 𝛙

Clicking the "Simulate" button will trigger a 15 second animation of the gyroscopes' motion based on your choice of input variables. Once the 15 seconds are completed, the animation will revert back to your initial state. Changing the parameters or state variables mid-simulation will also stop the simulation.
