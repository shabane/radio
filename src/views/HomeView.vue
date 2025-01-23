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
        v-if="stations && current_station_position_num >= 0"
        :station-max="stations.length - 1"
        :position="current_station_position_num"
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
      current_music_position_num: null,
      current_station_position_num: null,
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
  },
  mounted() {
    let radio = new Radio();
    radio.listStation().then((station_list) => {
      this.stations = station_list;
      this.current_station_position_num = rnd(this.stations.length);
      station_list[this.current_station_position_num]
        .listMusic()
        .then((musics) => {
          this.musics = musics;
          this.current_music_position_num = rnd(musics.length);
          this.current_music = musics[this.current_music_position_num];
          document.getElementById("player").src = this.current_music.url;
        });
    });
  },
};
</script>
