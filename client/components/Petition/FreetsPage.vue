<!-- Default page that also displays freets -->

<template>
  <main>
    <div class="freetButton">
    <button class="freetPost" @click="posting = true"> Freet </button>
  </div>

  <div class="welcome" v-if="$store.state.username">
        <h2 class="home">Home</h2>
        <button class="filter" @click="openCredFilter = !openCredFilter"> CredibilityFilter</button>
        <SearchBar />
  </div>

  <div class="filterContainer" v-if="openCredFilter">

    <button class="enable" v-if="credFilterEnabled" @click="disableCredFilter"> Disable Credibility Filter</button>
    <button class="enable" v-else @click="enableCredFilter"> Enable Credibility Filter</button>

    <CredFilterForm v-if="credFilterEnabled"/>
  </div>

  <main class="page">
    <section v-if="$store.state.username">
      <div class="modal-backdrop" v-if="posting">
        <div class="entire">
          
          <button class="close" @click="posting = false">X</button>
          <div class="mainActions">
            <h3>Create A Freet</h3>
            <button class="threadConvert" v-if="isThread" @click="makeFreet"> Convert Into Single Freet</button>
            <button class="threadConvert" v-else @click="makeThread"> Convert Into Thread</button>
          </div>

          <ThreadForm v-if="isThread"/>
          <FreetForm v-else/>

        </div>
      </div>
      
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
        </div>
        <div class="right">
          <GetFeedForm
            ref="getFeedForm"/>
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import FreetForm from '@/components/Freet/FreetForm.vue';
import ThreadForm from '@/components/StructuredThreads/ThreadForm.vue';
import GetFeedForm from '@/components/Feed/GetFeedForm.vue';
import SearchBar from '@/components/Search/SearchBar.vue';
import CredFilterForm from '@/components/Feed/CredFilterForm.vue';
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFeedForm, FreetForm, SearchBar, CredFilterForm, ThreadForm, Modal},
  mounted() {
    this.$refs.getFeedForm.submit();
  },
  data() {
    return {
      credFilterEnabled: false,
      isThread: false,
      posting: false,
      openCredFilter: false,
    }
  },
  methods: {
    makeThread() {
      this.isThread = true;
    },
    makeFreet() {
      this.isThread = false;
    },
    enableCredFilter() {
      this.credFilterEnabled = true;
    },
    async disableCredFilter() {
      this.credFilterEnabled = false;

      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({unscored: true, highScored: true, lowScored: true})
      };
      try {
        console.log(options);
        const r = await fetch('/api/feeds/', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');
        // const message = 'Successfully created a freet!';
        // this.alerts.push(message, 'success')
        // setTimeout(() => this.$delete(this.alerts, message), 3000);

      } catch (e) {
        // this.alerts.push(e, 'error')
        // setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.welcome{
  margin-left: 15%;
  position: fixed;
  background-color: white;
  width: 70%;
  height: 15%;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}

.filterContainer {
  margin-left: 35%;
  margin-top: 7%;
  box-shadow: 5px 5px 5px #888888;
  position: fixed;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 27%;
  height: 55%;
  display: block;
  justify-content: space-between;
  z-index: 1;
}

.page{
  margin-left: 25%;
  padding-top: 12%;
}

main {
  font-family: Arial, Helvetica, sans-serif;
}

.home {
  margin-left: 15%;
  margin-top: 5%;
  font-size: 40px;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

.mainActions{
  display: flex;
}

.filter {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: large;
  color:white;
  height: 30%;
  border-radius: 20px;
  margin-top: 5%;
  margin-left: 20px;
  border: 5px solid rgb(255, 174, 0);
  background-color: rgb(255, 174, 0);
}


.enable {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: large;
  color:white;
  height: 10%;
  border-radius: 20px;
  margin-top: 5%;
  margin-left: 20px;
  border: 5px solid rgb(8, 158, 18);
  background-color: rgb(8, 158, 18);
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 4;
}

.threadConvert {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: medium;
  color:white;
  height: 30px;
  border-radius: 20px;
  border: 5px solid rgb(255, 174, 0);
  background-color: rgb(255, 174, 0);
  margin-top: 20px;
}
.entire {
  background-color: white;
  width: 55%;
  border-radius: 10px;
  border: 20px solid white;
  padding: 0.5%;
}

.close {
  background-color: white;
  border: 1px solid white;
  font-weight: bolder;
  font-size: large;
  color:darkgray;
  padding-left: 98%;
}

.freetPost {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
  font-size: 30px;
  color:white;
  border-radius: 50px;
  width: 100%;
  border: 5px solid rgb(255, 174, 0);
  background-color: rgb(255, 174, 0);
  margin-top: 5px;
}

.freetButton{
  z-index: 3;
  position: fixed;
  margin-top: 40%;
  width: 13%;
}
</style>
