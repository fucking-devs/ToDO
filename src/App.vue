<template>
  <div id="app">
    <h2>Управление задачами и очередями</h2>
    <QueueComponent />
  </div>
</template>

<script>
import QueueComponent from './components/QueueComponent.vue';


export default {
  components: {
    QueueComponent,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
