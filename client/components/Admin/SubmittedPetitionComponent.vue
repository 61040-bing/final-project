<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template> 
  <article
    class="petition"
  >
  <header class="petitionHeader">
      <div class="credentials">

      <div class="accepted" v-if="(petition.accepted === 'true')">
        <h3> Accepted </h3>
      </div>

      <h3 class="denied" v-if="(petition.denied === 'true')"> Denied </h3>

      <div class="mainInfo">
      <p class="title">
        {{( petition.title)}}
      </p>

      <p class="neighborhood">
        Neighborhood: {{petition.neighborhoodId.name}}
      </p>
    </div>
    </div>
      <p class="author">
        Created by {{( petition.author.firstName + " " +  petition.author.lastName)}} on {{ petition.dateCreated}}
      </p>
  </header>

  <div class="content">
    <p
      class="petContent"
    >
      {{ petition.content }}
    </p>

    <div class="signatures">
      .
    </div>

    <div class="signatureInfo">
      <div class="sign">
        0
      </div>

      <div class="sign" v-if="petition.targetSignatures === '1'">
        {{petition.targetSignatures}} total signature
      </div>

      <div class="sign" v-else>
        {{petition.targetSignatures}} total signatures 
      </div>
    </div>

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
      schedulingRoundTable: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    acceptPetition() {
      /**
       * Updates freet to have the submitted draft content.
       */
      console.log(this.petition._id);
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
        console.log(this.$store.state.petitions);

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
    border: 0.5px solid rgb(228, 228, 228);
    padding: 5%;
    position: relative;
    border-radius: 3px;
    margin: 5%;
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
}

.petitionHeader {
  margin-bottom: 20%;
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
}

.denyBtn{
  color: white;
  background-color: red;
  border-radius: 20px;
  border-color: red;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
}

.acceptBtn{
  color: white;
  background-color: green;
  border-radius: 20px;
  border-color: green;
  width: fit-content;
  padding-left: 2%;
  padding-right: 2%;
}

.title {
  font-size: 150%;
}
.author {
  font-size: medium;
}

.content {
  font-size: 120%;
}

.neighborhood{
  font-size: 100%;
  margin-top: 5%;
}

.mainInfo {
  display: flex;
  justify-content: space-between;
}

.freetHeader {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 90%;
    text-align: left;
    
  }
 /* old */
.freet { 
    border: 1px solid rgb(228, 228, 228);
    padding: 24px;
    position: relative;
    margin: 3px;
    max-width: 100%;
    /* height: 250px; */
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
.roundtableAndSignatureRow{
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

.denied {
  color: red;
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




</style>
