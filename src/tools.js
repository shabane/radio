export function rnd(n) {
  return Math.floor(Math.random() * n);
}

function setCookie(name, value, daysToExpire = 30, path = "/") {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=${path}`;
  document.cookie = cookie;
}
