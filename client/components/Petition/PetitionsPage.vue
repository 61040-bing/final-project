<!-- Default page that also displays freets -->

<template>
  <section>
    <div
      v-if="$store.state.userObject && ($route.params.id === $store.state.userObject.neighborhood._id || $route.params.id === undefined)"
      class="freetButton"
    >
      <button
        class="createBtn"
        @click="showModal"
      >
        Create a New Petition
      </button>
    </div>

    <section
      v-if="$store.state.userObject && $store.state.userObject.neighborhood"
      class="page"
    >
      <modal
        :name="'cpModal' + _uid"
        :width="400"
        :height="500"
        :adaptive="true"
      >
        <p
          class="x-icon"
          @click="hideModal"
        >
          <font-awesome-icon icon="fa-solid fa-x" />
        </p>
        <div class="mainActions">
          <!-- <h3>Create A Petition</h3> -->
        </div>
        <CreatePetitionForm
          @hide="hideModal"
          @success="successMessage"
        />
      </modal>

      <section
        class="alerts"
        style="position: relative"
      >
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>

      <section>
        <header>
          <div class="left" />
          <div class="right">
            <GetPetitionsForm
              ref="getPetitionsForm"
            />
          </div>
        </header>
        <section
          v-if="$store.state.petitions.length"
        >
          <h2>Active Petitions</h2>
          <PetitionComponent
            v-for="petition in $store.state.petitions"
            v-if="!(petition.submitted === 'true')"
            :key="petition.id"
            :petition="petition"
          />

          <h2>Submitted Petitions</h2>
          <PetitionComponent
            v-for="petition in $store.state.petitions"
            v-if="(petition.submitted === 'true')"
            :key="petition.id"
            :petition="petition"
          />
        </section>
        <article
          v-else
        >
          <h3>No petitions found.</h3>
        </article>
      </section>
    </section>
    <section v-else>
      Login to View!
    </section>
  </section>
</template>

<script>
import PetitionComponent from '@/components/Petition/PetitionComponent.vue';
import GetPetitionsForm from '@/components/Petition/GetPetitionsForm.vue';
import CreatePetitionForm from '@/components/Petition/CreatePetitionForm.vue';

export default {
  name: 'PetitionsPage',
  components: {PetitionComponent, GetPetitionsForm, CreatePetitionForm},

  data() {
    return {
      posting: false,
      alerts: {}
    }
  },
  mounted() {
    this.$refs.getPetitionsForm.submit();
  },
  methods: {
    showModal(){
      this.$modal.show('cpModal' + this._uid);
    },
    hideModal(){
      this.$modal.hide('cpModal' + this._uid);
    },
    successMessage(){
      const message = 'Successfully created a petition!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
    }
  },
};
</script>

<style scoped>
.page {
  margin: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
h2 {
  color: brown;
  text-align: center;
}
section {
  display: flex;
  flex-direction: column;
}
.x-icon{
  font-weight: bold; text-align: right; margin-top: 24px; margin-right: 24px; font-size: 24px;
}
.x-icon:hover{
  cursor: pointer;
}

.createBtn {
  margin:auto;
  width: 100%;
  background-color: rgb(170, 85, 64);
  font-weight: bold;
  color: white;
  border-radius: 10px;
  border-color: rgb(170, 85, 64);
  font-size: larger;
  padding: 25px;
}
button{
}
button:hover{
  cursor: pointer;
}
</style>

