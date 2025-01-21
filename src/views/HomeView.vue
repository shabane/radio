<template>
  <div class="home">
    <StationSwitch class="stationSwitch" />
  </div>
</template>

<script>
import StationSwitch from "@/components/StationSwitch";
export default {
  name: "HomeView",
  components: { StationSwitch },
};
</script>
