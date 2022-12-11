<template>
  <article
    class="freet"
  >
    <section class="container">
      <div class="row">
        <div class="author-name">
          {{ forum.author.firstName + " " + forum.author.lastName }}
        </div>
        <font-awesome-icon
          v-if="$store.state.userObject._id === forum.author._id"
          icon="fa-solid fa-trash"
          @click="deletePost"
        />
      </div>

      <div class="date">
        Posted on {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()] }} {{ date.getDate() }}, {{ date.getFullYear() }}
      </div>
      <h3 v-if="forum.qna">
        Q&A
      </h3>
    </section>

    <router-link
      v-if="($route.name === 'Neighborhood' || $route.name === 'Home')"
      style="text-decoration: none; color: inherit; width: inherit;"
      :to="path"
    >
      <div class="content">
        {{ forum.content }}
      </div>
    </router-link>
    <div
      v-else
      class="content"
    >
      {{ forum.content }}
    </div>
    <section style="display: flex; flex-direction: row; justify-content: space-between;">
      <router-link
        v-if="($route.name === 'Neighborhood' || $route.name === 'Home')"
        style="text-decoration: none; color: inherit; width: inherit;"
        :to="path"
      >
        <font-awesome-icon
          icon="fa-regular fa-comment-dots"
        /> View replies
      </router-link>
      <section v-if="forum.petitionId">
        <div
          class="linkedPetitionButton"
          @click="showModal"
        >
          <font-awesome-icon icon="fa-solid fa-file" />
          Linked Petition
        </div>
        <modal
          :name="'forumModal' + _uid"
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
          <PetitionComponent :petition-id="forum.petitionId" />
        </modal>
      </section>
      <div v-if="showUpvote">
        <div
          v-if="!liked"
          class="upvote-button"
          @click="likeRequest"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-up" /> {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
        </div>
        <div
          v-if="liked"
          class="upvote-button"
          style="color: rgb(170, 85, 64)"
          @click="removeLikeRequest"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-up" />
          {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
        </div>
      </div>
      <div v-else>
        {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
      </div>
    </section>
    

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

  <script>
  import moment from 'moment';
  import PetitionComponent from "../Petition/PetitionDetails";
  export default {
    name: 'ForumPost',
    components: {PetitionComponent},
    props: {
      forum: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during freet modification,

        response: null
      };
    },
    computed: {
      showUpvote(){
        let neighborhood = null;
        if (this.forum.parentId){
          neighborhood = this.forum.parentId.neighborhoodId
        } else {
          neighborhood = this.forum.neighborhood;
        }
        return this.$store.state.userObject && (this.$store.state.userObject.neighborhood._id === this.forum.neighborhood || neighborhood === '638ce78e88e91521eb0338c0');
      },
      path(){
        return `/forum/${this.forum._id}`;
      },
      petitionPath(){
        return this.forum.petitionId ? `/petition/${this.forum.petitionId}`  : ""
      } ,
      date(){
        return moment(this.forum.dateCreated, 'MMMM Do YYYY, h:mm:ss a').toDate();
      },
      responseDate(){
        if(this.response){
          return moment(this.response.dateCreated, 'MMMM Do YYYY, h:mm:ss a').toDate()
        }
        return Date();
      },
      liked() {
        return this.forum.likes.includes(this.$store.state.userObject.email);
     },
     likes() {
      return this.forum.likes.length;
     }
    },
    mounted(){
      this.fetchResponse();
    },
    methods: {
      async deletePost(){
        if (this.forum.parentId){
          try {
          const r = await fetch(`/api/comments/${this.forum._id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}});
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
        } catch(e){
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.$store.commit('refreshForumPostComments', this.$route.params.postId);
        } 
        else {
          try {
            const r = await fetch(`/api/forum/${this.forum._id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}});
            if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
            }
          } catch(e){
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }

          if (this.$route.name === 'Forum Post'){
            this.$router.back()
          } else {
            this.$store.commit('refreshForumPosts', this.forum.neighborhood);
          }
        }
      },
      showModal(){
        this.$modal.show('forumModal' + this._uid);
      },
      hideModal(){
        this.$modal.hide('forumModal' + this._uid);
      },
      async fetchResponse(){
        if (this.forum.parentId){
          const url = `/api/comments/subcomments/${this.forum._id}`;
          const res = await fetch(url).then(async r => r.json());
          this.response = res[0]
        }
      },
      async likeRequest() {
        try {
          const r = await  fetch(`/api/likes/${this.forum._id}`, {method: 'POST', headers: {'Content-Type': 'application/json'}});
          this.$emit('refresh');
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async removeLikeRequest() {
        try {
          const r = await fetch(`/api/likes/${this.forum._id}`, {method: 'DELETE'})
          this.$emit('refresh');
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    },

  };
  </script>

  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .freet {
      box-shadow: 0px 2px 5px rgb(141, 156, 160);
      padding: 24px;
  }
  .actions button {
    margin-top: 10px;
    margin-right: 15px;
  }

  .author-name {
    font-size: 25px;
    color: rgb(0, 0, 0);
    margin-bottom: 16px;
  }

  img {
    height: 50px;
    margin-right: 20px;
  }
  .date {
    font-size: 15px;
    color: rgb(190, 186, 186);
    font-family: Arial, Helvetica, sans-serif;
  }
  button {
    color: black;
    border-radius: 5px;
    padding-left:5px;
    padding-right:5px;
    box-shadow: 0px 1px 2px rgb(141, 156, 160);
    font-size: 15px;
  }

  .response {
    background-color: #b0c4ca;
    border-radius: 5px;
  }
  .upvote-button:hover{
    cursor: pointer;
  }
  .content{
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .linkedPetitionButton{
    color: rgb(69, 150, 231);
  }
  
  .linkedPetitionButton:hover{
    cursor: pointer;
  }
  .x-icon{
    font-weight: bold; text-align: right; margin-top: 24px; margin-right: 24px; font-size: 24px;
  }
  .x-icon:hover{
    cursor: pointer;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  </style>
