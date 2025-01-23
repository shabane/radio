<template>
  <div class="home">
    <audio controls autoplay id="player" hidden>
      <source src="" type="audio/ogg" autoplay />
    </audio>
    <div class="col">
      <StationSwitch
        class="stationSwitch col-10"
        id="stationSwitch"
        station-min="0"
        v-if="stations"
        :station-max="stations.length - 1"
      />
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
          @click="changeVolTo(25)"
          id="vol-25"
        >
          II
        </button>

        <button
          class="btn btn-outline-secondary"
          @click="changeVolTo(50)"
          id="vol-50"
        >
          III
        </button>

        <button
          class="btn btn-outline-secondary m-1"
          @click="changeVolTo(75)"
          id="vol-75"
        >
          IV
        </button>

        <button
          class="btn btn-outline-light btn-outline-secondary"
          @click="changeVolTo(100)"
          id="vol-100"
        >
          V
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import StationSwitch from "@/components/StationSwitch";
import { Radio } from "@/radioSDK";
import { rnd } from "@/tools";

export default {
  name: "HomeView",
  components: { StationSwitch },
  data() {
    return {
      volume: 100,
      stations: null,
      musics: null,
      current_station: null,
      current_music: null,
    };
  },
  methods: {
    changeVolTo(vol) {
      for (let i of [0, 25, 50, 75, 100]) {
        document
          .getElementById(`vol-${i}`)
          .classList.remove("btn-outline-light");
      }
      document.getElementById(`vol-${vol}`).classList.add("btn-outline-light");
      document.getElementById("player").volume = vol / 100;
    },

    getStations() {
      let radio = new Radio();
      radio.listStation().then((stations) => {
        this.stations = stations;
      });
    },
  },
  mounted() {
    let radio = new Radio();
    radio.listStation().then((station_list) => {
      this.stations = station_list;
      station_list[rnd(station_list.length)].listMusic().then((musics) => {
        this.musics = musics;
        this.current_music = musics[rnd(musics.length - 1)];
        document.getElementById("player").src = this.current_music.url;
      });
    });
  },
};
</script>
