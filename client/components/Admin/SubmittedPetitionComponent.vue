<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="petition"
  >
  <div>
        <h3 class="accepted" v-if="(petition.accepted === 'true') && (petition.denied === 'false')"> Accepted </h3>
        <h3 class="denied" v-if="(petition.denied === 'true') && (petition.accepted === 'false')"> Denied </h3>
        <h3 class="pending" v-if="(petition.submitted === 'true') && (petition.denied === 'false') && (petition.accepted === 'false')"> Pending </h3>
      </div>

  <div class="petitionHeader">

      <div class="mainInfo">

        <div class="row">
          <div class="title">
            {{( petition.title)}}
          </div>
          <div class="neighborhood">
            Neighborhood: {{petition.neighborhoodId.name}}
          </div>
        </div>
        <p class="author">
          Created by {{( petition.author.firstName + " " +  petition.author.lastName)}} on {{ petition.dateCreated}}
        </p>
      </div>
    </div>

  <div class="content">
      <div class="petContent" v-if="showingDescription">
        {{ petition.content }}
    </div>

  <a
    v-if="showingDescription"
    @click="toggleDescp"
    class="toggle">
    Hide Description
    </a>

    <a
    v-else
    @click="toggleDescp"
    class="toggle">
    See Description
    </a>
  </div>

  <div>
    <progress class="signProgress brown" :max="petition.targetSignatures" :value="petition.targetSignatures"> </progress>
    <p class="signatureProgress">
      {{petition.targetSignatures}} / {{petition.targetSignatures}} Signatures
    </p>

    <p class="info" v-if="petition.accepted !== 'true' && petition.denied !== 'true' ">

      <button class="denyBtn" @click="denyPetition">
        Deny
      </button>

      <button class="acceptBtn" @click="acceptPetition">
        Accept
      </button>
    </p>
  </div>

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
      showingDescription: false,
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggleDescp() {
      this.showingDescription = !this.showingDescription;
    },
    acceptPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */
      const params = {
        method: 'PUT',
        message: 'Successfully accepted petition!',
        body: JSON.stringify({accept: true}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    denyPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */
      const params = {
        method: 'PUT',
        message: 'Successfully declined petition!',
        body: JSON.stringify({deny: true}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
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
        this.$store.commit('refreshPetitions');

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

.petition {
  border: 1px solid rgb(228, 228, 228);
    padding: 24px;
    position: relative;
    margin: 10px;
    max-width: 100%;
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
    font-family: Arial, Helvetica, sans-serif;
}

.petitionHeader {
  display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}

.sign{
  color: green;
  align-self: right;
  font-size: medium;
}

.signatureInfo {
  display: flex;
  justify-content: space-between;
}

.signatures {
  background-color: green;
  width: 100%;
  border-radius: 20px;
  color: green;
  margin-top: 5%;
}

.pending{
  color: white;
  background-color: black;
  border-radius: 20px;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
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

.denyBtn{
  color: white;
  background-color: red;
  border-radius: 20px;
  border-color: red;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
  font-size: large;
  font-weight: bold;
  margin-right: 5%;
}

.acceptBtn{
  color: white;
  background-color: green;
  border-radius: 20px;
  border-color: green;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
  font-size: large;
  font-weight: bold;
}

.toggle {
  color: rgb(0, 166, 255);
  font-size: medium;
}
.toggle:hover{
  cursor: pointer;
}
.title{
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 16px;
    font-weight: bold;
}
.author {
  font-size: 12px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 16px;
}

.content {
  font-size: 120%;
}

.neighborhood{
  font-size: 100%;
  margin-top: 5%;
}

.signProgress{
  float: left;
  width: 50%;
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

button{

}
button:hover{
  cursor: pointer;
}
/* .mainInfo {
  display: flex;
  justify-content: space-between;
} */



</style>
