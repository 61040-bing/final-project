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

      <div v-if="($store.state.userEmail === petition.author.email)"
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

    </header>

    <p
      class="content"
    >
      {{ petition.content }}
    </p>

    <p class="info">

      <button v-if="signed" @click="unsignPetition">
          💔 Remove Signature
      </button>

      <button v-else @click="signPetition">
          ❤️ Sign
      </button>

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

  <!-- <router-link
    class="expand"
    :to="`/petition/${petition._id}`">
    Open Petition
  </router-link> -->

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
  },
  data() {
    return {
      signed: false,
      signatures: [],
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    refreshProfile(user) {
      this.$store.commit('refreshPetitions', user);
    },
    toggleScheduling() {
      this.schedulingRoundTable = !this.schedulingRoundTable;
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
        this.$store.commit('refreshPetitions');
        //this.$store.commit('refreshPetitions', this.$store.state.username);

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
          const rSign = await fetch(`/api/signatures?petitionId=${this.petition._id}`);
          const resSign = await rSign.json();

          if (!rSign.ok) {
            throw new Error(resSign.error);
          }

          console.log(resSign);

          let signatureId;
          for (const signed of resSign) {
            if (signed.author === this.$store.state.userEmail) {
              signatureId = signed._id;
            }
          }

          console.log(signatureId);
          const r = await fetch(`/api/signatures/${signatureId}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshPetitions');

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
          this.$store.commit('refreshPetitions');

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

.scheduleTab{
  z-index: 1;
  background-color: white;
}
</style>
