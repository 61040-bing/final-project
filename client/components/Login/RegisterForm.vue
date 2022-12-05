<!-- Form for registering an account (block style) -->

<template>
  <form @submit.prevent="submit">
    <article
      v-if="!selectingNeighborhood"
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
    </article>

    <button v-if="!selectingNeighborhood" type="button" @click="canMove">
      Next
    </button>

    <article
      v-if="selectingNeighborhood"
    >

    <button type="button" @click="selectingNeighborhood = !selectingNeighborhood">
      Back
    </button>

    <h3>Select your neighborhood!</h3>

      <div class="neighborhood-container">
        <section v-for="neighborhood in $store.state.neighborhoods" @click="selectNeighborhood(neighborhood); fields[4].value = neighborhood._id">

          <div v-if="neighborhood._id == selected" class="selectedNeighborhood" >
                    
            <img v-if="neighborhood.name == 'East Cambridge'" src="../../public/neighborhoodImgs/eastCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Area 2/MIT'" src="../../public/neighborhoodImgs/area2.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Wellington-Harrington'" src="../../public/neighborhoodImgs/well-harr.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'The Port'" src="../../public/neighborhoodImgs/theport.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Cambridgeport'" src="../../public/neighborhoodImgs/cambridgePort.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Mid-Cambridge'" src="../../public/neighborhoodImgs/midCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Riverside'" src="../../public/neighborhoodImgs/riverside.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Baldwin'" src="../../public/neighborhoodImgs/baldwin.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Neighborhood Nine'" src="../../public/neighborhoodImgs/neigh9.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'West Cambridge'" src="../../public/neighborhoodImgs/westCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'North Cambridge'" src="../../public/neighborhoodImgs/northCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Cambridge Highlands'" src="../../public/neighborhoodImgs/camHigh.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Strawberry Hill'" src="../../public/neighborhoodImgs/strawberryHill.jpeg" class="neighborhoodImg">
            <p>{{ neighborhood.name }}</p>
          </div>

          <div v-else class="neighborhood">
            <img v-if="neighborhood.name == 'East Cambridge'" src="../../public/neighborhoodImgs/eastCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Area 2/MIT'" src="../../public/neighborhoodImgs/area2.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Wellington-Harrington'" src="../../public/neighborhoodImgs/well-harr.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'The Port'" src="../../public/neighborhoodImgs/theport.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Cambridgeport'" src="../../public/neighborhoodImgs/cambridgePort.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Mid-Cambridge'" src="../../public/neighborhoodImgs/midCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Riverside'" src="../../public/neighborhoodImgs/riverside.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Baldwin'" src="../../public/neighborhoodImgs/baldwin.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Neighborhood Nine'" src="../../public/neighborhoodImgs/neigh9.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'West Cambridge'" src="../../public/neighborhoodImgs/westCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'North Cambridge'" src="../../public/neighborhoodImgs/northCam.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Cambridge Highlands'" src="../../public/neighborhoodImgs/camHigh.jpeg" class="neighborhoodImg">
            <img v-if="neighborhood.name == 'Strawberry Hill'" src="../../public/neighborhoodImgs/strawberryHill.jpeg" class="neighborhoodImg">
            <p>{{ neighborhood.name }}</p>
          </div>
        </section>
      </div>

      <button
        type="submit"
      >
        Register
      </button>

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
    selectNeighborhood(neighborhood) {

      if (this.selected == neighborhood._id) {
        this.selected = undefined;
      } else {
        this.selected = neighborhood._id;
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
      setEmail: true,
      setNeighborhood: true,
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
  background-color: rgb(194, 194, 194);
}

.selectedNeighborhood{
  background-color: rgb(132, 132, 132);
  color: white;
}

.neighborhoodImg {
  width: 100%;
  height: 20%;
}

form {
  border: 1px solid #111;
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
}

/* form > article p {
  margin: 0;
} */

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}
</style>
