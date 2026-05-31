<template>
  <div class="fixed top-4 right-6 z-50 navbar-container">
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          class="bg-zinc-900/40 backdrop-blur-md border-white/10 text-white hover:bg-white/20 hover:text-white rounded-xl"
        >
          <Menu class="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        class="bg-zinc-950/80 backdrop-blur-xl border-white/10 text-white w-[250px] sm:w-[300px]"
      >
        <SheetHeader class="border-b border-white/10 pb-4 mb-4">
          <SheetTitle class="text-white flex justify-center items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="#a569bd"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.364 5.63604C22.2686 9.54064 22.2686 15.864 18.364 19.7686C14.4594 23.6732 8.136 23.6732 4.2314 19.7686C0.326802 15.864 0.326802 9.54064 4.2314 5.63604C8.136 1.73145 14.4594 1.73145 18.364 5.63604Z"
                stroke="#a569bd"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.7"
              />
              <path
                d="M15.536 8.46401C17.4912 10.4192 17.4912 13.5808 15.536 15.536C13.5808 17.4912 10.4192 17.4912 8.46399 15.536C6.50878 13.5808 6.50878 10.4192 8.46399 8.46401C10.4192 6.50879 13.5808 6.50879 15.536 8.46401Z"
                stroke="#a569bd"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.7"
              />
            </svg>
            <span class="font-bold text-xl tracking-wider">Radio</span>
          </SheetTitle>
        </SheetHeader>

        <div class="flex flex-col gap-4 mt-4 text-center">
          <Button as="a" variant="link" href="https://wiregeek.ir" class="text-zinc-400 hover:text-white transition-colors font-medium text-base">
            /Blog
          </Button>
          <Button as="router-link" variant="link" to="/about" class="text-zinc-400 hover:text-white transition-colors font-medium text-base">
            /About
          </Button>

          <div class="mt-4" v-if="this.$route.path === '/'">
            <Button
              variant="outline"
              class="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              @click="downloadCurrentSong()"
            >
              <Download class="w-4 h-4 mr-2" />
              Download Current Song
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script>
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Menu } from "lucide-vue-next";

export default {
  name: "DarkNavbar",
  components: {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    Button,
    Download,
    Menu,
  },
  methods: {
    downloadCurrentSong() {
      var song_src = document.getElementById("player").src;
      window.open(song_src);
    },
  },
};
</script>

<style scoped>
/* Tailwind handles the styling */
</style>
