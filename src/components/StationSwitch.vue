<template>
  <div>
    <div class="slidecontainer">
      <input
        type="range"
        :min="stationMin"
        :max="stationMax"
        :value="position"
        class="slider"
        id="stationSlider"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "StationSwitch",
  props: {
    stationMax: Number,
    stationMin: Number,
    position: Number,
  },
};
</script>

<style scoped>
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 95%;
  height: 15px;
  border-radius: 5px;
  background: #313131;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2874a6;
  cursor: pointer;
  opacity: 1;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #04aa6d;
  cursor: pointer;
}
</style>
