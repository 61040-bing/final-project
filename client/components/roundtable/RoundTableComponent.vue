<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="roundtable"
  >
    <header>
      <h3 class="author">
        Created by @{{ roundtable.authorId.firstName + " " + roundtable.authorId.lastName }}
      </h3>
      <div
        v-if="$store.state.userObject._id === roundtable.authorId._id"
        class="actions"
      >
        <button @click="deleteRoundTable">
          🗑️ Delete
        </button>
      </div>
    </header>
    <p class="roundTableName">
      Name: {{ roundtable.roundTableName }}
    </p>

    <p
      class="petition"
    >
      Roundtable on "{{ roundtable.petitionId.title }}" petition
    </p>


      <div @click="showModal" class="linkedPetitionButton"> Open Petition</div>
      <modal :name="'rtModal' + this._uid"
             :width="500"
             :height="600"
             :adaptive="true">
        <p class = "x-icon" @click="hideModal">
          <font-awesome-icon icon="fa-solid fa-x" />
        </p>
        <PetitionComponent :petitionId="roundtable.petitionId._id"/>
      </modal>


    <p class="start">
      Starts at {{ roundtable.startDate }}
    </p>
    <p class="end">
      Ends at {{ roundtable.endDate }}
    </p>
    <p class="meetingLink">
      Meeting Link: <a :href="meetingLink"> {{ roundtable.zoomLink }}</a>
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
  </article>
</template>

<script>
import PetitionComponent from "../Petition/PetitionDetails";

export default {
  name: 'RoundTableComponent',
  components:{
    PetitionComponent,
  },
  props: {
    // Data from the stored RoundTable
    roundtable: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during roundtable modification
    };
  },
  computed : {
    meetingLink() {
      return this.roundtable.zoomLink.includes("//") ? this.roundtable.zoomLink : '//'+this.roundtable.zoomLink;
    }
  },
  mounted() {
    console.log(this.roundtable);
  },
  methods: {

    showModal(){
      this.$modal.show("rtModal" + this._uid);
    },
    hideModal(){
      this.$modal.hide("rtModal" + this._uid);
    },

    deleteRoundTable() {
      /**
       * Deletes this roundTable.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted round Table!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the roundtable's endpoint
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
        const r = await fetch(`/api/roundtables/${this.roundtable._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('updateRoundTableFilter', this.roundtable.neighborhoodId);
        this.$store.commit('refreshNeighborhoodRoundTables', this.$store.state.neighborhoodRoundTableFilter);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.roundtable {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    height:20%;
    /* height: 200px;
    width:50%; */

    /* background: lightgoldenrodyellow; */
}
.linkedPetitionButton{
  text-decoration: underline;
  color: blue;

}
.linkedPetitionButton:hover{
  cursor: pointer;
}
.x-icon{
  font-weight: bold; text-align: right; margin-top: 24px; margin-right: 24px; font-size: 24px;
}
.x-icon:hover{
  cursor: pointer;
}
</style>
