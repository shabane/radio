<template>
  <nav class="hamburger-menu-container">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="navbar-brand" to="/">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="d-inline-block align-text-top me-2"
            >
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="#6f42c1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.364 5.63604C22.2686 9.54064 22.2686 15.864 18.364 19.7686C14.4594 23.6732 8.136 23.6732 4.2314 19.7686C0.326802 15.864 0.326802 9.54064 4.2314 5.63604C8.136 1.73145 14.4594 1.73145 18.364 5.63604Z"
                stroke="#6f42c1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.7"
              />
              <path
                d="M15.536 8.46401C17.4912 10.4192 17.4912 13.5808 15.536 15.536C13.5808 17.4912 10.4192 17.4912 8.46399 15.536C6.50878 13.5808 6.50878 10.4192 8.46399 8.46401C10.4192 6.50879 13.5808 6.50879 15.536 8.46401Z"
                stroke="#6f42c1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.7"
              />
            </svg>
            Radio
          </router-link>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="https://wiregeek.ir">Blog</a>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/about">About</router-link>
        </li>

        <li class="nav-item" v-if="this.$route.path === '/'">
          <button
            class="m-1 btn btn-outline-purple align-items-center"
            @click="downloadCurrentSong()"
          >
            <i class="fas fa-paper-plane me-2"></i> Download Current Song
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "DarkNavbar",
  methods: {
    downloadCurrentSong() {
      var song_src = document.getElementById("player").src;
      window.open(song_src);
    },
  },
};
</script>

<style scoped>
/* Main container to position the menu in the top-right */
.hamburger-menu-container {
  position: fixed;
  top: 1rem;
  right: 1.5rem;
  z-index: 1030; /* Ensure it's above other content */
}

/* Style the popup menu itself */
.navbar-collapse {
  position: absolute;
  top: 100%; /* Position it right below the button */
  right: 0;
  width: 250px; /* Set a fixed width for the menu */
  margin-top: 0.5rem;
  background-color: #1c1c1e;
  border: 1px solid #333;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  font-family: "Poppins", sans-serif;
}

/* Ensure the nav items are stacked vertically */
.navbar-nav {
  align-items: flex-start;
}

/* Style the brand/logo now that it's inside the menu */
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  color: #ffffff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #333; /* Add a separator */
}

.nav-link {
  color: #a9a9b3;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 0.25rem;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
}

/* Style the toggler button */
.navbar-toggler {
  border: 1px solid #444;
  border-radius: 0.5rem;
  background-color: rgba(44, 44, 46, 0.8);
  backdrop-filter: blur(5px); /* Cool glass effect */
  -webkit-backdrop-filter: blur(5px);
  padding: 0.5rem 0.75rem;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Style the download button */
.btn-outline-purple {
  border-color: #6f42c1;
  color: #6f42c1;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 0.5rem !important;
}

.btn-outline-purple:hover {
  background-color: #6f42c1;
  color: #ffffff;
}
</style>
