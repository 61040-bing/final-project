<template>
  <section class="dumm">
    <button class="flex">
      <span v-if="!editing">{{ neighborhood.name }} </span>
      <input
        v-if="editing"
        :value="draft"
        @input="draft = $event.target.value"
      >
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
          @click="showEditModal"
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
          @click="showDeletionModal"
        />



        <modal
            :name="'deletionModal' + this._uid"
            :width="400"
            :height="250"
            :adaptive="true"
        >
          <div style="margin: 8px">
            <p
              class="x-icon"
              @click="hideDeletionModal"
          >
            <font-awesome-icon icon="fa-solid fa-x" />
          </p>
          <div class="modalText">
            Deleting a neighborhood is a permanent action, erasing all forum, petition and roundtable history. Are you sure you want to proceed?
          </div>
          <div style="display: flex; flex-direction: row; justify-content: space-evenly; margin-top: 32px; margin-left: 8px; margin-right: 8px">
            <div @click="deleteNeighborhood" class = "modal-accept"> Yes</div> <div @click="hideDeletionModal" class = "modal-deny">No</div>

            </div>
          </div>
        </modal>

        <modal
            :name="'editModal' + this._uid"
            :width="400"
            :height="250"
            :adaptive="true"
        >
          <div style="margin: 8px">
            <p
                class="x-icon"
                @click="hideEditModal"
            >
              <font-awesome-icon icon="fa-solid fa-x" />
            </p>
            <div class="modalText">
              Editing this name will change the neighborhood's name for all users of Participate. Are you sure you want to proceed?
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-evenly; margin-top: 32px; margin-left: 8px; margin-right: 8px">
              <div @click="submitEdit" class = "modal-accept"> Accept</div> <div @click="hideEditModal" class = "modal-deny">deny</div>

            </div>
          </div>
        </modal>



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

          showEditModal(){
            this.$modal.show('editModal' + this._uid);
          },
          hideEditModal(){
            this.$modal.hide('editModal' + this._uid);
          },
          showDeletionModal(){
            this.$modal.show('deletionModal' + this._uid);
          },
          hideDeletionModal(){
            this.$modal.hide('deletionModal' + this._uid);
          },
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
                    this.hideEditModal();
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
                    this.hideDeletionModal();
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

  .flex{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
 .icons {
  margin-right: 12px;
 }

 .icons:hover {
  cursor: pointer;
 }


.modal-accept{
   font-family: Arial, Helvetica, sans-serif;
   display: flex;
   flex-direction: row;
   /*width: 400px;*/
   justify-content: center;
   padding: 10px;
   border-radius: 5px;
   /*gap: 20px;*/
   /*background-color: rgb(170, 85, 64);*/
  font-size: 18px;

  border: 1px solid  rgb(170, 85, 64);
  /*background-color: rgb(170, 85, 64);*/
  /*color: #fff;*/
  color: rgb(170, 85, 64);
 }

 .modal-accept:hover{
   cursor: pointer;
 }

.modal-deny{
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  flex-direction: row;
  /*width: 400px;*/
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  /*gap: 20px;*/
  background-color: rgb(170, 85, 64);
  color: #fff;
  font-size: 18px;

}
.modal-deny:hover{
  cursor: pointer;
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
.modalText{
  font-size: 18px;
}
</style>
