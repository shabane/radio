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
          station_list.push({
            name: station.name,
            url: this.#git_url2repo_url(station.git_url),
          });
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
