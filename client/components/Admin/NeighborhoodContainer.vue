<template>
  <section class="dumm">
    <button class="flex">
      <span v-if="!editing">{{ neighborhood.name }} </span> 
      <textarea
        v-if="editing"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <div>
        <font-awesome-icon 
          v-if="!editing"
          class="icons"
          icon="fa-solid fa-pencil"
          @click="startEditing" 
        />

        <font-awesome-icon 
          v-if="editing"
          class="icons"
          icon="fa-solid fa-check"
          @click="submitEdit" 
        />

        <font-awesome-icon 
          v-if="editing"
          class="icons"
          icon="fa-solid fa-xmark"
          @click="stopEditing"
        />

        <font-awesome-icon 
          class="icons"
          icon="fa-solid fa-trash"
          @click="deleteNeighborhood"
        />
      </div>
    </button>
    <section
      style="position:relative;"
      class="alerts"
    >
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
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
                draft: this.neighborhood.name,
                alerts: {}
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
                if (this.draft === '') {
                    const error = 'Error: Edited neighborhood name should not be empty.';
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
                    const successMessage = `successfully edited neighborhood from ${this.neighborhood.name} to ${this.draft}`
                    this.$set(this.alerts, successMessage, 'success');
                    setTimeout(() => this.$delete(this.alerts, successMessage), 3000);
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
                    const successMessage = `successfully deleted ${this.neighborhood.name} neighborhood`
                    this.$set(this.alerts, successMessage, 'success');
                    setTimeout(() => this.$delete(this.alerts, successMessage), 10000);
                } catch (e) {
                    this.$set(this.alerts, e, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                }
            }
        }
    };
</script>
        
<style scoped>
.dumm {
  display: flex;
    flex-direction: column;
    justify-content: center; 
}
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
    font-size: 25px;
    border-radius: 10px;
    padding: 20px;
    min-width: 500px;
  }

  img {
    height: 20px;
    width: 20px;
    margin-left: 20px;
  }

  .flex{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
 .icons {
  margin-right: 12px;
 }

</style>