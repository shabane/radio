<template>
  <div class="home">
    <audio
      controls
      autoplay
      id="player"
      hidden
      @ended="playNext()"
      @loadstart="show_music_loading = true"
      @loadeddata="show_music_loading = false"
      @pause="played = false"
      @play="played = true"
    >
      <source src="" type="audio/ogg" />
    </audio>

    <button class="play-pause-btn" @click="playPause()">
      <div v-if="played" class="pause-icon">
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <div v-else class="play-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </button>

    <!-- Add this new section to display song name -->
    <div v-if="current_music" class="song-info mt-3">
      <h5 class="text-light">Now Playing: {{ current_music.name }}</h5>
    </div>

    <button
      class="btn btn-info mt-5 m-1"
      type="button"
      disabled
      v-if="show_loading"
    >
      Loading...
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
    </button>

    <button
      class="btn btn-info mt-5 m-1"
      type="button"
      disabled
      v-if="show_music_loading"
    >
      <span
        class="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      <span class="icono-music"></span>
    </button>

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
            :hidden="show_stations_btn"
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
          @mouseenter="this.show_stations_btn = false"
          @mouseleave="this.show_stations_btn = true"
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
      show_stations_btn: true,
      show_loading: false,
      show_music_loading: false,
      played: false,
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
      this.show_loading = true;
      this.stations[this.current_station_position_num]
        .listMusic()
        .then((musics) => {
          this.musics = musics;
          this.current_music_position_num = rnd(musics.length);
          this.current_music = musics[this.current_music_position_num];
          document.getElementById("player").src =
            musics[this.current_music_position_num].url;
          this.selectStationBtn();
          this.setBg();
          this.show_loading = false;
          document.getElementById("player").play();
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
      this.current_music = this.musics[this.current_music_position_num];
      document.getElementById("player").src =
        this.musics[this.current_music_position_num].url;
    },

    playPause() {
      let ply = document.getElementById("player");
      if (this.played) {
        ply.pause();
      } else {
        ply.play();
      }
    },
  },
  mounted() {
    this.show_loading = true;
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
          this.show_loading = false;
        });
    });
  },
};
</script>

<style scoped>
.song-info {
  text-align: center;
}
</style>
