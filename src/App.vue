<template>
  <NavBar />
  <router-view />
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #1e1e1e;
  background-image: url("https://github.com/shabane/radio/blob/master/src/assets/bg.gif?raw=true");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
  background-position: center center;
  transition: background-image 0.5s ease-in-out;
}

body.is-fullscreen .navbar-container {
  display: none !important;
}
</style>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  components: { NavBar },
};
</script>
