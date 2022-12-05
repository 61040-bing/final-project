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
      refreshComments: false,
      refreshPosts: false,
      setUser: false
    };
  },
  methods: {
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

        // if (this.setDate) {
        //   const req_fields = [];

        //   for (const field of this.fields) {
        //     if (field.id !== 'startDate' && field.id !== 'endDate' && field.id !== 'startTime' && field.id !== 'endTime') {
        //       req_fields.push(field);
        //     }
        //   }
        //   const startDate = this.fields.startDate.value + "-" + this.fields.startTime.value;
        //   req_fields.push({id: 'startDate', value: startDate });

        //   const endDate = this.fields.endDate.value + "-" + this.fields.endTime.value;
        //   req_fields.push({id: 'endDate', endDate });
        // } 
        // else {
        //   const req_fields = [...this.fields];
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

        options.body = JSON.stringify(Object.fromEntries(
          req_fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
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
</style>
