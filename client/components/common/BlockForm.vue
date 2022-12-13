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
        <label
          v-if="field.label !== 'Content'"
          :for="field.id"
        >{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          :placeholder="getPlaceholder(field.label)"
          @input="field.value = $event.target.value"
        />

        <input
          v-else-if="field.id === 'startDate' || field.id === 'endDate'"
          type="date" 
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
  

        <input
          v-else-if="field.id === 'startTime' || field.id === 'endTime'"
          type="time"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
        
        <input
          v-else
          :type="field.id === 'password' ? 'password' : (field.id === 'targetSignatures' ? 'number' : 'text')"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>

    <article v-else>
      <p>{{ content }}</p>
    </article>
    <section v-if="fetchPetition || fetchAuthorPetition">
      <div class="attachment">
        <div
          class="button"
          @click="toggleMenu"
        >
          Attach Petition
          <font-awesome-icon
            v-if="!displayMenu"
            icon="fa-solid fa-caret-down"
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-caret-up"
          />
        </div>
        <div
          v-if="petition"
          class="petitionPreview"
        >
          {{ petition.title }}
          <font-awesome-icon
            style="color: rgb(170, 85, 64);"
            icon="fa-solid fa-xmark"
            class="cancel"
            @click="removePetition"
          />
        </div>
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
      class="sub"
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
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission,
      neighborhoodId: null,
      petitionId: null,
      fetchPetition: false,
      fetchAuthorPetition: false,
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
    if (this.fetchAuthorPetition){
      this.fetchAuthorPetitions();
    }
  },
  methods: {
    getPlaceholder(label){
      if (label === 'Content'){
        return "What's on your mind?"
      }
      return "";
    },
    selectPetition(selectedPetition){
      this.petition = selectedPetition;
      const successMessage = "Attached petition successfully";
      this.$set(this.alerts, successMessage, 'success');
      setTimeout(() => this.$delete(this.alerts, successMessage), 2000);
      this.hideMenu();
    },
    removePetition(){
      this.petition = null;
      const successMessage = "Removed petition successfully";
      this.$set(this.alerts, successMessage, 'success');
      setTimeout(() => this.$delete(this.alerts, successMessage), 2000);
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
    async fetchAuthorPetitions(){
      const url = `/api/petitions`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        // const authorPetitions = res.filter(petition => (petition.authorId._id === this.$store.state.userObject._id));
        const authorPetitions = [];
        for (const petition of res){
          if (petition.author._id === this.$store.state.userObject._id && petition.submitted !== 'true'){
            authorPetitions.push(petition)
          }
        }
        this.$store.commit('updatePetitions', authorPetitions);
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

        let req_fields = [];

        if (this.setDate) {

          let startDate;
          let startTime;
          let endDate;
          let endTime;

          for (const field of this.fields) {
            if (field.id === 'startDate') {
              startDate = field;
            } else if (field.id === 'endDate') {
              endDate = field;
            } else if (field.id === 'startTime') { 
              startTime = field;
            } else if (field.id === 'endTime') {
              endTime = field;             
            } else {
              req_fields.push(field);
            }
          }

          let startHour = parseInt(startTime.value[0] + startTime.value[1]);
          startHour += 5;

          if (startHour >= 24) {
            startHour -= 24;
          }

          const newStartHour = startHour.toString().length === 2? startHour.toString() : "0" + startHour.toString();

          const finalStartDate = startDate.value + "T" + newStartHour + startTime.value[2] + startTime.value[3] + startTime.value[4] + ":00Z";
          req_fields.push({id: 'startDate', value: finalStartDate });

          let endHour = parseInt(endTime.value[0] + endTime.value[1]);
          endHour += 5;

          if (endHour >= 24) {
            endHour -= 24;
          }

          const newEndHour = endHour.toString().length === 2? endHour.toString() : "0" + endHour.toString();

          const finalEndDate = endDate.value + "T" + newEndHour + endTime.value[2] + endTime.value[3] + endTime.value[4]+ ":00Z";
          req_fields.push({id: 'endDate', value: finalEndDate });
        } 
        else {
          req_fields = [...this.fields];
        }

        if (this.neighborhoodId) {
          req_fields.push({id: 'neighborhoodId', value: this.neighborhoodId });
        }

        if (this.petitionId) {
          req_fields.push({id: 'petitionId', value: this.petitionId });
        }

        if (this.petition) {
          req_fields.push({id: 'petitionId', value: this.petition._id });
        }

        options.body = JSON.stringify(Object.fromEntries(
          req_fields.map(field => {
            const {id, value} = field;
            return [id, value];
          })
        ));
      }
      try {
        // if (this.url ==='/api/roundtables' && options.method === 'POST' && !options.body.petitionId ){
        //   throw new Error ("You need to pick a specific petition that the roundtable concerns")
        // }
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        this.petition = null;
        this.fields.map(field => {
            field.value = '';
        });
        
        if (this.setUser){
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUserObject', res.user ? res.user : null);
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
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  padding: 1rem;
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
   padding: 10px;
   border: 1.5px solid rgb(228, 228, 228);
   border-radius: 5px;
}

input {
  margin-bottom: 25px;
  border-radius: 5px;
  border: 1.5px solid rgb(228, 228, 228);
}

.attachment {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.petitionPreview {
  display: flex;
  flex-direction: row;
  gap: 25px;
  align-items: center;
}

.dropdown {
  z-index: 1;
  background: white;
  color: black;
  display: none;
  border: 1.5px solid rgb(228, 228, 228);
  border-radius: 0 0 0.5rem 0.5rem;
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

h3 {
  color: rgb(170, 85, 64);
}

.button {
    padding: 5px;
    padding-left: 20px;
    padding-right: 20px;
    color: rgb(170, 85, 64);
    background-color: #fff;
    border: 1px solid;
    border-radius: 5px;
    font-weight: bold;
    font-size: 15px;
    text-align: left;
    max-width: fit-content;
    min-width: fit-content;
  }

.button:hover {
  cursor: pointer;
}
  .sub{
    max-width: fit-content;
    min-width: fit-content;
    padding: 7px;
    background-color: rgb(170, 85, 64);
    color: #fff;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    
  }
  .cancel {
    cursor: pointer;
  }
</style>
