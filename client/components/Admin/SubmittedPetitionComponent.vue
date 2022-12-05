<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header class="freetHeader">
      <div class="mainInfo">
      <p class="author">
        {{( petition.author.firstName + " " +  petition.author.lastName)}}
      </p>

      <p class="date">
      Posted at {{ petition.dateCreated}}
      </p>
    </div>

    </header>

    <p
      class="content"
    >
      {{ petition.content }}
    </p>

    <!-- <p class="info">

      <button @click="unsignPetition">
        ❌ Deny

      </button>

      <button @click="signPetition">
        ✅ Accept
      </button>

    </p> -->
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
</template>

<script>

export default {
  name: 'SubmittedPetitionComponent',
  components: {},
  props: {
    // Data from the stored freet
    petition: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      signed: false,
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    acceptPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */

      // console.log(this.petition._id);

      // const params = {
      //   method: 'POST',
      //   message: 'Successfully signed petition!',
      //   body: JSON.stringify({petitionId: this.petition._id}),
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // };
      // this.signRequest(params);
    },
    denyPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */
      // const params = {
      //   method: 'DELETE',
      //   message: 'Successfully removed signature from petition!',
      //   body: JSON.stringify({petitionId: this.petition._id}),
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // };
      // this.signRequest(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/petitions/${this.petition._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshPetitions');
        //this.$store.commit('refreshPetitions', this.$store.state.username);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>

.freet {
    border: 0.5px solid rgb(228, 228, 228);
    padding: 20px;
    position: relative;
    border-radius: 3px;
    margin: 3px;
    font-family: Arial, Helvetica, sans-serif;
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

.expand:link {
  color:deepskyblue;
  text-decoration: none;
}

.expand:visited{
  color:deepskyblue;
  text-decoration: none;
}

.authorLink:link {
  color:black;
  text-decoration: none;
}

.authorLink:visited{
  color:black;
  text-decoration: none;
}


</style>
