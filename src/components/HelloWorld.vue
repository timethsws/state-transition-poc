<template>
  <div class="hello">
    Current State : {{ machineCurrentState.value }}
    <hr />
    <p>Supported State Transitions</p>
    <div v-for="(action, idx) in actions" :key="action">
      <button v-on:click="send(idx)">{{ idx }}</button>
    </div>
  </div>
</template>

<script>
import { interpret } from "xstate";
import { leadTransitionMachine } from "../stateMachines/leadTransitionMachine";
export default {
  name: "HelloWorld",
  created() {
    this.leadStateTransitionService
      .onTransition((state) => {
        // Update the current state component data property with the next state
        this.machineCurrentState = state;
        // Update the context component data property with the updated context
        this.machineCurrentContext = state.context;
      })
      .start();
  },
  data() {
    return {
      // Interpret the machine and store it in data
      leadStateTransitionService: interpret(leadTransitionMachine),

      // Start with the machine's initial state
      machineCurrentState: leadTransitionMachine.initialState,

      // Start with the machine's initial context
      machineCurrentContext: leadTransitionMachine.context,
    };
  },
  computed: {
    actions() {
      return leadTransitionMachine.config.states[this.machineCurrentState.value]
        .on;
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
