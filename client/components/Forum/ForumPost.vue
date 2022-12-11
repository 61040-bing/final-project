<template>
  <article
    class="freet"
  >
    <section class="container">
      <div class="author-name">
        {{ forum.author.firstName + " " + forum.author.lastName }}
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

    <section style="display: flex; flex-direction: row; justify-content: space-between;">
      <router-link
        v-if="($route.name === 'Neighborhood' || $route.name === 'Home')"
        style="text-decoration: none; color: inherit; width: inherit;"
        :to="path"
      >
        <font-awesome-icon
          icon="fa-regular fa-comment-dots"
          size="lg"
        /> View replies
      </router-link>

      <section v-if="forum.petitionId">
        <div
          class="linkedPetitionButton"
          @click="showModal"
        >
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
            X
          </p>
          <PetitionComponent :petition-id="forum.petitionId" />
        </modal>
      </section>


      <div v-if="$route.name === 'Home' || ($store.state.userObject && $store.state.userObject.neighborhood._id === forum.neighborhood)">
        <div
          v-if="!liked"
          class="upvote-button"
          @click="likeRequest"
        >
          <img
            src="../../public/upvoteTriangle.svg"
            style="width: 20px; height: 20px"
          >  {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
        </div>
        <div
          v-if="liked"
          @click="removeLikeRequest"
        >
          <img
            src="../../public/triangleFilled.png"
            style="width: 20px; height: 20px"
            class="upvote-button"
          >
          {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
        </div>
      </div>
      <div v-else>
        {{ likes + (likes === 1 ? " Upvote" : " Upvotes") }}
      </div>
    </section>

    <section
      v-if="response"
      class="response"
    >
      <section class="container">
        <header class="user-bio">
          <h3 class="author">
            <span class="username">{{ "City Council" }}</span>
          </h3>
        </header>
        <span>
          {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][responseDate.getMonth()] }} {{ responseDate.getDate() }}, {{ responseDate.getFullYear() }}
        </span>
      </section>

      {{ response.content }}
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
    text-decoration: underline;
    color: blue;

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
  </style>
