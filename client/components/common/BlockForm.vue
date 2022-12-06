<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>

    <article v-else>
      <p>{{ content }}</p>
    </article>
    <section v-if="fetchPetition">
      <div class="button" @click="toggleMenu">
        Select Petition
      </div>
      <div  v-if="petition">
        {{ petition.title }}
      </div>
      <div :class="['dropdown', displayMenu ? 'toggle': '']">
        <ul>
          <li
            v-for="pet in $store.state.petitions"
            :key="pet._id"
            @click="selectPetition(pet)"
          >
            {{ pet.title }}
          </li>
        </ul>
      </div>
    </section>
   
    <button
      type="submit"
    >
      {{ title }}
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
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setEmail: false, // Whether or not stored email should be updated after form submission
      setNeighborhood: false, // Whether or not stored neighborhood should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission,
      neighborhoodId: null,
      petitionId: null,
      fetchPetition: false,
      refreshComments: false,
      refreshPosts: false,
      setUser: false,
      displayMenu: false,
      petition: null
    };
  },
  mounted(){
    if (this.fetchPetition){
      this.fetchPetitions();
    }
  },
  methods: {
    selectPetition(selectedPetition){
      this.petition = selectedPetition;
      this.hideMenu();
    },
    hideMenu() {
        this.displayMenu = false;
      },
      toggleMenu() {
        this.displayMenu = !this.displayMenu;
      },
    async fetchPetitions(){
      const url = this.$route.params.id ? `/api/petitions?neighborhood=${this.$route.params.id}` : `/api/petitions?neighborhood=${'638ce78e88e91521eb0338c0'}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updatePetitions', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {

        // let req_fields = [];
        // if (this.setDate) {

        //   let startDate;
        //   let startTime;
        //   let endDate;
        //   let endTime;

        //   for (const field of this.fields) {
        //     if (field.id === 'startDate') {
        //       startDate = field;
        //     } else if (field.id === 'endDate') {
        //       endDate = field;
        //     } else if (field.id === 'startTime') { 
        //       startTime = field;
        //     } else if (field.id === 'endTime') {
        //       endTime = field;             
        //     } else {
        //       req_fields.push(field);
        //     }
        //   }

        //   const finalStartDate = startDate.value + "T" + startTime.value + ":00Z";
        //   req_fields.push({id: 'startDate', value: finalStartDate });

        //   const finalEndDate = endDate.value + "T" + endTime.value + ":00Z";
        //   req_fields.push({id: 'endDate', finalEndDate });

        //   console.log(finalEndDate);
        // } 
        // else {
        // }

        const req_fields = [...this.fields];

        if (this.neighborhoodId) {
          console.log(this.neighborhoodId);
          req_fields.push({id: 'neighborhoodId', value: this.neighborhoodId });
        }

        if (this.petitionId) {
          console.log(this.petitionId);
          req_fields.push({id: 'petitionId', value: this.petitionId });
        }

        if (this.petition) {
          req_fields.push({id: 'petitionId', value: this.petition._id });
        }

        options.body = JSON.stringify(Object.fromEntries(
          req_fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));

        console.log(options.body);
      }

      try {

        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        console.log(text);

        if (this.setEmail) {
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setEmail', res.user ? res.user.email : null);
          console.log(this.$store.state.userEmail);
        }

        if (this.setNeighborhood) {
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setNeighborhood', res.user ? res.user.neighborhood : null);
          console.log(this.$store.state.userNeighborhood);
        }

        if (this.refreshComments) {
          this.$store.commit('refreshForumPostComments', this.$route.params.postId);
        }

        if(this.refreshPosts){
          this.$store.commit('refreshForumPosts', this.neighborhoodId);

        }

        if (this.callback) {
          this.callback();
        }
        if (this.setUser){
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUserObject', res.user ? res.user : null);
          console.log("setting user: ", this.$store.state.userObject);
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
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

.button {
    padding: 5px;
    background-color: rgb(170, 85, 64);
    color: #fff;
    border: none;
    border-radius: 5px;
    font-weight: bold;
  }
</style>
