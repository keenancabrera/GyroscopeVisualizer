<template>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<script>
import { gyroscopeAnimation } from '@/gyroscopeRenderer/gyroscopeAnimation';

export default {
  name: 'gyroscopeSimulator',
  props: {
    solution: Object,
    parameters: Object,
    state: Object,
    isSolving: Boolean
  },
  watch: {
    solution : {
      handler() {
        this.gyroscopeAnimation.updateSolution(this.solution);
      },
      deep: false,
      flush: 'post'
    },
    parameters : {
      handler(){
        this.gyroscopeAnimation.updateParameters((this.parameters))
      },
      deep : true
    },
    state : {
      handler(){
        this.gyroscopeAnimation.updateState((this.state))
      },
      deep : true
    },
    isSolving : {
      handler(){
        if(this.isSolving == false){
          this.gyroscopeAnimation.updateState((this.state))
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() { 
    this.gyroscopeAnimation = new gyroscopeAnimation(this.$refs.sceneContainer, (this.parameters), (this.state), (this.solution))
    this.gyroscopeAnimation.render()
  },
};
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 95vh;
}
</style>
