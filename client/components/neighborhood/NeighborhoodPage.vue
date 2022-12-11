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
        <div
          class="info-woh"
          @click="showModal"
        >
          <font-awesome-icon icon="fa-solid fa-info" />
          <div class="learn-more-text">
            Learn more
          </div>
        </div>
      </div>

      <modal
        :name="'wohModal' + _uid"
        :width="400"
        :height="400"
        :adaptive="true"
      >
        <p
          class="x-icon"
          @click="hideModal"
        >
          <font-awesome-icon icon="fa-solid fa-x" />
        </p>
        <div style="margin: 16px">
          The wall of honor identifies the most active neighborhood in Cambridge in the past week.
          It is calculated by comparing petition and forum activity across neighborhoods, adjusted for
          neighborhood population.
        </div>
      </modal>

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
        <ForumPage :key="$route.name" />
      </section>
      <section v-if="viewingTab === 'petition'">
        <PetitionsPage />
      </section>
      <section v-if="viewingTab === 'roundtable'">
        <RoundTablePage />
      </section>
    </section>
  </section>
</template>

<script>
  import RoundTablePage from '../roundtable/RoundTablePage.vue';
  import ForumPage from '../Forum/ForumPage.vue';
  import PetitionsPage from '@/components/Petition/PetitionsPage.vue';

  export default {
    name: 'NeighborhoodPage',
    components: {ForumPage, PetitionsPage, RoundTablePage},
    props: {

    },
    data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification,
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
    },
    methods : {
      showModal(){
        this.$modal.show('wohModal' + this._uid);
      },
      hideModal(){
        this.$modal.hide('wohModal' + this._uid);
      },
      setViewingTab(tab){
        this.viewingTab = tab;
      },
       fetchMostActiveNeighborhood(){

       } ,

       async fetchNeighborhood(){
        try{
          const neighborhoodId = this.$route.params.id === undefined ? this.cityId : this.$route.params.id;
          const url = `/api/neighborhood/${neighborhoodId}`;
          const r = await fetch(url);
          if (!r.ok) {
            throw new Error(res.error);
          }
          const res = await r.json();
          this.neighborhood = res;
          this.loaded = true;
        }
        catch (e) {
            this.$set(this.alerts, e, 'e');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }

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
  top: 70%;
  left: 5%;
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
  
  font-family: Arial;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: rgb(198, 193, 193);
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
  background-color: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  text-align:center;
}

.hoverPointer{
  padding: 20px;
  height: 100%;
  width: 100%;
  text-align:center;
}
.hoverPointer:hover{
  cursor: pointer;
  color: rgb(170, 85, 64);
}

.info-woh{
  color: blue;
  font-weight: lighter;
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 14px;

}
.info-woh:hover{
  cursor: pointer;
}
.learn-more-text{
  text-decoration: underline;
  margin-left: 4px;
  font-size: 16px;

}

.x-icon{
  font-weight: bold;
  text-align: right;
  margin-top: 24px;
  margin-right: 24px;
  font-size: 24px;
}
.x-icon:hover{
  cursor: pointer;
}
</style>
