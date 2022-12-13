<!-- Default page that also displays freets -->

<template>
  <main class="page">
    <article class="cont">
      <div class="nav">
        <div>
          <h4>Submitted Petitions</h4>
          <hr>
        </div>
        <p
          :class="{selected: viewingTab ==='pending', navItem: true}"
          @click="setViewingTab('pending')"
        >
          Pending 
        </p>
        <p
          :class="{selected: viewingTab ==='accepted', navItem: true}"
          @click="setViewingTab('accepted')"
        >
          Accepted 
        </p>
        <p
          :class="{selected: viewingTab ==='denied', navItem: true}"
          @click="setViewingTab('denied')"
        >
          Denied 
        </p>
      </div>

      <div class="right">
          <GetAllPetitionsForm
            ref="getAllPetitionsForm"/>
        </div>

      <section class="content">
        <section
          v-if="viewingTab === 'pending'"
        >
        <section
            v-if="$store.state.petitions.length"
          >
            <h4>Pending Petitions</h4>
            <SubmittedPetitionComponent
              v-for="petition in $store.state.petitions" v-if="((petition.submitted === 'true') && !(petition.accepted === 'true') && !(petition.denied === 'true'))"
              :key="petition.id"
              :petition="petition"
              />
        </section>
        <section
            v-else
          >
            <h3>No petitions found.</h3>
          </section>
        </section>
        <section v-if="viewingTab === 'accepted'">
          <section
            v-if="$store.state.petitions.length"
          >
            <h4>Accepted Petitions</h4>
            <SubmittedPetitionComponent
              v-for="petition in $store.state.petitions" v-if="(petition.submitted === 'true' && petition.accepted === 'true')"
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
      <section v-if="viewingTab === 'denied'">
        <section
            v-if="$store.state.petitions.length"
          >
            <h4>Denied Petitions</h4>
            <SubmittedPetitionComponent
              v-for="petition in $store.state.petitions" v-if="(petition.submitted === 'true' && petition.denied === 'true')"
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
    </article>
  </main>
</template>

<script>
import SubmittedPetitionComponent from '@/components/Admin/SubmittedPetitionComponent.vue';
import GetAllPetitionsForm from '@/components/Admin/GetAllPetitionsForm.vue';

export default {
  name: 'SubmittedPetitionsPage',
  components: {SubmittedPetitionComponent, GetAllPetitionsForm},
  mounted() {
    this.$refs.getAllPetitionsForm.submit();
    for (const petition of this.$store.state.petitions) {
      if ((petition.submitted === 'true') && !(petition.accepted === 'true') && !(petition.denied === 'true')) {
        console.log(petition);
      }
    }
  },
  data() {
    return {
      posting: false,
      viewingTab : "pending"
    }
  },
  methods : {
      setViewingTab(tab){
      this.viewingTab = tab;
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

h4 {
  margin-bottom: 5px;
  color: rgb(67, 67, 67);
}
.navItem {
  padding: 5px;
  color: rgb(84, 84, 84);
}
.cont {
  display: flex;
  flex-direction: row;
  margin-left: 15%;
  gap: 50px;
  margin-top: 30px;
}
.nav {
  font-family: Arial;
  width: 20%;
  border-radius: 5px;;
  
}
.nav p{
  cursor: pointer;
  margin:5px;
}
.content {
  padding: 0px;
  font-family: Arial;
  width: 100%;
}
.selected {
  color: rgb(170, 85, 64);
  font-weight: bolder;
  background-color: rgb(170, 85, 64, 0.2);
  border-radius: 5px;
}

.page{
  width: 80%;
  font-size: 17px
}
</style>

