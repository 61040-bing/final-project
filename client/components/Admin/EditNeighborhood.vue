<template>
  <section v-if="$store.state.userObject !== null && $store.state.userObject.email === 'admin@admin.com'">
    <div
      v-if="clicked"
      class="add"
      style="gap:20px"
    >
      Add Neighborhood
      <input
        v-model="name"
        placeholder="Neighborhood Name"
        type="text"
      >
      <textarea
        v-model="description"
        placeholder="Neighborhood Description"
        type="text"
      />
      <button @click="submitNeighborhood">
        Add
      </button>
    </div>
    <div
      v-else
      class="button"
      @click="clickAdd"
    >
      <span style="margin-left: 90px">Add Neighborhood</span>
      <img
        class=""
        src="../../public/plus.png"
      >
    </div>
    
    
    <h3 class="header">
      Modify Neighborhoods
    </h3>
    <div class="container">
      <NeighborhoodContainer
        v-for="neighborhood in $store.state.neighborhoods"
        :key="neighborhood.id"
        :neighborhood="neighborhood"
      />
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </section>
  <section v-else>
    Forbidden Access
  </section>
</template>
      
    <script>
    import NeighborhoodContainer from './NeighborhoodContainer.vue';
      export default {
        name: 'EditNeighborhood',
        components: {NeighborhoodContainer},
        data() {
            return {
                name: '',
                description: '',
                clicked: false,
                alerts: {}
            }
        },
        methods: {
          clickAdd(){
            this.clicked = true
          },
            async submitNeighborhood(){
                try {
                    const fields = {name: this.name, description: this.description};
                    const r = await  fetch(`/api/neighborhood/`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
                    if (!r.ok) {
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    this.$store.commit('refreshNeighborhoods');
                    this.name = '';
                    this.description = '';
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                }
            },
        }
      };
      </script>
      
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    align-items: center;
  }

  .add {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(170, 85, 64);
    border-radius: 10px;
    margin-top: 50px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    padding: 10px;
  }

  input, textarea {
    width: 370px;
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px;
  }

  input {

    font-size: 15px;;
  }

  textarea {
    height: 70px;
    font-size: 15px;;
  }

  button {
    padding: 5px;
    color: rgb(170, 85, 64);
    background-color: #fff;
    border: none;
    width: 50px;
    border-radius: 5px;
    font-weight: bold;
  }
  .button {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: row;
    margin: auto;
    width: 400px;
    border-radius: 3px;
    align-items: center;
    padding: 10px;
    margin-top: 50px;
    border-radius: 5px;
    gap: 20px;
    background-color: rgb(170, 85, 64);
    color: #fff
  }

  .button:hover {
    cursor: pointer;
  }

  h3 {
    font-family: Arial, Helvetica, sans-serif;
  }

  .header {
    margin-top: 70px;
    text-align: center
  }

  img {
    height: 20px;
    width: 20px;
    margin-left: 20px;
  }


    </style>