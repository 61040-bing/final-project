<template>
  <section>
    <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 100%">
      <article>
        Neighborhood:
      </article>
      <article              tabindex="0"
                            @blur="hideMenu">
      <span v-if="!editing_neighborhood">{{ $store.state.userObject.neighborhood.name }} </span>


        <div v-if="editing_neighborhood"
             :class="['dropdown', editing_email ? 'toggle': '']">
          <ul>
            <li
                v-for="neighborhood in $store.state.neighborhoods"
                :key="neighborhood._id"
                @click="submitNeighborhoodEdit(neighborhood._id)"

            >
              {{ neighborhood.name }}

            </li>
          </ul>
        </div>

      <img
          v-if="!editing_neighborhood"
          src="../../public/pencil.png"
          @click="startEditingNeighborhood"
      >
      <img
          v-if="editing_neighborhood"
          src="../../public/yes.png"
          @click="submitNeighborhoodEdit"
      >
      <img
          v-if="editing_neighborhood"
          src="../../public/no.png"
          @click="stopEditingNeighborhood"
      >
      </article>
    </div>

    <div style="display: flex; flex-direction: row; justify-content: space-evenly;">
      <article>
        Email:
      </article>
      <article>
        <span v-if="!editing_email">{{ $store.state.userObject.email }} </span>
        <textarea
            v-if="editing_email"
            :value="email_draft"
            @input="email_draft = $event.target.value"
        />

        <img
            v-if="!editing_email"
            src="../../public/pencil.png"
            @click="startEditingEmail"
        >
        <img
            v-if="editing_email"
            src="../../public/yes.png"
            @click="submitEmailEdit"
        >
        <img
            v-if="editing_email"
            src="../../public/no.png"
            @click="stopEditingEmail"
        >
      </article>
    </div>

    <div @click="logout" class="button-click">logout </div>
  </section>
</template>

<script>
export default {
  name: 'AccountSettings',
  components: {},
  props: {
  },
  data() {
    return {
      editing_email: false,
      editing_password: false,
      editing_neighborhood: false,
      neighborhood_draft: this.$store.state.userObject.neighborhood.name,
      displayNeighborhoodMenu: true,
    }
  },
  methods: {
    async logout(){
      const r = await  fetch(`/api/users/session`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}});
      if (!r.ok) {
        const res = await r.json();
        throw new Error(res.error);
      }
      this.$router.push({name: 'Home'}); // Goes to Home page after signing out
      this.$store.commit('setUserObject', null)
      this.$store.commit('alert', {
        message: 'You are now signed out!', status: 'success'
      });
    },

    startEditingEmail(){
      this.editing_email = true
      this.email_draft = this.$store.state.userObject.email
    },
    stopEditingEmail() {
      this.editing_email = false
      this.email_draft = this.$store.state.userObject.email
    },
    startEditingNeighborhood(){
      this.editing_neighborhood = true;
      this.neighborhood_draft = this.$store.state.userObject.neighborhood.name
    },
    stopEditingNeighborhood(){
      this.editing_neighborhood = false;
      this.neighborhood_draft = this.$store.state.userObject.neighborhood.name
    },
    hideMenu() {
      this.displayNeighborhoodMenu = false;
      this.editing_neighborhood = false;
      console.log("hiding menu");
    },

    toggleMenu() {
      this.displayNeighborhoodMenu = !this.displayNeighborhoodMenu;

    },
    async submitNeighborhoodEdit(neighborhoodId){
      console.log("here we are submitting")
      try {
        console.log("neigh id", neighborhoodId)
        const fields = {neighborhood: neighborhoodId};
        const r = await  fetch(`/api/users/`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshUser');
        this.editing_neighborhood = false;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submitEmailEdit(neighborhoodId){
      console.log("here we are submitting email")
      try {
        const fields = {email: this.email_draft};
        const r = await  fetch(`/api/users/`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshUser');
        this.editing_email = false;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },


  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
  align-items: center;
  margin-top: 20%;
}

button {
  background-color: white;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 25px;
  border-radius: 10px;
  padding: 20px;
  width: 700px;
}

img {
  height: 20px;
  width: 20px;
  margin-left: 20px;
}

.button-click{
  width: 100%;
  height: 50px;
  background-color: rgb(170, 85, 64);
  border-radius: 40px;
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 220px;
}
.button-click:hover{
  cursor: pointer;
}

.dropdown {
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
  background: white;
  color: black;
  /*display: none;*/
  display: block;
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
</style>
