<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div class="outerWrapper">

  <article v-if="(petition !== null)"
    class="freet"
  >
   <span class="back" @click="goBack">
      <font-awesome-icon
        icon="fa-solid fa-arrow-left"
      />
      Back
    </span>

    <h3 class="accepted" v-if="(petition.accepted === 'true')"> Accepted </h3>
    <h3 class="denied" v-if="(petition.denied === 'true')"> Denied </h3>
    <h3 class="pending" v-if="(petition.submitted === 'true') && (petition.denied === 'false') && (petition.accepted === 'false')"> Pending </h3>

  <div class="freetHeader">
      <div class="mainInfo">

        <div class="row">
          <p class="title">
            {{( petition.title)}}
          </p>
          <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
            class="deleteAction">
          <font-awesome-icon
            v-if="$store.state.userObject._id === petition.author._id"
            class="trash"
            icon="fa-solid fa-trash"
            @click="deletePetition"
        />
          </div>
        </div>
        <p class="author">
          Created by {{( petition.author.firstName + " " +  petition.author.lastName)}} on {{ petition.dateCreated}}
        </p>
      </div>
    </div>

  <p
    class="content"
  >
    {{ petition.content }}
  </p>
  <progress class="signProgress brown" :max="petition.targetSignatures" :value="signatures.length"> </progress>
  <p class="signatureProgress">
    {{signatures.length}} / {{petition.targetSignatures}} Signatures
  </p>
  <div class="detailsActions">
    <div class="signature" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id === '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)">

            <button class="signBtn" v-if="signed" @click="unsignPetition">
                Remove Signature
            </button>
            <button class="signBtn" v-else @click="signPetition">
              <font-awesome-icon
                class="icons"
                icon="fa-solid fa-pencil"
              />
                Sign
            </button>
    </div>
    <div v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
        class="actions">

      <button class="signBtn" @click="toggleScheduling">
        Schedule RoundTable
      </button>

      <ScheduleRoundTableForm class="scheduleTab" v-if="schedulingRoundTable"
      :petition="petition"/>
      </div>

      <button class="showSignatures" @click="toggleSignatures" v-if="!showingSignatures">
            Show Signatures: {{signatures.length}}
      </button>

        <button class="hideSignatures"  @click="toggleSignatures" v-if="showingSignatures">
            Hide Signatures
        </button>



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
    <section v-if="roundTables.length && $store.state.userObject.neighborhood._id === petition.neighborhood._id">

      <h3>RoundTables</h3>

      <div v-for="roundtable in roundTables">

        <div class="rountTable">
          <h1 class="roundTableTitle">{{roundtable.roundTableName}}</h1>
          <p>Start Date: {{roundtable.startDate}} </p>
          <p>End Date: {{roundtable.endDate}} </p>
          <p class="meetingLink">
              Video Meeting Link: <a :href="meetingLink(roundtable.zoomLink)" target="_blank"> {{ roundtable.zoomLink }}</a>
            </p>
      </div>
      </div>

    </section>
    <article
    v-else
    >
        <h3>No RoundTables found.</h3>
    </article>
  </article>
  </div>

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
    this.date = new Date();

    console.log(this.date);

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
      date: null,
      signatures: [],
      roundTables: [],
      showingSignatures: false,
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    meetingLink(zoomLink) {
      return zoomLink.includes("//") ? zoomLink : '//'+ zoomLink;
    },
    toggleScheduling() {
      this.schedulingRoundTable = !this.schedulingRoundTable;
    },
    toggleSignatures() {
      this.showingSignatures = !this.showingSignatures;
    },
    futureDate() {
      this.showingSignatures = !this.showingSignatures;
    },
    goBack() {
      if (this.$route.params.prevTab === 'profile') {
        this.$router.push({name: 'Profile', path: '/profile', params: {tab: 'petitions'}});
      } else if (this.$route.params.prevTab === 'profileForum') {
        this.$router.push({name: 'Profile', path: '/profile', params: {tab: 'posts'}});
      } else if (this.$route.params.prevTab === 'forumPost') {
        console.log(this.$route.params.prevPostPath);
        this.$router.push({name: 'Forum Post', path: `/forum/${this.$route.params.prevPostPath}`,  params: {postId: this.$route.params.prevPostPath}});
      } else {
        if (this.petition.neighborhood._id === "638ce78e88e91521eb0338c0") {
          this.$router.push({name: 'Home', path: '/', params: {tab: this.$route.params.prevTab}});
        } else {
          this.$router.push({name: 'Neighborhood', path: `/neighborhood/${this.petition.neighborhood._id}`, params: {id: this.petition.neighborhood._id, tab: this.$route.params.prevTab}});
        }
      }
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
          this.signatures = res;
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
  .back {
      color: rgb(170, 85, 64);
    }

    .back:hover {
      cursor: pointer;
    }
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

.rountTable {
  border: 1px solid rgb(228, 228, 228);
    padding: 20px;
    position: relative;
    margin: 10px;
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
    text-align: left;
    /* width: 100%; */

  }
.mainInfo{
  width: 100%;
}

.roundTableBtn {
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: medium;
}

.signBtn {
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: medium;
}
.signBtn:hover{
  cursor: pointer;
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
  color: white;
  background-color: green;
  border-radius: 20px;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
}

.denied {
  color: white;
  background-color: red;
  border-radius: 20px;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
  border: 1px;
}

.pending {
  color: white;
  background-color: gray;
  border-radius: 20px;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
  border: 1px;
}

.author {
    font-size: 14px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
}
.content{
  width: 100%;
}
/* naomi */
.title{
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 20px;
    margin-right: 30px;
    font-weight: bold;
}

.roundTableTitle {
  font-size: 20px;
    color: rgb(0, 0, 0);
    margin-bottom: 20px;
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
.showSignatures{
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: medium;
  height: fit-content;
}
.hideSignatures{
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: medium;
  height: fit-content;
}
.scheduleTab{
  z-index: 1;
  background-color: white;
}
.signProgress{
  float: left;
  width: 70%;
  appearance: none;
  border-radius: 5px;
  margin-top: 16px;
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
  margin-top: 16px;
  padding-top: 16px;
  color: rgb(170, 85, 64);
  font-weight: bold;
}
.trash {
  padding-left:15px;
  padding-right:5px;
  /* color: red; */
  color:black;
}
.outerWrapper{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 100px;
}

button{

}
button:hover{
  cursor: pointer;
}
</style>
