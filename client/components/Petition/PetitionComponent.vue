<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
    v-if="$store.state.userObject !== null"
  >
    <header class="freetHeader">
      <div class="mainInfo">

      <h3 class="accepted" v-if="(petition.accepted === 'true')"> Accepted </h3>

      <h3 class="denied" v-if="(petition.denied === 'true')"> Denied </h3>

      <p class="title">
        {{( petition.title)}}
      </p>

      <p class="author">
        Created by {{( petition.author.firstName + " " +  petition.author.lastName)}} on {{ petition.dateCreated}}
      </p>
    </div>
  </header>
    <p
      class="content"
    >
      {{ petition.content }}
    </p>

      <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
        class="actions">
        <button @click="deletePetition">
          🗑️ Delete
        </button>

        <button @click="toggleScheduling">
          Schedule RoundTable
        </button>

      <ScheduleRoundTableForm class="scheduleTab" v-if="schedulingRoundTable"
      :petition="petition"/>
      </div>

    <p class="info" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id == '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)">

      <button v-if="signed" @click="unsignPetition">
          💔 Remove Signature
      </button>

      <button v-else @click="signPetition">
          ❤️ Sign
      </button>
    </p>

    <p>
      {{signatures.length}} signatures
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>

  <router-link
    class="expand"
    :to="`/petition/${petition._id}`">
    Open Petition
  </router-link>

  </article>
</template>

<script>

import ScheduleRoundTableForm from '@/components/Petition/ScheduleRoundTableForm.vue';

export default {
  name: 'PetitionComponent',
  components: {ScheduleRoundTableForm},
  props: {
    // Data from the stored freet
    petition: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await this.getSignatures();

    this.neighborhood = this.$route.params.id;

    for (const signature of this.signatures) {
      console.log(signature.authorId.toString());
      if (signature.authorId.toString() === this.$store.state.userObject._id.toString()) {
        this.signed = true;
      }
    }
  },
  data() {
    return {
      signed: false,
      signatures: [],
      neighborhood: null,
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggleScheduling() {
      this.schedulingRoundTable = !this.schedulingRoundTable;
      console.log(this.petition.neighborhoodId);
    },
    deletePetition() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    signPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */

      console.log(this.petition._id);

      const params = {
        method: 'POST',
        message: 'Successfully signed petition!',
        body: JSON.stringify({petitionId: this.petition._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.signRequest(params);
    },
    unsignPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed signature from petition!',
        body: JSON.stringify({petitionId: this.petition._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.signRequest(params);
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
        this.$store.commit('refreshPetitions', this.$route.params.id);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async getSignatures() {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
        const options = {
          method: 'GET',
        };

        try {
        const r = await fetch(`/api/signatures?petition=${this.petition._id}`);
        const res = await r.json();
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
          }
          console.log(res.length);
          this.signatures = res;
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async signRequest(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */

      console.log(params.method);
      if (params.method === "DELETE") {
        const options = {
          method: params.method
        };
        try {
          const r = await fetch(`/api/signatures/${this.petition._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          await this.getSignatures();

          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.signed = false;
      } else {
        const options = {
          method: params.method, body: params.body, headers: {'Content-Type': 'application/json'}
        };

        try {

        console.log(options);
        const r = await fetch(`/api/signatures/${this.petition._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
          }
          await this.getSignatures();

          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.signed = true;
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

.author {
  font-size: medium;
}

.accepted {
  color: green;
}

.denied {
  color: red;
}

.scheduleTab{
  z-index: 1;
  background-color: white;
}
</style>
