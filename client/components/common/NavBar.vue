<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">

    </div>
    <div class="right">
      <router-link to="/">
        Home/City
      </router-link>
      <div>
        Neighborhoods
      </div>
      <router-link to="/neighborhood/gianna">
        My Neighborhood
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/profile"
      >
        Profile
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: rgb(170, 85, 64);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    color: #fff;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 10px;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
}

.alerts {
    width: 25%;
}
</style>
