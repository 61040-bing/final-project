<template>
  <section>
    <div class="example">
      <img
        src="https://www.cambridgema.gov/-/media/Images/citymanagersoffice/COVID19/cityhallbannerkyleklein.jpg"
      >
      <div class="img_overlay" />
      <div class="overlay">
        Wall of Honor
        <br>
        <br>
        <span class="winner">⭐ West Cambridge</span>
      </div>
      <div
        v-if="loaded || $route.params.id === undefined"
        class="name-overlay"
      >
        {{ pageName }}
      </div>
    </div>
    <nav class="navbar">
      <div
        :class="{selected: viewingTab ==='forum', hoverPointer: true}"
        @click="setViewingTab('forum')"
      >
        Forum
      </div>
      <div
        :class="{selected: viewingTab ==='petition', hoverPointer: true}"
        @click="setViewingTab('petition')"
      >
        Petitions
      </div>
      <div
        :class="{selected: viewingTab ==='roundtable', hoverPointer: true}"
        @click="setViewingTab('roundtable')"
      >
        RoundTables
      </div>
    </nav>
    <section class="content">
      <section
        v-if="viewingTab === 'forum'"
      >
        <ForumPage />
      </section>
      <section v-if="viewingTab === 'petition'">
        <PetitionsPage/>
      </section>
      <section v-if="viewingTab === 'roundtable'">
        <section
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
    </section>
  </section>
</template>

<script>
  import RoundTableComponent from '../roundtable/RoundTableComponent.vue';
  import ForumPage from '../Forum/ForumPage.vue';
  import PetitionsPage from '@/components/Petition/PetitionsPage.vue'; 

  export default {
    name: 'NeighborhoodPage',
    components: {ForumPage, RoundTableComponent, PetitionsPage},
    props: {

    },
    data() {
    return {
      viewingTab : "forum",
      neighborhood: {},
      loaded: false,
      cityId: '638ce78e88e91521eb0338c0'
    }
  },
  computed: {
    pageName() {
      return this.$route.params.id === undefined ? "Cambridge City Page" : this.neighborhood.name + " Neighborhood Page"
    }
  },
    mounted(){
      this.fetchNeighborhood()
      // this.$store.commit('refreshNeighborhoodRoundTables');
    },
    methods : {
      setViewingTab(tab){
        this.viewingTab = tab;
      },
       fetchMostActiveNeighborhood(){

       } ,

       async fetchNeighborhood(){
        const neighborhoodId = this.$route.params.id === undefined ? this.cityId : this.$route.params.id;
        const url = `/api/neighborhood/${neighborhoodId}`;
        const res = await fetch(url).then(async r => r.json());
      console.log(res);
      this.neighborhood = res;
      this.loaded=true;
       }
    }
  };
  </script>

<style scoped>

.example {
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
}
.example img {
  max-width:100%;
  max-height:100%;

}

.example .overlay {
  position: absolute;
  top: 50px;
  right: 50px;
  font-weight: bold;
  text-align: right;
  font-size: 25px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
  background: white;
  border-radius: 25px;
  padding:15px;
}

.example .name-overlay {
  position: absolute;
  top: 450px;
  left: 50px;
  font-weight: bold;
  text-align: right;
  font-size: 50px;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 25px;
  padding:15px;
}

.winner {
  font-size: 20px;
  font-weight: lighter;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}

.example .img_overlay{
  position:absolute;
  top:0;
  left:0;
  height:0;
  bottom:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
}
.navbar {
  font-size: 30px;
  padding: 0px;
  font-family: Arial;
  display: flex;
  flex-direction: row;
  gap: 300px;
  justify-content: center;
  background: rgb(198, 193, 193);
  padding: 20px;
}
.navbar p{
  cursor: pointer;
}
.content {
  margin-top: 50px;
  padding: 0px;
  font-family: Arial;
  width: 45%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.selected {
  color: rgb(170, 85, 64);
  font-weight: bolder;
}

.hoverPointer{

}
.hoverPointer:hover{
  cursor: pointer;
  color: rgb(170, 85, 64);
}
</style>
