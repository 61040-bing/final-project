<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
    v-if="$store.state.userObject !== null"
  >
    <h3 class="accepted" v-if="(petition.accepted === 'true') && (petition.denied === 'false')"> Accepted </h3>
    <h3 class="denied" v-if="(petition.denied === 'true') && (petition.accepted === 'false')"> Denied </h3>
    <h3 class="pending" v-if="(petition.submitted === 'true') && (petition.denied === 'false') && (petition.accepted === 'false')"> Pending </h3>
    <h3 class="active" v-if="(petition.submitted === 'false') && (petition.denied === 'false') && (petition.accepted === 'false')"> Active </h3>

    <header class="freetHeader">
      <div class="mainInfo">

        <div class="row">
          <div class="title">
            {{( petition.title)}}
          </div>
          <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
            class="deleteAction">
            <button @click="deletePetition">
              🗑️ Delete
            </button>
          </div>
        </div>
        <p class="author">
          Created by {{( petition.author.firstName + " " +  petition.author.lastName)}} on {{ petition.dateCreated}}
        </p>
      </div>
    </header>
    <!-- <p
      class="content"
    >
      {{ petition.content }}
    </p> -->
   <!-- this needs class and left alignment -->
    <progress class="signProgress brown" :max="petition.targetSignatures" :value="signatures.length"> </progress>
    <p class="signatureProgress">
      {{signatures.length}} / {{petition.targetSignatures}} Signatures
    </p>
    <div class="allActions">
          <p class = "signature" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id == '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)">

            <button class="removeSignature" v-if="signed" @click="unsignPetition">
                💔 Remove Signature
            </button>

            <button v-else @click="signPetition">
                ❤️ Sign
            </button>
          </p>
      <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
        class="actions">
        <!-- <button @click="deletePetition">
          🗑️ Delete
        </button> -->
        <!-- <p class="info" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id == '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)"> -->
        <p class = "roundTable">
          <button @click="toggleScheduling">
            Schedule RoundTable
          </button>
        </p>

      <ScheduleRoundTableForm class="scheduleTab" v-if="schedulingRoundTable"
      :petition="petition"/>
      </div>
    </div>
    

    <router-link
      class="linkedPetition"
      :to="`/petition/${petition._id}`">
      <font-awesome-icon icon="fa-solid fa-file" />
      Open Petition
    </router-link>

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
      if (signature.authorId._id.toString() === this.$store.state.userObject._id.toString()) {
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
      alerts: {}, // Displays success/error messages encountered during freet modification
      signaturesLength :5,
      targetSignatures : 10,
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
            message: 'Successfully deleted petition!', status: 'success'
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
          this.$store.commit('refreshPetitions', this.$route.params.id);
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
          this.$store.commit('refreshPetitions', this.$route.params.id);
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
.freetHeader {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15%;
    text-align: left;
    
  }
 /* old */
.freet { 
    border: 1px solid rgb(228, 228, 228);
    padding: 24px;
    position: relative;
    margin: 10px;
    max-width: 100%;
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
    border-radius: 25px;
    font-family: Arial, Helvetica, sans-serif;
}
/* naomi */
.row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    /* column-gap: 300px; */
}
.allActions{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

/* naomi */
.roundTable{
border-radius: 15px;
}
.signature{
border-radius: 15px;
}
.deleteAction button {
  padding-left:5px;
  padding-right:5px;
}
/* naomi */
.author {
    font-size: 10px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 16px;
    
}
/* naomi */
.title{
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 16px;
    font-weight: bold;
}
.content{
  text-align: left;
}
.accepted {
  color: green;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
    text-align: left;
}
.mainInfo{
  width: 100%;
}
.denied {
  color: red;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
    text-align: left;
}

.pending {
  color: gray;
}

.active {
  color: white;
  font-size: small;
}
.signatureProgress{
  text-align: left;
}
.scheduleTab{
  z-index: 1;
  background-color: white;
}
.linkedPetition{
    color: rgb(69, 150, 231);
    text-align: left;
  }
.linkedPetition:hover{
    cursor: pointer;
  }
.signProgress{
  float: left;
  width: 50%;
  appearance: none;
  border-radius: 5px;
  margin-right: 16px;
}
.signProgress::-webkit-progress-bar {
  background: rgb(202, 196, 196);
  border-radius: 5px;
  
}
progress::-webkit-progress-value {
  background-color: rgb(170, 85, 64);
  border-radius: 5px;
}
.signatureProgress{
  font-size: 16px;
  max-width: 100%;
}
</style>
