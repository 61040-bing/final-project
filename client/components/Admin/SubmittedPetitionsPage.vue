<!-- Default page that also displays freets -->

<template>
  <section v-if="$store.state.userEmail === 'admin@admin.com'">
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
        <SubmittedPetitionComponent
         v-for="petition in $store.state.petitions" v-if="petition.submitted"
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
</template>

<script>
import SubmittedPetitionComponent from '@/components/Admin/SubmittedPetitionComponent.vue';
import GetPetitionsForm from '@/components/Petition/GetPetitionsForm.vue';

export default {
  name: 'SubmittedPetitionsPage',
  components: {SubmittedPetitionComponent, GetPetitionsForm},
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
