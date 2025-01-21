<template>
  <div class="home">
    <div class="col">
      <StationSwitch class="stationSwitch col-10" />
      <div class="fix-btm-vol col-2">
        <span class="icono-volume"></span>
        <button class="btn btn-outline-secondary">0</button>
        <button class="btn btn-outline-secondary m-1">50</button>
        <button class="btn btn-outline-light">100</button>
      </div>
    </div>
  </div>
</template>

<script>
import StationSwitch from "@/components/StationSwitch";
export default {
  name: "HomeView",
  components: { StationSwitch },
};
</script>
