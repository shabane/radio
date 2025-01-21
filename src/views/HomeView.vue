<template>
  <div class="home">
    <audio controls autoplay id="player" hidden>
      <source
        src="https://raw.githubusercontent.com/bit-orbit/lofi/master/files/musics/nuver-exhale.opus"
        type="audio/ogg"
        autoplay
      />
    </audio>
    <div class="col">
      <StationSwitch class="stationSwitch col-10" />
      <div class="fix-btm-vol col-2">
        <span class="icono-volume"></span>
        <button
          class="btn btn-outline-secondary"
          @click="changeVolTo(0)"
          id="vol-0"
        >
          I
        </button>

        <button
          class="btn btn-outline-secondary m-1"
          @click="changeVolTo(50)"
          id="vol-50"
        >
          II
        </button>

        <button
          class="btn btn-outline-light btn-outline-secondary"
          @click="changeVolTo(100)"
          id="vol-100"
        >
          III
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import StationSwitch from "@/components/StationSwitch";
export default {
  name: "HomeView",
  components: { StationSwitch },
  data() {
    return {
      volume: 100,
    };
  },
  methods: {
    changeVolTo(vol) {
      for (let i of [0, 50, 100]) {
        document
          .getElementById(`vol-${i}`)
          .classList.remove("btn-outline-light");
      }
      document.getElementById(`vol-${vol}`).classList.add("btn-outline-light");
      document.getElementById("player").volume = vol / 100;
    },
  },
  mounted() {},
};
</script>
