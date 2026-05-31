<template>
  <div
    class="home min-h-screen flex flex-col justify-between"
    :class="{ 'is-playing': played }"
  >
    <audio
      controls
      autoplay
      id="player"
      hidden
      @ended="playNext()"
      @error="playNext()"
      @loadstart="show_music_loading = true"
      @loadedmetadata="handleMetadataLoaded"
      @timeupdate="handleTimeUpdate"
      @pause="played = false"
      @play="played = true"
    >
      <source src="" type="audio/ogg" />
    </audio>

    <!-- Fullscreen Button -->
    <Button
      variant="outline"
      size="icon"
      class="fixed top-4 left-6 z-50 bg-zinc-900/40 backdrop-blur-md border-white/10 text-white hover:bg-white/20 hover:text-white rounded-xl transition-all"
      @click="toggleFullscreen"
    >
      <Maximize v-if="!isFullscreen" class="w-5 h-5" />
      <Minimize v-else class="w-5 h-5" />
    </Button>

    <!-- Song Info Display -->
    <div
      v-if="current_music && stations && stations[current_station_position_num]"
      class="fixed top-[15%] left-1/2 -translate-x-1/2 w-full text-center px-4"
    >
      <h2
        class="text-xl md:text-2xl font-medium text-primary uppercase tracking-widest mb-2 drop-shadow-md"
      >
        {{ stations[current_station_position_num].name }}
      </h2>
      <h1
        class="text-4xl md:text-6xl font-bold m-0 drop-shadow-lg tracking-wide text-white"
      >
        {{ current_music.name.split(".")[0] }}
      </h1>
    </div>

    <!-- Bottom Player Bar -->
    <Card
      v-show="!isFullscreen"
      class="fixed bottom-[5%] left-1/2 -translate-x-1/2 w-[95%] border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col p-4 md:p-6 gap-4 z-50 text-white transition-all duration-500 ease-in-out"
    >
      <CardContent class="p-0 flex flex-col gap-6">
        <!-- Station Selection Chips -->
        <div
          class="flex flex-wrap justify-center gap-2 md:gap-3 w-full"
          v-if="stations"
        >
          <Button
            variant="outline"
            class="rounded-full bg-transparent border-transparent hover:bg-white/20 transition-all text-zinc-300 hover:text-white"
            :class="{
              'bg-primary/40 border-primary/50 text-white shadow-[0_4px_15px_rgba(165,105,189,0.4)]':
                (pending_station_position_num === 'stream') || (pending_station_position_num === null && is_streaming),
            }"
            @click="startStream()"
            :disabled="show_loading"
          >
            <RadioIcon class="w-4 h-4 mr-2" />
            Stream
          </Button>
          <Button
            v-for="(station, index) in stations"
            :key="station.name"
            variant="outline"
            class="rounded-full bg-transparent border-transparent hover:bg-white/20 transition-all text-zinc-300 hover:text-white"
            :class="{
              'bg-primary/40 border-primary/50 text-white shadow-[0_4px_15px_rgba(165,105,189,0.4)]':
                (pending_station_position_num === index) || (pending_station_position_num === null && !is_streaming && current_station_position_num === index),
            }"
            @click="changeStation(index)"
            :disabled="show_loading"
          >
            {{ station.name }}
          </Button>
        </div>

        <!-- Controls Row -->
        <div
          class="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/10 pt-4 gap-6 md:gap-0"
        >
          <!-- Spacer for center alignment on desktop -->
          <div class="hidden md:block flex-1"></div>

          <!-- Play/Pause -->
          <div class="flex-1 flex justify-center items-center">
            <div class="relative flex justify-center items-center w-24 h-24">
              <!-- Loading Ring -->
              <svg
                v-if="show_loading || show_music_loading"
                class="absolute inset-0 w-full h-full animate-spin text-primary drop-shadow-[0_0_10px_rgba(165,105,189,0.8)]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="150 150"
                  stroke-linecap="round"
                />
              </svg>

              <!-- Progress Ring for Stations -->
              <svg
                v-else-if="!is_streaming"
                class="absolute inset-0 w-full h-full -rotate-90 text-primary drop-shadow-[0_0_8px_rgba(165,105,189,0.5)]"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  :stroke="progressColor"
                  stroke-width="4"
                  :stroke-dasharray="289"
                  :stroke-dashoffset="289 - (currentTime / duration || 0) * 289"
                  stroke-linecap="round"
                  class="transition-all duration-300 ease-linear"
                />
              </svg>

              <!-- Stream Mode Ring (Pulse) -->
              <div
                v-else-if="is_streaming && played"
                class="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping opacity-20"
              ></div>
              <svg
                v-else-if="is_streaming"
                class="absolute inset-0 w-full h-full text-primary/50"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="10 10"
                />
              </svg>

              <Button
                variant="outline"
                size="icon"
                class="relative w-16 h-16 rounded-full border-transparent hover:scale-105 transition-all text-white z-10"
                :class="[
                  played ? 'shadow-[0_0_20px_rgba(165,105,189,0.6)]' : '',
                  is_streaming
                    ? 'bg-primary/40 hover:bg-primary/50'
                    : 'bg-white/10 hover:bg-white/20',
                ]"
                @click="playPause()"
                :disabled="show_loading"
              >
                <Pause v-if="played" class="w-8 h-8 fill-current text-white" />
                <Play v-else class="w-8 h-8 fill-current text-white ml-1" />
              </Button>
            </div>
          </div>

          <!-- Volume Control -->
          <div
            class="flex-1 flex justify-center md:justify-end items-center gap-4 w-full md:w-auto"
          >
            <Volume2 class="w-6 h-6 text-zinc-400" />
            <div class="w-full max-w-[150px] md:w-[120px]">
              <Slider
                v-model="volumeArray"
                :max="100"
                :step="1"
                @update:modelValue="updateVolume"
                class="w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { Radio } from "@/radioSDK";
import { rnd, getVol, setVol } from "@/tools";
import { Play, Pause, Volume2, Radio as RadioIcon, Maximize, Minimize } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export default {
  name: "HomeView",
  components: {
    Play,
    Pause,
    Volume2,
    RadioIcon,
    Maximize,
    Minimize,
    Button,
    Slider,
    Card,
    CardContent,
  },
  data() {
    return {
      volumeArray: [100],
      stations: null,
      musics: null,
      all_musics: [],
      is_streaming: false,
      current_station: null,
      current_music: null,
      current_music_position_num: null,
      current_station_position_num: null,
      show_stations_btn: true,
      show_loading: false,
      show_music_loading: false,
      played: false,
      currentTime: 0,
      duration: 100,
      pending_station_position_num: null,
      currentLoadId: null,
      isFullscreen: false,
    };
  },
  computed: {
    progressColor() {
      let ratio = this.currentTime / this.duration || 0;
      // Blue: rgb(59, 130, 246) to Red: rgb(239, 68, 68)
      let r = Math.round(59 + (239 - 59) * ratio);
      let g = Math.round(130 + (68 - 130) * ratio);
      let b = Math.round(246 + (68 - 246) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    },
  },
  methods: {
    handleTimeUpdate(e) {
      if (!e.target) return;
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration || 100;
    },

    updateVolume(val) {
      const vol = val[0] || 0;
      let player = document.getElementById("player");
      if (player) {
        player.volume = vol / 100;
      }
      setVol(vol / 100);
    },

    changeStation(index) {
      if (this.current_station_position_num !== index || this.is_streaming) {
        this.is_streaming = false;
        this.pending_station_position_num = index;
        this.playMusic(index);
      }
    },

    startStream() {
      if (this.all_musics.length === 0) return;
      this.pending_station_position_num = 'stream';
      this.show_loading = true;
      const loadId = Date.now();
      this.currentLoadId = loadId;

      const now = Date.now();
      const EPOCH = 1700000000000;
      const HOUR_MS = 60 * 60 * 1000;
      const currentHour = Math.floor((now - EPOCH) / HOUR_MS);

      const songIndex = currentHour % this.all_musics.length;
      const newMusic = this.all_musics[songIndex];

      if (this.currentLoadId !== loadId) return;
      this.is_streaming = true;
      this.pending_station_position_num = null;
      this.current_music = newMusic;
      document.getElementById("player").src = newMusic.url;
      this.show_loading = false;
      document.getElementById("player").play();
    },

    handleMetadataLoaded() {
      this.show_music_loading = false;
      if (this.is_streaming) {
        const audio = document.getElementById("player");
        const now = Date.now();
        const EPOCH = 1700000000000;
        const HOUR_MS = 60 * 60 * 1000;

        const passedSeconds = ((now - EPOCH) % HOUR_MS) / 1000;
        if (audio.duration && isFinite(audio.duration)) {
          audio.currentTime = passedSeconds % audio.duration;
        }
      }
    },

    playMusic(targetIndex) {
      this.show_loading = true;
      const loadId = Date.now();
      this.currentLoadId = loadId;

      this.stations[targetIndex]
        .listMusic()
        .then((musics) => {
          if (this.currentLoadId !== loadId) return;

          let newMusicPos = rnd(musics.length);
          let newMusic = musics[newMusicPos];

          this.preloadBg(targetIndex).then((bgUrl) => {
            if (this.currentLoadId !== loadId) return;

            this.current_station_position_num = targetIndex;
            this.pending_station_position_num = null;
            this.musics = musics;
            this.current_music_position_num = newMusicPos;
            this.current_music = newMusic;
            document.getElementById("player").src = newMusic.url;
            if (bgUrl) {
              document.body.style.backgroundImage = `url(${bgUrl})`;
            }
            this.show_loading = false;
            document.getElementById("player").play();
          });
        });
    },

    preloadBg(index) {
      if (this.is_streaming) {
        return Promise.resolve(null);
      }
      return this.stations[index]
        .getBackgroundUrl()
        .then((bg) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve(bg);
            };
            img.onerror = () => resolve(bg); // resolve anyway to not block
            img.src = bg;
          });
        });
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },

    handleFullscreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
      if (this.isFullscreen) {
        document.body.classList.add('is-fullscreen');
      } else {
        document.body.classList.remove('is-fullscreen');
      }
    },

    playNext() {
      if (this.is_streaming) {
        setTimeout(() => this.startStream(), 1000);
        return;
      }

      let rm = rnd(this.musics.length);
      while (rm === this.current_music_position_num) {
        rm = rnd(this.musics.length);
      }
      this.current_music_position_num = rm;
      this.current_music = this.musics[this.current_music_position_num];
      document.getElementById("player").src =
        this.musics[this.current_music_position_num].url;
      document.getElementById("player").play();
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
    this.volumeArray = [getVol() * 100];
    setTimeout(() => {
      let player = document.getElementById("player");
      if (player) player.volume = getVol();
    }, 100);

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    let radio = new Radio();
    radio.listStation().then((station_list) => {
      this.stations = station_list;
      this.current_station_position_num = rnd(this.stations.length);

      Promise.all(station_list.map((s) => s.listMusic())).then((results) => {
        results.forEach((musics) => {
          this.all_musics.push(...musics);
        });
      });

      station_list[this.current_station_position_num]
        .listMusic()
        .then((musics) => {
          this.musics = musics;
          this.current_music_position_num = rnd(musics.length);
          this.current_music = musics[this.current_music_position_num];
          
          this.preloadBg(this.current_station_position_num).then((bgUrl) => {
            document.getElementById("player").src = this.current_music.url;
            if (bgUrl) {
              document.body.style.backgroundImage = `url(${bgUrl})`;
            }
            this.show_loading = false;
          });
        });
    });
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
  },
};
</script>

<style scoped>
/* Scoped styles can be completely omitted as Tailwind handles it all */
</style>
