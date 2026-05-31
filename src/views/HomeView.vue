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
      @error="handleAudioError"
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
      v-if="current_music && stations && stations[current_station_position_num] && !isFullscreen"
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
      class="fixed bottom-[5%] left-1/2 -translate-x-1/2 w-[95%] border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col p-4 md:p-6 gap-3 md:gap-4 z-50 text-white transition-all duration-500 ease-in-out"
    >
      <CardContent class="p-0 flex flex-col gap-4 md:gap-6">
        <!-- Station Selection Chips with horizontal scroll and buttons for mobile -->
        <div
          class="relative w-full flex items-center justify-between gap-1 md:block"
          v-if="stations"
        >
          <!-- Left Arrow Button (visible only on mobile) -->
          <Button
            variant="ghost"
            size="icon"
            class="md:hidden text-white/70 hover:text-white bg-white/5 hover:bg-white/10 shrink-0 w-8 h-8 rounded-full border border-white/5"
            @click="scrollStations('left')"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>

          <!-- Scrollable Container -->
          <div
            ref="stationsContainer"
            class="flex overflow-x-auto scroll-smooth no-scrollbar gap-2 w-full justify-start md:justify-center md:flex-wrap md:overflow-x-visible md:scroll-auto px-1 py-1"
          >
            <Button
              variant="outline"
              class="rounded-full bg-transparent border-transparent hover:bg-white/20 transition-all text-zinc-300 hover:text-white shrink-0 md:shrink"
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
              class="rounded-full bg-transparent border-transparent hover:bg-white/20 transition-all text-zinc-300 hover:text-white shrink-0 md:shrink"
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

          <!-- Right Arrow Button (visible only on mobile) -->
          <Button
            variant="ghost"
            size="icon"
            class="md:hidden text-white/70 hover:text-white bg-white/5 hover:bg-white/10 shrink-0 w-8 h-8 rounded-full border border-white/5"
            @click="scrollStations('right')"
          >
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>

        <!-- Controls Row -->
        <div
          class="flex items-center justify-between w-full border-t border-white/10 pt-3 md:pt-4 gap-4"
        >
          <!-- Spacer for center alignment on desktop -->
          <div class="hidden md:block flex-1"></div>

          <!-- Play/Pause -->
          <div class="flex-1 flex justify-start md:justify-center items-center">
            <div class="relative flex justify-center items-center w-16 h-16 md:w-20 md:h-20">
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
                class="relative w-11 h-11 md:w-14 md:h-14 rounded-full border-transparent hover:scale-105 transition-all text-white z-10"
                :class="[
                  played ? 'shadow-[0_0_15px_rgba(165,105,189,0.5)]' : '',
                  is_streaming
                    ? 'bg-primary/40 hover:bg-primary/50'
                    : 'bg-white/10 hover:bg-white/20',
                ]"
                @click="playPause()"
                :disabled="show_loading"
              >
                <Pause v-if="played" class="w-5 h-5 md:w-6 md:h-6 fill-current text-white" />
                <Play v-else class="w-5 h-5 md:w-6 md:h-6 fill-current text-white ml-0.5" />
              </Button>
            </div>
          </div>

          <!-- Volume Control -->
          <div
            class="flex-1 flex justify-end items-center gap-2 md:gap-4"
          >
            <Volume2 class="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
            <div class="w-24 md:w-[120px]">
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

    <!-- Error Display State -->
    <div
      v-if="errorMessage"
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-6 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-center shadow-2xl z-50 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
    >
      <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
        <AlertTriangle class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold">خطا در بارگذاری رادیو</h3>
      <p class="text-zinc-300 text-sm leading-relaxed" style="direction: rtl;">
        {{ errorMessage }}
      </p>
      <div class="flex gap-3 w-full justify-center mt-2">
        <Button
          variant="outline"
          class="border-primary text-primary hover:bg-primary hover:text-white transition-colors px-6"
          @click="retryLastAction"
        >
          تلاش مجدد
        </Button>
        <Button
          v-if="stations"
          variant="ghost"
          class="text-zinc-400 hover:text-white transition-colors px-6"
          @click="errorMessage = null"
        >
          بستن
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { Radio } from "@/radioSDK";
import { rnd, getVol, setVol } from "@/tools";
import { Play, Pause, Volume2, Radio as RadioIcon, Maximize, Minimize, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-vue-next";
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
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
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
      errorMessage: null,
      consecutiveAudioErrors: 0,
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
      this.errorMessage = null;
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
      
      const player = document.getElementById("player");
      if (player) {
        player.src = newMusic.url;
      }
      this.show_loading = false;
      this.consecutiveAudioErrors = 0;
      if (player) {
        player.play().catch(e => console.warn("Auto-play failed:", e));
      }
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
      this.errorMessage = null;
      const loadId = Date.now();
      this.currentLoadId = loadId;

      this.stations[targetIndex]
        .listMusic()
        .then((musics) => {
          if (this.currentLoadId !== loadId) return;
          if (!musics || musics.length === 0) {
            throw new Error("این ایستگاه در حال حاضر آهنگی ندارد.");
          }

          let newMusicPos = rnd(musics.length);
          let newMusic = musics[newMusicPos];

          this.preloadBg(targetIndex)
            .then((bgUrl) => {
              if (this.currentLoadId !== loadId) return;

              this.current_station_position_num = targetIndex;
              this.pending_station_position_num = null;
              this.musics = musics;
              this.current_music_position_num = newMusicPos;
              this.current_music = newMusic;
              
              const player = document.getElementById("player");
              if (player) {
                player.src = newMusic.url;
              }
              if (bgUrl) {
                document.body.style.backgroundImage = `url(${bgUrl})`;
              }
              this.show_loading = false;
              this.consecutiveAudioErrors = 0;
              if (player) {
                player.play().catch(e => console.warn("Auto-play failed:", e));
              }
            })
            .catch(err => {
              if (this.currentLoadId !== loadId) return;
              this.show_loading = false;
              this.handleHTTPError(err);
            });
        })
        .catch((err) => {
          if (this.currentLoadId !== loadId) return;
          this.show_loading = false;
          this.handleHTTPError(err);
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

      if (!this.musics || this.musics.length === 0) return;

      let rm = rnd(this.musics.length);
      if (this.musics.length > 1) {
        while (rm === this.current_music_position_num) {
          rm = rnd(this.musics.length);
        }
      }
      this.current_music_position_num = rm;
      this.current_music = this.musics[this.current_music_position_num];
      
      const player = document.getElementById("player");
      if (player && this.current_music) {
        player.src = this.current_music.url;
        player.play().catch(e => console.warn("Auto-play failed:", e));
      }
    },

    playPause() {
      let ply = document.getElementById("player");
      if (this.played) {
        ply.pause();
      } else {
        ply.play().catch(e => console.warn("Play failed:", e));
      }
    },

    initRadio() {
      this.show_loading = true;
      this.errorMessage = null;

      let radio = new Radio();
      radio.listStation()
        .then((station_list) => {
          this.stations = station_list;
          if (!station_list || station_list.length === 0) {
            throw new Error("هیچ ایستگاه رادیویی در دسترس نیست.");
          }
          
          if (this.current_station_position_num === null) {
            this.current_station_position_num = rnd(this.stations.length);
          }

          // Fetch music for all stations in background
          Promise.all(
            station_list.map((s) => 
              s.listMusic().catch(err => {
                console.warn(`Failed to fetch music for station ${s.name} during initialization:`, err);
                return [];
              })
            )
          ).then((results) => {
            this.all_musics = [];
            results.forEach((musics) => {
              if (Array.isArray(musics)) {
                this.all_musics.push(...musics);
              }
            });
          });

          // Fetch music for current station
          return station_list[this.current_station_position_num].listMusic();
        })
        .then((musics) => {
          if (!musics || musics.length === 0) {
            throw new Error("هیچ آهنگی برای ایستگاه فعلی پیدا نشد.");
          }
          this.musics = musics;
          this.current_music_position_num = rnd(musics.length);
          this.current_music = musics[this.current_music_position_num];

          return this.preloadBg(this.current_station_position_num);
        })
        .then((bgUrl) => {
          const player = document.getElementById("player");
          if (player && this.current_music) {
            player.src = this.current_music.url;
          }
          if (bgUrl) {
            document.body.style.backgroundImage = `url(${bgUrl})`;
          }
          this.show_loading = false;
          this.consecutiveAudioErrors = 0;
        })
        .catch((err) => {
          console.error("Initialization error:", err);
          this.show_loading = false;
          this.handleHTTPError(err);
        });
    },

    handleHTTPError(err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 403) {
          this.errorMessage = "تعداد درخواست‌های ارسالی به سرور گیت‌هاب بیش از حد مجاز است (خطای ۴۰۳). لطفاً کمی صبر کنید یا از فیلترشکن/VPN استفاده کنید.";
        } else if (status === 404) {
          this.errorMessage = "منابع پیدا نشدند (خطای ۴۰۴).";
        } else {
          this.errorMessage = `خطای سرور (${status}). لطفاً دوباره تلاش کنید.`;
        }
      } else if (err.request) {
        this.errorMessage = "خطا در اتصال به شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.";
      } else {
        this.errorMessage = err.message || "خطایی رخ داده است. لطفاً دوباره تلاش کنید.";
      }
    },

    handleAudioError(e) {
      console.error("Audio player error:", e);
      this.consecutiveAudioErrors++;
      
      if (this.consecutiveAudioErrors >= 3) {
        this.show_music_loading = false;
        this.show_loading = false;
        this.played = false;
        this.errorMessage = "پخش موسیقی با خطا مواجه شد. ایستگاه یا منابع صوتی ممکن است موقتاً در دسترس نباشند.";
      } else {
        // Try playing next song after a delay
        setTimeout(() => {
          this.playNext();
        }, 1500);
      }
    },

    retryLastAction() {
      if (!this.stations) {
        this.initRadio();
      } else if (this.is_streaming) {
        this.startStream();
      } else if (this.current_station_position_num !== null) {
        this.playMusic(this.current_station_position_num);
      } else {
        this.initRadio();
      }
    },

    scrollStations(direction) {
      const container = this.$refs.stationsContainer;
      if (container) {
        const scrollAmount = direction === 'left' ? -120 : 120;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    },
  },
  mounted() {
    this.volumeArray = [getVol() * 100];
    setTimeout(() => {
      let player = document.getElementById("player");
      if (player) player.volume = getVol();
    }, 100);

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    this.initRadio();
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
  },
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
