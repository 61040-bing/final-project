<!-- Form for registering an account (block style) -->

<template>
  <form class="form" @submit.prevent="submit">

    <header v-if="!selectingNeighborhood">
      <h2 >Welcome to Participate!</h2>
    </header>

    <article
      v-if="!selectingNeighborhood"
      class="infoSection"
    >

    <h3>Register</h3>

    <div class="info-container"
      v-for="field in fields"
      v-if="field.id != 'neighborhood'"
      :key="field.id"
      >
      <label :for="field.id">{{ field.label }}:</label>
      <input
        :type="field.id === 'password' ? 'password' : 'text'"
        :name="field.id"
        :value="field.value"
        @input="field.value = $event.target.value"
      >
    </div>

    <button v-if="!selectingNeighborhood" class="nextBtn" type="button" @click="canMove">
      Next
    </button>

    </article>

    <article
      v-if="selectingNeighborhood"
    >

      <div @click="selectingNeighborhood = !selectingNeighborhood" class="back-button">
        <font-awesome-icon
            icon="fa-solid fa-arrow-left"
        />
        Back
      </div>

    <h3 style="margin-top: 40px; margin-bottom: 40px; text-align: center">Select your neighborhood </h3>

      <div class="neighborhood-container">
        <section v-for="neighborhood in $store.state.neighborhoods" @click="selectNeighborhood(neighborhood); fields[4].value = neighborhood._id">

          <div v-if="neighborhood._id === selected" class="selectedNeighborhood" >

            <img v-if="neighborhood._id === '637ef4be35a5b0cd779e43b2'" src="../../public/neighborhoodImgs/eastCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef3c735a5b0cd779e43b0'" src="../../public/neighborhoodImgs/area2.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef42135a5b0cd779e43b1'" src="../../public/neighborhoodImgs/well-harr.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637da8b92cc172c4569f7a9b'" src="../../public/neighborhoodImgs/theport.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637da9752cc172c4569f7aa0'" src="../../public/neighborhoodImgs/cambridgePort.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef52035a5b0cd779e43b3'" src="../../public/neighborhoodImgs/midCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef53f35a5b0cd779e43b4'" src="../../public/neighborhoodImgs/riverside.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef56335a5b0cd779e43b5'" src="../../public/neighborhoodImgs/baldwin.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef59c35a5b0cd779e43b6'" src="../../public/neighborhoodImgs/neigh9.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef61d35a5b0cd779e43b7'" src="../../public/neighborhoodImgs/westCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef65135a5b0cd779e43b8'" src="../../public/neighborhoodImgs/northCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef67535a5b0cd779e43b9'" src="../../public/neighborhoodImgs/camHigh.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef69935a5b0cd779e43ba'" src="../../public/neighborhoodImgs/strawberryHill.jpeg" class="neighborhoodImg">
            <img v-else src="../../public/neighborhoodImgs/defaultNeighborhood.png" class="neighborhoodImg">
            <p class="neighborhood-name">{{ neighborhood.name }}</p>
          </div>

          <div v-else class="neighborhood">
            <img v-if="neighborhood._id === '637ef4be35a5b0cd779e43b2'" src="../../public/neighborhoodImgs/eastCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef3c735a5b0cd779e43b0'" src="../../public/neighborhoodImgs/area2.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef42135a5b0cd779e43b1'" src="../../public/neighborhoodImgs/well-harr.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637da8b92cc172c4569f7a9b'" src="../../public/neighborhoodImgs/theport.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637da9752cc172c4569f7aa0'" src="../../public/neighborhoodImgs/cambridgePort.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef52035a5b0cd779e43b3'" src="../../public/neighborhoodImgs/midCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef53f35a5b0cd779e43b4'" src="../../public/neighborhoodImgs/riverside.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef56335a5b0cd779e43b5'" src="../../public/neighborhoodImgs/baldwin.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef59c35a5b0cd779e43b6'" src="../../public/neighborhoodImgs/neigh9.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef61d35a5b0cd779e43b7'" src="../../public/neighborhoodImgs/westCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef65135a5b0cd779e43b8'" src="../../public/neighborhoodImgs/northCam.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef67535a5b0cd779e43b9'" src="../../public/neighborhoodImgs/camHigh.jpeg" class="neighborhoodImg">
            <img v-else-if="neighborhood._id === '637ef69935a5b0cd779e43ba'" src="../../public/neighborhoodImgs/strawberryHill.jpeg" class="neighborhoodImg">
            <img v-else src="../../public/neighborhoodImgs/defaultNeighborhood.png" class="neighborhoodImg">
            <p class="neighborhood-name">{{ neighborhood.name }}</p>
          </div>
        </section>
      </div>



      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
  </article>
    <div style="width: 100%; display: flex; flex-direction: row; justify-content: center;" v-if="selectingNeighborhood">
      <button class = "submit-button"
           type="submit"
      >
        Register
      </button>
    </div>

    <section v-if="!selectingNeighborhood">
      <header>
        <h2>Already have an account?</h2>
      </header>

      <router-link class="router" to="/login">
        Sign In
      </router-link>
    </section>

  </form>
</template>

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  mounted() {
    this.$store.commit('refreshNeighborhoods');

  },
  methods: {

    toBottom(){
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    },
    async selectNeighborhood(neighborhood) {

      if (this.selected === neighborhood._id) {
        this.selected = undefined;
      } else {
        this.selected = neighborhood._id;
        await new Promise(f => setTimeout(f, 400));
        this.toBottom();
      }
    },
    async canMove(){
      const r = await  fetch(`/api/users/${this.fields[2].value}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
      if (r.status !== 200){
        alert("This email has already been taken");
      } else {
        this.selectingNeighborhood = !this.selectingNeighborhood
      }
    }
  },
  data() {
    return {
      alerts: {},
      selectingNeighborhood: false,
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      neighborhoods: [],
      neighborhoodImgs: [],
      setUser: true,
      selected: undefined,
      fields: [
        {id: 'firstName', label: 'First Name', value: ''},
        {id: 'lastName', label: 'Last Name', value: ''},
        {id: 'email', label: 'Email', value: ''},
        {id: 'password', label: 'Password', value: ''},
        {id: 'neighborhood', label: 'Neighborhood', value: ''}
      ],
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Home'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>

<style scoped>

.neighborhood-container{
  display: grid;
  width: 70%;
  margin-left: 15%;
  row-gap: 10%;
  column-gap: 10%;
  justify-content: space-evenly;
  grid-template-columns: 30% 30% 30%;
  grid-template-rows: 10% 10% 10% 10% 10% 10% 10% 10% 10% 10% 10% 10% 10%;
  font-family: Arial, Helvetica, sans-serif;
}
.neighborhood:hover{
  /*background-color: rgb(194, 194, 194);*/
  background-color: rgb(170, 85, 64);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transform: scale(1.05);
}

.selectedNeighborhood{
  /*background-color: rgb(132, 132, 132);*/
  background-color: rgb(120, 85, 64);
  color: white;
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  border-radius:8px;
}

.neighborhoodImg {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.neighborhood{
  border-radius:8px;
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  transition: all 0.3s;
}

.infoSection {
  border-radius:8px;
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  padding: 3%;
}

form {
  /*border: 1px solid #111;*/
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

.info-container {
  display: flex;
  flex-direction: column;
  margin-top: 1%;
}


form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

.neighborhood-name{
  margin-left: 8px;
  padding-bottom: 12px;
}

.back-button{
  color:  rgb(170, 85, 64);
  font-weight: 800;
  margin-top: 32px;
}
.back-button:hover{
  cursor: pointer;
}

.submit-button{
  background-color:  rgb(170, 85, 64);
  width: 50%;
  padding-top: 16px;
  padding-bottom: 16px;
  text-align: center;
  border-radius: 32px;
  font-weight: 800;
  font-size: 24px;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  transition: all 0.3s;
  border-color: transparent;
}
.submit-button:hover{
  cursor: pointer;
  transform: scale(1.03);
}

.nextBtn{
  background-color:  rgb(170, 85, 64);
  width: 33.33%;
  margin-left: 33.33%;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-top: 3%;
  text-align: center;
  border-radius: 32px;
  font-weight: 800;
  font-size: 24px;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  transition: all 0.3s;
  border-color: transparent;
}
.nextBtn:hover{
  cursor: pointer;
  transform: scale(1.03);
}

.form {
  font-family: Arial, Helvetica, sans-serif;
}

</style>
