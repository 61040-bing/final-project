<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    v-if="$store.state.userObject !== null"
    class="freet"
  >
    <h3
      v-if="(petition.accepted === 'true') && (petition.denied === 'false')"
      class="accepted"
    >
      Accepted
    </h3>
    <h3
      v-if="(petition.denied === 'true') && (petition.accepted === 'false')"
      class="denied"
    >
      Denied
    </h3>
    <h3
      v-if="(petition.submitted === 'true') && (petition.denied === 'false') && (petition.accepted === 'false')"
      class="pending"
    >
      Pending
    </h3>
    <h3
      v-if="(petition.submitted === 'false') && (petition.denied === 'false') && (petition.accepted === 'false')"
      class="active"
    >
      Active
    </h3>

    <div class="freetHeader">
      <div class="mainInfo">
        <div class="row">
          <div class="title">
            {{ ( petition.title) }}
          </div>
          <div
            v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
            class="deleteAction"
          >
            <font-awesome-icon
              v-if="$store.state.userObject._id === petition.author._id"
              class="trash"
              icon="fa-solid fa-trash"
              @click="deletePetition"
            />
          <!-- <button> 🗑️ </button> -->
          </div>
        </div>
        <p class="author">
          Created by {{ ( petition.author.firstName + " " + petition.author.lastName) }} on {{ petition.dateCreated }}
        </p>
      </div>
    </div>
    <!-- <p
      class="content"
    >
      {{ petition.content }}
    </p> -->
    <!-- this needs class and left alignment -->
    <progress
      class="signProgress brown"
      :max="petition.targetSignatures"
      :value="signatures.length"
    />
    <span class="signatureProgress">
      {{ signatures.length }} / {{ petition.targetSignatures }} Signatures
    </span>
    <div class="allActions">
      <p
        v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id == '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)"
        class="signature"
      >
        <button
          v-if="signed"
          class="signBtn"
          @click="unsignPetition"
        >
          Remove Signature
        </button>
        <button
          v-else
          class="signBtn"
          @click="signPetition"
        >
          <font-awesome-icon
            class="icons"
            icon="fa-solid fa-pencil"
          />
          Sign
        </button>
      </p>
      <div
        v-if="!(petition.submitted === 'true') && ($store.state.userObject.email === petition.author.email)"
        class="actions"
      >
        <!-- <button @click="deletePetition">
          🗑️ Delete
        </button> -->
        <!-- <p class="info" v-if="!(petition.submitted === 'true') && (petition.neighborhoodId._id == '638ce78e88e91521eb0338c0'|| $store.state.userObject.neighborhood._id === petition.neighborhoodId._id)"> -->

        <p class="roundTable">
          <button
            class="roundTableBtn"
            @click="showModal"
          >
            Schedule RoundTable
          </button>
        </p>

        <modal :name="'createRtModal' + this._uid"
               :width="500"
               :height="700"
               :adaptive="true">
          <p class = "x-icon" @click="hideModal">
            <font-awesome-icon icon="fa-solid fa-x" />
          </p>
          <ScheduleRoundTableForm
            class="scheduleTab"
            :petition="petition"
            @hide="hideModal"
          />
        </modal>
      </div>
    </div>

    <div
      class="linkedPetition"
      @click="expand"
    >
      <font-awesome-icon icon="fa-solid fa-file" />
      View More...
    </div>

    <section class="alerts" >
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
  data() {
    return {
      neighborhood: null,
      schedulingRoundTable: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  computed: {
    signed (){
      for (const signature of this.signatures) {
        if (signature.author._id.toString() === this.$store.state.userObject._id.toString()) {
          return true;
        }
      }
    return false;
    },
    signatures() {
      return this.petition.signatures;
    }
  },
  async mounted() {
    this.neighborhood = this.$route.params.id;

  },
  methods: {
    showModal(){
      this.$modal.show("createRtModal" + this._uid);
    },
    hideModal(){
      this.$modal.hide("createRtModal" + this._uid);
    },
    toggleScheduling() {
      this.schedulingRoundTable = !this.schedulingRoundTable;
    },
    expand() {
      if (this.$router.currentRoute.name === "Profile") {
        this.$router.push({name: 'Petition Details', path: `/petition/${this.petition._id}`, params: {petitionId: this.petition._id, prevTab: 'profile'}});
      } else {
        this.$router.push({name: 'Petition Details', path: `/petition/${this.petition._id}`, params: {petitionId: this.petition._id, prevTab: 'petition'}});
      }
    },
    deletePetition() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$set(this.alerts, 'Successfully deleted petition!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully deleted petition!'), 3000);
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
          const neighborhoodId = this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id;
          this.$store.commit('refreshPetitions', neighborhoodId);

          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
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

          const neighborhoodId = this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id;
          this.$store.commit('refreshPetitions', neighborhoodId);

          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
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

.roundTableBtn {
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: medium;
}
.roundTableBtn:hover{
  cursor: pointer;
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
.signature{
border-radius: 15px;
}
.trash {
  padding-left:15px;
  padding-right:5px;
  /* color: red; */
  color: black;
}
.trash:hover{
  cursor: pointer;
}
/* naomi */
.author {
    font-size: 14px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 30px;

}
/* naomi */
.title{
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 1px;
    font-weight: bold;
}

.content{
  text-align: left;
}
.mainInfo{
  width: 100%;
}
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

.active {
  color: white;
  font-size: small;
}
.signatureProgress{
  text-align: left;
  margin-left: 16px;
}
.scheduleTab{
  z-index: 1;
  background-color: white;
}
.linkedPetition{
    color: rgb(69, 150, 231);
    text-align: center;
    margin-top: 28px;
  }
.linkedPetition:hover{
    cursor: pointer;
  }
.signProgress{
  float: left;
  width: 50%;
  appearance: none;
  border-radius: 5px;
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
</style>
