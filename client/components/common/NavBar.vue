<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav v-if="$route.name !== 'Admin' && $route.name !== 'Edit Neighborhood'">
    <div class="left">
      <img src="../../public/participate.png">
      <h1 class="title">
        Participate
      </h1>
    </div>
    <div class="right">
      <div class="nav-item">
        <span @click="navigateTo('/')">Home/City</span>
      </div>
      <div 
        class="nav-item" 
        tabindex="0"
        @blur="hideMenu"
      >
        <span @click="toggleMenu">Neighborhoods</span>

        <div :class="['dropdown', displayNeighborhoodMenu ? 'toggle': '']">
          <ul>
            <li
              v-for="neighborhood in $store.state.neighborhoods"
              :key="neighborhood.id"
              @click="navigateTo('/neighborhood/'+neighborhood._id)"
            >
              {{ neighborhood.name }}
            </li>
          </ul>
        </div>
      </div>
      <div 
        v-if="$store.state.userEmail"
        class="nav-item"
        @click="navigateTo('/neighborhood/'+$store.state.userNeighborhood)"
      >
        My Neighborhood
      </div>
      <router-link
        v-if="$store.state.userEmail"
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
  <nav v-else>
    <div class="left">
      <h1 class="title">
        Administrator Account
      </h1>
    </div>
    <div class="right">
      <div class="nav-item">
        <span @click="navigateTo('/admin')">Home</span>
      </div>
      Logout
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'NavBar',
    components: {},
    props: {

    },
    data() {
      return {
        displayNeighborhoodMenu: false
      }
    },
    mounted(){
      this.$store.commit('refreshNeighborhoods');
    },
    methods: {
      navigateTo(link) {
        this.$router.push(link);
      },

      hideMenu() {
        this.displayNeighborhoodMenu = false;
      },

      toggleMenu() {
        this.displayNeighborhoodMenu = !this.displayNeighborhoodMenu;
      }
    }
  };
  </script>

<style scoped>
nav {
    background-color: rgb(170, 85, 64);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    color: #fff;
    height: 100%;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 50px;
}

.left {
	display: flex;
	align-items: center;
  padding-left: 2vw;
}

.right {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.right a,
.nav-item {
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
}

.right a:hover,
.nav-item:hover {
  background: rgba(0,0,0,0.2);
}

.alerts {
    width: 25%;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
  background: white;
  color: black;
  display: none;
  box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.4);
  border-radius: 0.5rem;
}

.dropdown.toggle {
  display: block;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
  padding: 0.5em;
}

.dropdown ul li {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.dropdown ul li:hover {
  background: rgba(0,0,0,0.2);
}
.dropdown-content {
  width: 100%;
  box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.4);
}
/* .dropdown:hover .dropdown-content {
  display: block;
}
.dropdown-content a {
  display: block;
  color: #000000;
  padding: 5px;
  text-decoration: none;
}
.dropdown-content a:hover {
  color: #FFFFFF;
  background-color: #00A4BD;
} */


</style>
