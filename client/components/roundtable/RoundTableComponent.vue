<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="roundtable"
  >


    <div style="width: 100%;  text-align: right">


      <font-awesome-icon
          v-if="$store.state.userObject._id === roundtable.authorId._id"
          class="trash"
          icon="fa-solid fa-trash"
          @click="deleteRoundTable"
      />
    </div>


    <h2>
      Roundtable on  {{ roundtable.roundTableName }}
    </h2>


      <div class="rt-info">
         <div>Host:</div>
        <div>{{ roundtable.authorId.firstName + " " + roundtable.authorId.lastName }}</div>
      </div>

    <div class="rt-info">
      <div>
        Start Date:
      </div>
      <div>
        {{ roundtable.startDate }}
      </div>

    </div>
    <div class="rt-info">
      <div>
        End Date:
      </div>
      <div>
        {{ roundtable.endDate }}
      </div>
    </div>

    <div style="width: 100%; text-align: center; margin-top: 16px;" @click="expand" >
      Associated Petition
      <div class="petition_container">
      <font-awesome-icon icon="fa-solid fa-file" />
        {{ roundtable.petitionId.title }}
    </div>
    </div>


      <!-- <modal :name="'rtModal' + this._uid"
             :width="500"
             :height="600"
             :adaptive="true">
        <p class = "x-icon" @click="hideModal">
          <font-awesome-icon icon="fa-solid fa-x" />
        </p>
        <PetitionComponent :petitionId="roundtable.petitionId._id"/>
      </modal> -->



    <p class="meetingLink">
      Video Meeting Link: <a :href="meetingLink"> {{ roundtable.zoomLink }}</a>
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
    expand() {
        this.$router.push({name: 'Petition Details', path: `/petition/${this.roundtable.petitionId._id}`, params: {petitionId: this.roundtable.petitionId._id, prevTab: 'roundtable'}});
      },
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
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  padding: 24px;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  /*background-color: #4CAF50;*/
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

.petition_container{
  border: 2px solid rgb(69, 150, 231);
  border-radius: 20px;
  padding: 12px;
  color: rgb(69, 150, 231);
  margin-top: 12px;
}
.petition_container:hover{
  cursor: pointer;
}
.rt-info{
  font-size: 18px;
  margin-top: 2px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  /*width: 100%;*/
}
.rt-info > div{
  margin-right: 12px;
  /*background-color: #4CAF50;*/
  /*width: 40%;*/
  /*text-align: left;*/
}
.trash:hover{
  cursor: pointer;
}
</style>
