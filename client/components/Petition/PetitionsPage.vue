<!-- Default page that also displays freets -->

<template>
  <main>
    <div v-if="$store.state.userEmail && ($route.params.id === $store.state.userNeighborhood._id || $route.params.id === undefined)" class="freetButton">
    <button class="freetPost" @click="posting = true"> Create a New Petition </button>
  </div>

  <main class="page">
      <div class="modal-backdrop" v-if="posting">
        <div class="entire">
          
          <button class="close" @click="posting = false">X</button>
          <div class="mainActions">
            
            <h3>Create A Petition</h3>
          </div>
          <CreatePetitionForm/>
        </div>
      </div>
      
    <section>
      <header>
        <div class="left">
        </div>
        <div class="right">
          <GetPetitionsForm
            ref="getPetitionsForm"/>
        </div>
      </header>
      <section
        v-if="$store.state.petitions.length"
      >
        <PetitionComponent
          v-for="petition in $store.state.petitions"
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
  </main>
</main>
</template>

<script>
import PetitionComponent from '@/components/Petition/PetitionComponent.vue';
import GetPetitionsForm from '@/components/Petition/GetPetitionsForm.vue';
import CreatePetitionForm from '@/components/Petition/CreatePetitionForm.vue';

export default {
  name: 'PetitionsPage',
  components: {PetitionComponent, GetPetitionsForm, CreatePetitionForm},
  mounted() {
    this.$refs.getPetitionsForm.submit();
  },
  data() {
    return {
      posting: false,
    }
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}
</style>
