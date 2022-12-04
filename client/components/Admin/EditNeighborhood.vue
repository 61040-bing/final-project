<template>
  <section>
    <div
      class="container"
      style="gap:20px"
    >
      <h3>Add Neighborhood</h3>
      <input
        v-model="name"
        placeholder="Neighborhood Name"
        type="text"
      >
      <textarea
        placeholder="Neighborhood Description"
        type="text"
        v-model="description"
      />
      <button @click="submitNeighborhood">
        Add
      </button>
    </div>
    
    
    <h3>Edit/Delete Neighborhood</h3>
    <div class="container">
      <NeighborhoodContainer
        v-for="neighborhood in $store.state.neighborhoods"
        :key="neighborhood.id"
        :neighborhood="neighborhood"
      />
    </div>
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
                description: ''
            }
        },
        methods: {
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
    gap: 50px;
    align-items: center;
  }

  input, textarea {
    width: 300px;
    font-family: Arial, Helvetica, sans-serif
  }

  button {
    width: 200px;
  }

  h3 {
    margin-bottom: 0px;
    font-family: Arial, Helvetica, sans-serif;
  }


    </style>