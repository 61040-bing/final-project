<template>
  <section>
    <button>
      <span v-if="!editing">{{ neighborhood.name }} </span> 
      <textarea
        v-if="editing"
        :value="draft"
        @input="draft = $event.target.value"
      />
  
      <img
        v-if="!editing"
        src="../../public/pencil.png"
        @click="startEditing"
      >
      <img
        v-if="editing"
        src="../../public/yes.png"
        @click="submitEdit"
      >
      <img
        v-if="editing"
        src="../../public/no.png"
        @click="stopEditing"
      >
      <img src="../../public/trash.png"
      @click="deleteNeighborhood">
    </button>
  </section>
</template>
        
<script>
    export default {
        name: 'NeighborhoodContainer',
        components: {},
        props: {
        neighborhood: {
            type: Object,
            required: true
            }
        },
        data() {
            return {
                editing: false,
                draft: this.neighborhood.name
            }
        },
        methods: {
            startEditing(){
                this.editing = true;
                this.draft = this.neighborhood.name;
            },
            stopEditing(){
                this.editing = false;
                this.draft = this.neighborhood.name;
            },
            async submitEdit(){
                if (this.neighborhood.name === this.draft) {
                    const error = 'Error: Edited neighborhood name should be different than current neighborhood name.';
                    this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                    setTimeout(() => this.$delete(this.alerts, error), 3000);
                    return;
                }
                try {
                    const fields = {name: this.draft};
                    const r = await  fetch(`/api/neighborhood/${this.neighborhood._id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
                    if (!r.ok) {
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    this.$store.commit('refreshNeighborhoods');
                    this.editing = false;
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                }
            },
            async deleteNeighborhood(){
                try {
                    const r = await  fetch(`/api/neighborhood/${this.neighborhood._id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}});
                    if (!r.ok) {
                        const res = await r.json();
                        throw new Error(res.error);
                    }
                    this.$store.commit('refreshNeighborhoods');
                    this.editing = false;
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                }
            }
        }
    };
</script>
        
<style scoped>
    .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 200px;
    align-items: center;
    margin-top: 20%;
    }

    button {
    background-color: white;
    color: black;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 25px;
    border-radius: 10px;
    padding: 20px;
    width: 700px;
  }

  img {
    height: 20px;
    width: 20px;
    margin-left: 20px;
  }
</style>