<template>
  <section
    class="buffer"
    v-if="$store.state.userObject"
  >
  <!-- && authorPetitions.length -->
    <CreateRoundTableLinkedPetition 
      v-if="($store.state.userObject.neighborhood._id === $route.params.id || ($route.params.id === undefined && $store.state.userObject.email !== undefined)) 
      && $store.state.petitions.length  "
    />
    <section class="content"
          v-if="$store.state.neighborhoodRoundTables.length"
        >
          <RoundTableComponent
            v-for="roundtable in $store.state.neighborhoodRoundTables"
            :key="roundtable.id"
            :roundtable="roundtable"
          />
    </section>
    <article
        v-else
    >
        <h3>No RoundTables found.</h3>
    </article>
  </section>
  <section v-else>
    Login to View!
  </section>
</template>

<script>
import RoundTableComponent from '@/components/roundtable/RoundTableComponent.vue';
import CreateRoundTableLinkedPetition from '@/components/roundtable/CreateRoundTableLinkedPetition.vue';

export default {
   name: 'RoundTablePage',
    components: {RoundTableComponent, CreateRoundTableLinkedPetition},
    props: {

    },
    data() {
        return {
        alerts: {}, // Displays success/error messages encountered during roundtable modification,
        cityId: '638ce78e88e91521eb0338c0',
        authorPetitions: [],
        }
    },
    mounted(){
      this.fetchNeighborhood();
      if (this.$route.params.id === undefined ) {

        // console.log(this.$store.state.neighborhoodRoundTables);
        this.$store.commit('updateRoundTableFilter', this.cityId);
        // console.log('here', this.$store.state.neighborhoodRoundTableFilter );
        this.$store.commit('refreshNeighborhoodRoundTables', this.cityId);
        // console.log(this.$store.state.neighborhoodRoundTables)
      } else {
        this.$store.commit('updateRoundTableFilter', this.$route.params.id);
        this.$store.commit('refreshNeighborhoodRoundTables', this.$route.params.id );
      }

      // const url = `/api/petitions`;
      // try {
      //   const r = await fetch(url);
      //   const res = await r.json();
      //   if (!r.ok) {
      //     throw new Error(res.error);
      //   }
      //   console.log("about to begin filter in round table page")
      //   this.authorPetitions = res.filter(petition => (petition.author._id === this.$store.state.userObject._id));
        
      //   console.log("petitions found", this.authorPetitions)
      // } catch (e) {
      //   this.$set(this.alerts, e, 'error');
      //   setTimeout(() => this.$delete(this.alerts, e), 3000);
      // }
    },
  }

</script>


<style scoped>
    .content {
    margin-top: 50px;
    padding: 0px;
    font-family: Arial;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    }
</style>
