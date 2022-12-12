<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article v-if="(petition !== null)"
    class="freet"
  >
  <button
    class="back"
    @click="$router.go(-1)">
    Back
  </button>
  
  <header class="freetHeader">
      <div class="mainInfo">

        <h3 class="accepted" v-if="(petition.accepted === 'true')"> Accepted </h3>

        <h3 class="denied" v-if="(petition.denied === 'true')"> Denied </h3>

        <div class="row">
          <p class="title">
            {{( petition.title)}}
          </p>
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

  <p
    class="content"
  >
    {{ petition.content }}
  </p>

  <div class="detailsActions">
    <div class="signature" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id === '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)">

          <button v-if="signed" @click="unsignPetition">
              💔 Remove Signature
          </button>

          <button v-else @click="signPetition">
              ❤️ Sign
          </button>
    </div>
    <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
        class="actions">

      <button @click="toggleScheduling">
        Schedule RoundTable
      </button>

      <ScheduleRoundTableForm class="scheduleTab" v-if="schedulingRoundTable"
      :petition="petition"/>
      </div>
      <div class="showSignatures">
      <button @click="toggleSignatures" v-if="!showingSignatures">
            Show Signatures: {{signatures.length}}
      </button>
      <p class="showing">
        
        <button @click="toggleSignatures" v-if="showingSignatures">
            Hide Signatures
        </button>
      </p>
      
    </div>
  </div>
    <p
      v-if="showingSignatures"
      v-for="signature in this.signatures"
      class="signatures"
    >
      {{ signature.authorId.firstName + " " +  signature.authorId.lastName }}
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
    <section v-if="roundTables.length">
   
      <!-- {{formatDate(roundTable.startDate)}} -->
      <RoundTableComponent
        v-for="roundTable in roundTables"
        :key="roundTable.id"
        :roundTable="roundTable"
      />
    </section>
    <article
    v-else
    >
        <h3>No RoundTables found.</h3>
    </article>
  </article>

</template>

<script>

import ScheduleRoundTableForm from '@/components/Petition/ScheduleRoundTableForm.vue';
import RoundTableComponent from '@/components/roundtable/RoundTableComponent.vue';

const none_string = "Non"
export default {
  name: 'PetitionComponent',
  components: {ScheduleRoundTableForm, RoundTableComponent},
  props: {
    petitionId: {
      type : String,
      default: none_string,
    }
    },
  async mounted() {
    await this.getPetition();
    await this.getSignatures();
    await this.getRoundTables();

    for (const signature of this.signatures) {
      if (signature.authorId._id.toString() === this.$store.state.userObject._id.toString()) {
        this.signed = true;
      }
    }
  },
  data() {
    return {
      petition: null,
      signed: false,
      signatures: [],
      roundTables: [],
      showingSignatures: false,
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggleScheduling() {
      this.schedulingRoundTable = !this.schedulingRoundTable;
    },
    toggleSignatures() {
      this.showingSignatures = !this.showingSignatures;
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
    formatDate(date) {

      const months = ['JAN','FEB','MAR','April','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

      const dateSep = date.split('-');

      const day = dateSep[2];
      const month = dateSep[1];
      const year = dateSep[0];

      return months[parseInt(month)-1] + " " + day[0] +  day[1]  + ", " + year;
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
        this.$store.commit('refreshPetitions',this.petition.neighborhoodId._id);

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
          console.log(this.signatures);
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async getRoundTables() {
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
        const neighborhood = this.$route.params.id === undefined? '638ce78e88e91521eb0338c0': this.$route.params.id;
        const r = await fetch(`/api/roundtables?neighborhood=${neighborhood}&petition=${this.petition._id}`);
        const res = await r.json();
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
          }
          console.log(res.length);
          this.roundTables = res;
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async getPetition() {
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
        const r = await fetch(`/api/petitions`);
        const res = await r.json();
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
          }
          let localPetitionId;
          if (this.petitionId === none_string){
            localPetitionId = this.$route.params.petitionId.toString();
          } else{
            localPetitionId = this.petitionId;
          }
          for (const petition of res) {

            if (petition._id.toString() === localPetitionId) {
              this.petition = petition;
              break
            }
          }
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
          this.$store.commit('refreshPetitions',this.petition.neighborhoodId._id);
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
          this.$store.commit('refreshPetitions',this.petition.neighborhoodId._id);
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
    border: 1px solid rgb(228, 228, 228);
    padding: 24px;
    position: relative;
    margin: 3px;
    width: 75%;
    max-width: 100%;
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
    border-radius: 25px;
    font-family: Arial, Helvetica, sans-serif;
}
.freetHeader {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 40px;
    text-align: left;
    /* width: 100%; */
    
  }
.mainInfo{
  width: 100%;
}
.row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    /* column-gap: 300px; */
}
/* format this page once petition component is fixed */
/* figure out why petition fills whole page even when styling is done */
.accepted {
  color: green;
}

.denied {
  color: red;
}
.author {
    font-size: 10px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 16px;
    
}
.content{
  width: 100%;
}
/* naomi */
.title{
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 5px;
    margin-right: 30px;
    font-weight: bold;
}

.detailsActions{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* flex-basis: 33.33%; */
    /* width: 100%; */
}
.showing button{
  background-color: brown;
  color: white;
  border-radius: 5px;
}
.scheduleTab{
  z-index: 1;
  background-color: white;
}
</style>
