<template>
  <v-app id="gyro">
    <v-main class="bg-grey-lighten-3 ">
      <v-container :fluid="true" class="ma-0 pa-2 v-flex full-width">
        <v-row>
          <v-col cols="4">
            <v-card rounded="lg">

              <v-card-item class="mb-5">
                <v-card-title>Parameters</v-card-title>
                <v-card-subtitle>Set dimensions of gyroscope and strength of gravity</v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-slider 
                  v-for="(parameter, key) in parameters" 
                  :min="parameter.min" 
                  :max="parameter.max" 
                  :thumb-label="'always'"
                  v-model="parameter.value" 
                  :key="key"
                  class="mt-2"
                  >
                  <template v-slot:prepend>
                    {{ parameter.symbol }} :
                  </template>
                </v-slider>                
              </v-card-text>
            </v-card>
            
            <v-card rounded="lg" class="mt-2">
              
              <v-card-item class="mb-5">
                <v-card-title>Initial State</v-card-title>
                <v-card-subtitle>Set initial state of gyroscope</v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-slider 
                  v-for = "(stateVariable, key) in initialState"
                  :min="stateVariable.min" 
                  :max="stateVariable.max" 
                  :thumb-label="'always'"
                  v-model="stateVariable.value" 
                  :key="key"
                  class="mt-2"
                  >
                  <template v-slot:prepend>
                    {{ stateVariable.symbol }} <sub v-if = "stateVariable.subscript">{{stateVariable.subscript}}</sub> :
                  </template>
                </v-slider>                
              </v-card-text>
            </v-card>

            <v-container>
              <v-row>
                <v-col>
                  <v-btn 
                        block
                        color = green
                        variant="outlined" 
                        @click="runSolver(
                          this.solverParameters.t0.value,
                          [this.computedState.theta, this.computedState.phi, this.computedState.psi, this.computedState.pTheta, this.computedState.pPhi, this.computedState.pPsi],
                          this.solverParameters.numSteps.value
                        )"
                      >
                        START
                      </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                        block
                        color = red
                        variant="outlined" 
                        @click="isSolving = false"
                      >
                    STOP
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>

          </v-col>

          <v-col cols="8">
            <v-sheet rounded="lg">
              <gyroscopeSimulator :solution="solution" :parameters="parameters" :state="computedState" :isSolving = "isSolving"></gyroscopeSimulator>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import { pushScopeId } from 'vue'
import gyroscopeSimulator from './components/gyroscopeSimulator'
// import _ from 'lodash'
// import { popScopeId } from 'vue'
// import { ref, onMounted } from 'vue'

  export default {
    name: 'app',
    components: {
      gyroscopeSimulator
    },
    data: () => ({
      parameters : {
        "l" : {value: 5, min: 1, max: 10, symbol: 'l'},
        "a" : {value: 2, min: 1, max: 5, symbol: 'a'},
        "h" : {value: 0.5, min: 0.1, max: 1, symbol: 'h'},
        "g" : {value: 9.8, min: 0, max: 10, symbol : 'g'},
      },
      solverParameters : {
          "stepSize" : {value: 1/240},
          "numSteps" : {value: 240 * 5}, // total animation time in seconds is stepSize * numSteps
          't0' : {value: 0}
      },
      animationParameters : {
          "rstride" : 15,
          "cstride" : 5,
          "nSample" : 45,
          "dpi" : 300,
          "transparency" : 0.8
      },
      initialState : {
          "theta" : {value: 0, min: 0, max: 6.28, symbol: '𝛉'},
          "phi" : {value: 0.2, min: 0.01, max: 6.28, symbol: '𝜙'},
          "psi" : {value: 0, min: 0, max: 6.28, symbol: '𝛙'},
          "thetaVel": {value: 0, min: 0, max: 12, symbol: 'ω', subscript: '𝛉'},
          "phiVel": {value: 0, min: 0, max: 12, symbol: 'ω', subscript: '𝜙'},
          "psiVel": {value: 0, min: 0, max: 100, symbol: 'ω', subscript: '𝛙'}
      },
      solution: [],
      isSolving : false, // boolean to track whether or not simulation is running.
      lastSolverStep : null // saves last solver step for use in generating continuous solution
    }),
    computed : {
      computedState() {
        let state = {... this.initialState}
        for(let key in state){
          state[key] = state[key].value
        }
        Object.assign(state, this.getCartesian(state.theta, state.phi))
        Object.assign(state, this.getGeneralizedMomenta())
        return state
      }
    },
    watch: {
    solution: {
      handler(newValue) {
        //let throttleSolver = _.throttle(this.runSolver(this.lastSolverStep['t0'], this.lastSolverStep['state'], false), 1000)
        if(newValue.length < this.solverParameters.numSteps.value / 2 && this.isSolving == true){
          this.runSolver(this.lastSolverStep['t0'], this.lastSolverStep['state'], this.solverParameters.numSteps.value / 10, false)
        }
      },
      deep: true
    }
    },
    methods : {
      gyroscope(t, stateVector) { // returns dstateVector/dt
          let [theta, phi, psi, pTheta, pPhi, pPsi] = stateVector

          // DON'T ANGER THE LINTER
          theta = psi
          psi = theta
          
          let phiVel = pPhi / this.parameters.l.value**2 
          let thetaVel = (pTheta - (pPsi * Math.cos(phi)))/(this.parameters.l.value**2 * Math.sin(phi)**2) 
          let psiVel = (pPsi/(this.parameters.a.value**2/4)) - thetaVel * Math.cos(phi) 

          let pThetaDot = 0 
          let pPhiDot = (this.parameters.l.value**2 + (this.parameters.a.value**2/4))* Math.sin(phi) * Math.cos(phi) * thetaVel**2 + (this.parameters.g.value*this.parameters.l.value - (this.parameters.a.value**2/4) * psiVel * thetaVel) * Math.sin(phi)
          let pPsiDot = 0

          return [thetaVel, phiVel, psiVel, pThetaDot, pPhiDot, pPsiDot];
      },
      rungeKutta(engine, state, t0, stepSize, numSteps) {
          // Helper functions for rungeKutta solver
          function numericAdd(a, b) {
            return a.map((ai, i) => ai + b[i]);
          }
          function numericMul(scalar, vector) {
              return vector.map(vi => scalar * vi);
          }

          // Variable Instantiation
          const result = [];
          result.push({ t: t0, state: state });

          // Solve
          for (let i = 1; i <= numSteps; i++) {
              const t = t0 + i * stepSize;
              const k1 = numericMul(stepSize, engine(t0, state));
              const k2 = numericMul(stepSize, engine(t0 + stepSize / 2, numericAdd(state, numericMul(0.5, k1))));
              const k3 = numericMul(stepSize, engine(t0 + stepSize / 2, numericAdd(state, numericMul(0.5, k2))));
              const k4 = numericMul(stepSize, engine(t0 + stepSize, numericAdd(state, k3)));

              state = numericAdd(state, numericMul(1 / 6, numericAdd(k1, numericAdd(numericMul(2, k2), numericAdd(numericMul(2, k3), k4)))));
              t0 = t;
              result.push({ t, state: state });
          }
          return result;
      },
      updateSolution(solution){
        for(let elem of solution){
          let entry = {
            theta : elem.state[0],
            phi : elem.state[1],
            psi : elem.state[2],
            ... this.getCartesian(elem.state[0], elem.state[1])
          }
          this.solution.push(entry)
        }
      },
      runSolver(t0, stateVector, numSteps, clearSolution = true){
        if(clearSolution == true){
          this.solution = []
        }

        this.isSolving = true
        let solution = this.rungeKutta(
          this.gyroscope,
          stateVector,
          t0,
          this.solverParameters.stepSize.value,
          numSteps
        )

        this.lastSolverStep = solution[solution.length - 1]
        this.updateSolution(solution)
      },
      getCartesian(theta, phi){// return cartesian coordinates from theta, phi, and psi
          let x = this.parameters.l.value * Math.cos(theta) * Math.sin(phi)
          let y = this.parameters.l.value * Math.sin(theta) * Math.sin(phi)
          let z = this.parameters.l.value * Math.cos(phi)

          return {x:x, y:y, z:z}
      },
      getGeneralizedMomenta(){
        let pTheta = (this.parameters.l.value**2 * Math.sin(this.initialState.phi.value)**2 + (this.parameters.a.value**2/4) * Math.cos(this.initialState.phi.value)**2)*this.initialState.thetaVel.value + (this.parameters.a.value**2/4) * this.initialState.psiVel.value * Math.cos(this.initialState.phi.value)
        let pPhi = this.parameters.l.value**2 * this.initialState.phiVel.value
        let pPsi = (this.parameters.a.value**2/4) * (this.initialState.thetaVel.value * Math.cos(this.initialState.phi.value) + this.initialState.psiVel.value)

        return {pTheta:pTheta, pPhi:pPhi, pPsi:pPsi}
      }
    }
  }
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  font-family: NotoSansMath-Regular
}

@font-face {
    font-family: NotoSansMath-Regular;
    src: url('~@/assets/fonts/NotoSansMath-Regular.ttf');
}
</style>