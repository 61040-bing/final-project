<template>
  <section
    class="buffer"
    v-if="$store.state.userObject"
  >
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

export default {
   name: 'RoundTablePage',
    components: {RoundTableComponent},
    props: {

    },
    data() {
        return {
        alerts: {}, // Displays success/error messages encountered during roundtable modification,
        cityId: '638ce78e88e91521eb0338c0'
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
    }


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
