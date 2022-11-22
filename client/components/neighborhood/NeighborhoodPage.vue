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
      <div class="name-overlay">
        {{ pageName }}
      </div>
    </div>
    <nav class="navbar">
      <div
        :class="{selected: viewingTab ==='forum'}"
        @click="setViewingTab('forum')"
      >
        Forum
      </div>
      <div
        :class="{selected: viewingTab ==='petition'}"
        @click="setViewingTab('petition')"
      >
        Petitions
      </div>
      <div
        :class="{selected: viewingTab ==='roundtable'}"
        @click="setViewingTab('roundtable')"
      >
        RoundTables
      </div>
    </nav>
    <section class="content">
      <section
        v-if="viewingTab === 'forum'"
      >
        Forum
      </section>
      <section v-if="viewingTab === 'petition'">
        Petition
      </section>
      <section v-if="viewingTab === 'roundtable'">
        RoundTable
      </section>
    </section>
  </section>
</template>
  
<script>

  export default {
    name: 'NeighborhoodPage',
    components: {},
    props: {

    },
    data() {
    return {
      viewingTab : "forum",
      pageName: this.$route.params.name === undefined ? "Cambridge City Page" : this.$route.params.name + " Neighborhood Page"
    }
  },
    mounted(){
      console.log(this.$route.params.name)
    },
    methods : {
      setViewingTab(tab){
        this.viewingTab = tab;
      },
       fetchMostActiveNeighborhood(){

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
</style>