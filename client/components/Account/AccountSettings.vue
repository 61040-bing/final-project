<template>
  <section>
    <div>
      <h4>Account Settings for {{ $store.state.userObject.firstName }} {{ $store.state.userObject.lastName }} </h4>
      <hr>
    </div>
    <div>
      <article>
        Neighborhood:
      </article>
      <article
        tabindex="0"
        @blur="hideMenu"
      >
        <span v-if="!editing_neighborhood">{{ $store.state.userObject.neighborhood.name }} </span>
        <div
          v-if="editing_neighborhood"
          :class="['dropdown', editing_email ? 'toggle': '']"
        >
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

        <font-awesome-icon
          v-if="!editing_neighborhood" 
          icon="fa-solid fa-pencil"
          @click="startEditingNeighborhood"
        />
      </article>
    </div>
    <hr>
    <div>
      <article>
        Email:
      </article>
      <article>
        <span v-if="!editing_email">{{ $store.state.userObject.email }} </span>
        <input
          v-if="editing_email"
          :value="email_draft"
          @input="email_draft = $event.target.value"
        >

        <font-awesome-icon
          v-if="!editing_email"
          class="icons" 
          icon="fa-solid fa-pencil"
          @click="startEditingEmail"
        />
        <font-awesome-icon 
          v-if="editing_email"
          class="icons"
          icon="fa-solid fa-check"
          @click="submitEmailEdit" 
        />

        <font-awesome-icon 
          v-if="editing_email"
          class="icons"
          icon="fa-solid fa-xmark"
          @click="stopEditingEmail"
        />
      </article>
    </div>
    <hr>
    <section
      style="position: relative"
      class="alerts"
    >
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
    <div
      class="button-click"
      @click="logout"
    >
      Log Out
    </div>
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
      alerts:{}
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
    },

    toggleMenu() {
      this.displayNeighborhoodMenu = !this.displayNeighborhoodMenu;

    },
    async submitNeighborhoodEdit(neighborhoodId){
      try {
        const fields = {neighborhood: neighborhoodId};
        const r = await  fetch(`/api/users/`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshUser');
        this.editing_neighborhood = false;
        const successMessage = "successfully changed neighborhood"
        this.$set(this.alerts, successMessage, 'success');
        setTimeout(() => this.$delete(this.alerts, successMessage), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submitEmailEdit(neighborhoodId){
      const emailRegex = /^[\w+.\-]{0,25}@(\w+)(\.)(\w+)$/i;
      try {
        if (!this.email_draft){
          throw new Error("email cannot be empty")
        }
        if (!emailRegex.test(this.email_draft)) {
            throw new Error('Email must be a valid email with no empty spaces.')
        }
        const fields = {email: this.email_draft};
        const r = await  fetch(`/api/users/`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('refreshUser');
        this.editing_email = false;
        const successMessage = "successfully changed email"
        this.$set(this.alerts, successMessage, 'success');
        setTimeout(() => this.$delete(this.alerts, successMessage), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },


  }
};
</script>


<style scoped>

section {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 17px
}
h4 {
  margin-bottom: 5px;
  color: rgb(67, 67, 67);
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
  align-items: center;
  margin-top: 5px;
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
  max-width: fit-content;
  padding: 10px;
  background-color: rgb(170, 85, 64);
  border-radius: 5px;
  color: white;
  font-size: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
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

.icons {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
