<template>
  <div id="app">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

export default {
  name: 'app',
  components: {},
  data() {
    return {}
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

.router_ul {
  display: flex;
  justify-content: center;
  margin: 0;
  list-style: none;
  padding: 10px 0;
}

.router_ul li {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.3s;
}

.router_ul li.activeClass {
  background: #4d90fe;
  color: #fff;
  border: none;
}
</style>
