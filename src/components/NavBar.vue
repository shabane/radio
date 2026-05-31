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
            <img
              src="@/assets/logo.png"
              alt="Radio Logo"
              class="w-8 h-8 object-contain rounded-lg"
            />
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
