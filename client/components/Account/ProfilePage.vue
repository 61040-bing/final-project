<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main class="page">
    <article class="cont">
      <div class="nav">
        <div>
          <h4>Profile</h4>
          <hr>
        </div>
        <p
          :class="{selected: viewingTab ==='settings', navItem: true}"
          @click="setViewingTab('settings')"
        >
          Account Settings
        </p>
        <p
          :class="{selected: viewingTab ==='petitions', navItem: true}"
          @click="setViewingTab('petitions')"
        >
          Your Petitions
        </p>
        <p
          :class="{selected: viewingTab ==='posts', navItem: true}"
          @click="setViewingTab('posts')"
        >
          Your Posts
        </p>
      </div>
      <section class="content">
        <section
          v-if="viewingTab === 'settings'"
        >
          <AccountSettings />
        </section>
        <section v-if="viewingTab === 'petitions'">
          <section
            v-if="$store.state.petitions.length"
          >
            <h4>Petitions</h4>
            <hr>
            <h4>Active</h4>
            <PetitionComponent
              v-for="petition in activePetitions"
              :key="petition.id"
              :petition="petition"
            />
            <div v-if="!activePetitions.length">
              No Petitions Found!
            </div>

            <h4>Submitted To City Council</h4>
            <PetitionComponent
              v-for="petition in submittedPetitions"
              :key="petition.id"
              :petition="petition"
            />
            <div v-if="!submittedPetitions.length">
              No Petitions Found!
            </div>
          </section>
          <article
            v-else
          >
            <h3>No petitions found.</h3>
          </article>
        </section>
      </section>
      <section v-if="viewingTab === 'posts'">
        Posts
      </section>
    </article>
    
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </main>
</template>

  <script>
  import LogoutForm from '@/components/Account/LogoutForm.vue';
  import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
  import AccountSettings from "./AccountSettings";
  import GetPetitionsForm from '@/components/Petition/GetPetitionsForm.vue';
  import PetitionComponent from '@/components/Petition/PetitionComponent.vue';

  export default {
    name: 'ProfilePage',
    components: {
      AccountSettings,
      LogoutForm,
      DeleteAccountForm,
      GetPetitionsForm,
      PetitionComponent
    },
    data(){
      return {
        viewingTab : "settings"
      }
    },
    computed: {
      activePetitions(){
        return this.$store.state.petitions.filter((petition)=> {
          return !(petition.submitted === 'true') && (this.$store.state.userObject.email === petition.author.email);
        })
      },
      submittedPetitions(){
        return this.$store.state.petitions.filter((petition)=> {
          return (petition.submitted === 'true') && (this.$store.state.userObject.email === petition.author.email)
        })
      },
    },
    mounted() {
      this.$refs.getPetitionsForm.submit();
    },
    methods : {
      setViewingTab(tab){
      this.viewingTab = tab;
    }
    },
  };
  </script>

<style scoped>

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
  width: 45%;
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
