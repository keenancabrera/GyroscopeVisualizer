<template>
    <div ref="sceneContainer" class="scene-container"></div>
  </template>
  
  <script>
  import * as THREE from '../../node_modules/three';
  
  export default {
    name: 'gyroscopeSimulator',
    props: {
      solution: Object
    },
    watch: {
      $props: {
        handler() {
          this.animate();
        },
        deep: true
      },
    },
    data() {
      return {
        L: 5,
        a: 1,
        h: 0.25,
        theta: Math.PI/4,
        phi: Math.PI/4,
        psi: Math.PI/4,
        x: null,
        y: null,
        z: null,
        linePoints: [],
        verticies: new Float32Array([0,0,0,0,0,0]),
  
      }
    },
    methods: {
      cylinderPosition(theta, phi){
        this.x = this.L * Math.cos(theta) * Math.sin(phi)
        this.y = this.L * Math.sin(theta) * Math.sin(phi)
        this.z = this.L * Math.cos(phi)
      },
      updateStateVariables(i){ // i is index or solution
        this.theta = this.solution.theta[i]
        this.phi = this.solution.phi[i]
        this.psi = this.solution.psi[i]
  
        this.x = this.L * Math.cos(this.theta) * Math.sin(this.phi)
        this.y = this.L * Math.sin(this.theta) * Math.sin(this.phi)
        this.z = this.L * Math.cos(this.phi)
      },
      animate(){
        // Initialize the Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        this.$el.clientWidth / this.$el.clientHeight,
        0.1,
        1000
      );
      camera.up.set(0,0,1) // Set up to be z axis
  
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
      this.$refs.sceneContainer.appendChild(renderer.domElement);
  
      // Axes Helper
      // X RED | Y GREEN | Z BLUE |
      const axesHelper = new THREE.AxesHelper(this.L*2)
  
      // Cylinder to the scene
      const geometryCylinder = new THREE.CylinderGeometry(this.a, this.a, this.h, 32 ); 
      // const materialCylinder = new THREE.MeshBasicMaterial({ color: "red", wireframe: true });
      // const materialCylinder2 = new THREE.MeshBasicMaterial({ color: "blue", wireframe: true });
  
      const cylinder = new THREE.Mesh(geometryCylinder, [new THREE.MeshPhongMaterial({ color: 'blue', shininess: 200 }),new THREE.MeshPhongMaterial({ color: 'red', shininess: 200 })]);
      cylinder.rotation.set(Math.PI/2,0,0)
      cylinder.position.set(0,0,this.L)
  
      // Rod to the scene
      const materialLine = new THREE.LineBasicMaterial( { color: 'white' } );
      const geometryLine = new THREE.BufferGeometry()
  
      const line = new THREE.Line( geometryLine, materialLine );
  
      // Light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.z = this.L*1
  
  
      scene.add(cylinder, axesHelper, line, directionalLight);
  
  
      // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
      // const cylinder = new THREE.Mesh( geometry, material ); 
      // scene.add(cylinder);
  
      camera.position.x = this.L * 1.2
      camera.position.y = this.L * 1.2
      camera.position.z = this.L * 1.2
      camera.lookAt(0,0,0)
      // Render loop
  
      let i = 0
      let oldSoln = new THREE.Vector3(0,0,this.L)
      const animate = () => {
        requestAnimationFrame(animate);
        
  
        this.updateStateVariables(i)
        // this.updateStateVariables(i/5 % 150)
        cylinder.position.set(this.x, this.y, this.z)
        // cylinder.rotation.set(Math.PI / 2, this.phi, this.theta)
  
  
        this.verticies[3] = this.x * 1.5
        this.verticies[4] = this.y * 1.5
        this.verticies[5] = this.z * 1.5
        geometryLine.setAttribute('position', new THREE.BufferAttribute(this.verticies, 3))      
  
  
        let currentSoln = new THREE.Vector3(this.x, this.y, this.z)
        let angle = oldSoln.angleTo(currentSoln)
        let difference = currentSoln.clone().add(oldSoln.multiplyScalar(-1))
        let rotationVector = new THREE.Vector3().crossVectors(difference, oldSoln)
  
        cylinder.rotateOnWorldAxis(rotationVector.normalize(), angle)
  
        i = (i + 1)
        renderer.render(scene, camera);
        oldSoln.set(this.x, this.y, this.z)
      };
  
      animate();
      }
    },
    mounted() {
    },
  };
  </script>
  
  <style scoped>
  .scene-container {
    width: 100%;
    height: 95vh;
  }
  </style>
  