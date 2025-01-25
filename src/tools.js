export function rnd(n) {
  return Math.floor(Math.random() * n);
}

function setCookie(name, value, daysToExpire = 30, path = "/") {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=${path}`;
  document.cookie = cookie;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function setVol(vol) {
  setCookie("volume", vol);
}

export function getVol() {
  let vol = getCookie("volume") ? getCookie("volume") : 100;
  return vol;
}
