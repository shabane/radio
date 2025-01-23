import axios from "axios";

class RadioBase {
  constructor() {
    this.api_stations =
      "https://api.github.com/repos/shabane/radio/contents/stations";
  }
}

export class Radio extends RadioBase {
  constructor() {
    super();
  }

  listStation() {
    return axios
      .get(this.api_stations)
      .then((stations) => {
        let station_list = [];
        for (let station of stations.data) {
          station_list.push(
            new Station(station.name, this.#git_url2repo_url(station.git_url))
          );
        }
        return station_list;
      })
      .catch((err) => {
        return err;
      });
  }

  #git_url2repo_url(url) {
    url = url.split("/");
    url = url.slice(0, url.length - 3);
    url.push("contents");
    url = new URL(url.join("/")).href;
    return url;
  }
}

class Station {
  constructor(name, url, music_sub = "/files/musics", bg_sub = "/files/bg") {
    this.name = name;
    this.url = url;
    this.music_sub = music_sub;
    this.bg_sub = bg_sub;
  }

  listMusic() {
    return axios
      .get(this.url + this.music_sub)
      .then((musics) => {
        let music_list = [];
        for (let music of musics.data) {
          if (this.#isValidMusic(music.download_url)) {
            music_list.push(
              new Music(
                music.name,
                music.download_url,
                music.size / Math.pow(2, 20)
              )
            );
          }
        }
        return music_list;
      })
      .catch((err) => {
        return err;
      });
  }

  #isValidMusic(url) {
    try {
      new URL(url);
    } catch (error) {
      return false;
    }

    const supportedAudioExtensions = [
      ".mp3",
      ".wav",
      ".flac",
      ".ogg",
      ".aac",
      ".m4a",
      ".opus",
    ];

    const extension = url.split(".").pop().toLowerCase();
    if (supportedAudioExtensions.includes(`.${extension}`)) {
      return true;
    }
  }
}

class Music {
  constructor(name, url, length) {
    this.name = name;
    this.url = url;
    this.length = length; // Should be in MB(i like it this way)
  }
}
