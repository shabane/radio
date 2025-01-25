<template>
  <div class="home">
    <audio controls autoplay id="player" hidden @ended="playNext()">
      <source src="" type="audio/ogg" autoplay />
    </audio>
    <div class="col">
      <div class="slidecontainer">
        <div
          class="fix-btm col-lg-12 col-sm-10 col-3 col-md-12"
          v-if="stations"
        >
          <button
            v-for="station in stations"
            :key="station.name"
            class="btn btn-outline-light m-1"
            :id="station.name"
          >
            {{ station.name }}
          </button>
        </div>
        <input
          type="range"
          min="0"
          :max="stations.length - 1"
          v-if="stations"
          class="stationSwitch slider mb-3"
          @input="playMusic()"
          v-model="current_station_position_num"
        />
      </div>
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
// import StationSwitch from "@/components/StationSwitch";
import { Radio } from "@/radioSDK";
import { rnd, getVol, setVol } from "@/tools";

export default {
  name: "HomeView",
  // components: { StationSwitch },
  data() {
    return {
      volume: 100,
      stations: null,
      musics: null,
      current_station: null, // Fuck this!
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
      setVol(vol / 100);
    },

    playMusic() {
      this.stations[this.current_station_position_num]
        .listMusic()
        .then((musics) => {
          this.musics = musics;
          this.current_music_position_num = rnd(musics.length);
          document.getElementById("player").src =
            musics[this.current_music_position_num].url;
          this.selectStationBtn();
          this.setBg();
        });
    },

    setBg() {
      this.stations[this.current_station_position_num]
        .getBackgroundUrl()
        .then((bg) => {
          document.body.style.background = "#313131";
          document.body.style.background = `url(${bg}) no-repeat fixed center center / cover`;
        });
    },

    selectStationBtn() {
      for (let station of this.stations) {
        document
          .getElementById(station.name)
          .classList.remove("btn-outline-warning");
        document
          .getElementById(station.name)
          .classList.add("btn-outline-light");
      }
      let btn = document.getElementById(
        this.stations[this.current_station_position_num].name
      );
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-outline-warning");
    },

    playNext() {
      let rm = rnd(this.musics.length);
      while (rm === this.current_music_position_num) {
        rm = rnd(this.musics.length);
      }
      this.current_music_position_num = rm;
      document.getElementById("player").src =
        this.musics[this.current_music_position_num].url;
    },
  },
  mounted() {
    this.changeVolTo(getVol() * 100);
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
          this.setBg();
          this.selectStationBtn();
        });
    });
  },
};
</script>
