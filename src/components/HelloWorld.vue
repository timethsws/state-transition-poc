<template>
  <div class="hello">
    Current State : {{ machineCurrentState.value || "Leading"}}
    <br/>
    ERROR : {{machineCurrentContext.errors}}
    <hr />
    <p>Supported State Transitions</p>
    <div v-for="(action, idx) in actions" :key="action">
      <button v-on:click="send(idx)">{{ idx }}</button>
    </div>

    <hr/>
    <p>Guard variables</p>
    <input type="checkbox" id="checkbox" v-model="lead.lodgementChecklistCompleted">
    <label for="checkbox">lodgementChecklistCompleted </label><span>(without this checked you wont be able to move from Qualified to Lodged)</span>
  </div>
</template>

<script>
import { interpret } from "xstate";
import { leadStateTransitionMachineFactory, defaultGuards } from "../stateMachines/leadTransitionMachine";

export default {
  name: "HelloWorld",
  data() {
    return {
      //Machine
      leadTransitionMachine :{},

      // Interpret the machine and store it in data
      leadStateTransitionService: {},

      // Start with the machine's initial state
      machineCurrentState: {},

      // Start with the machine's initial context
      machineCurrentContext: {},
      lead :{
        lodgementChecklistCompleted : false
      }
    };
  },
  mounted(){
    // create the machine
    this.leadTransitionMachine = leadStateTransitionMachineFactory(this.lead,defaultGuards);

    // register the interpreter service
    this.leadStateTransitionService = interpret(this.leadTransitionMachine);
    
    // register on transition event handler (to update state values)
    this.leadStateTransitionService
      .onTransition((state) => {
        // Update the current state component data property with the next state
        this.machineCurrentState = state;
        // Update the context component data property with the updated context
        this.machineCurrentContext = state.context;
      })
      .start();

  },unmounted(){
    this.leadStateTransitionService.stop()
  },
  watch:{
    lead : function (value){
      this.leadTransitionMachine.assign(value);
    }
  },
  computed: {
    actions() {
      // Make sure machine is initialized
      if(this.leadTransitionMachine && this.leadTransitionMachine.config)
        return this.leadTransitionMachine.config.states[this.machineCurrentState.value]
        .on;
      return {}
    },
  },
  methods: {
    // Send events to the service
    send(event) {
      this.leadStateTransitionService.send(event);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
