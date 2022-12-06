<template>
  <article
    class="freet"
  >
    <section class="container">
      <div class="user-bio">
        <div class="author">
          <div class="username">
            {{ forum.author.firstName + " " + forum.author.lastName }}
          </div>
        </div>
      </div>

      <div class="date">
        Posted on {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()] }} {{ date.getDate() }}, {{ date.getFullYear() }}
      </div>
      <h3 v-if="forum.qna">
        Q&A
      </h3>
    </section>


    <div class="content">
      {{ forum.content }}
    </div>

    <section style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 12px">
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
     
      <div>
        <div
          v-if="!liked"
          class="upvote-button"
          @click="likeRequest"
        >
          <img
            src="../../public/upvoteTriangle.svg"
            style="width: 20px; height: 20px"
          >  {{likes + (likes === 1 ? " Upvote" : " Upvotes")}} 
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
          {{likes + (likes === 1 ? " Upvote" : " Upvotes")}}
        </div>
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
    <section v-if="forum.petitionId">
      <router-link :to="petitionPath">
        Linked Petition
      </router-link> 
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
  export default {
    name: 'ForumPost',
    props: {
      forum: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during freet modification,
        path: `/forum/${this.forum._id}`,
        petitionPath: this.forum.petitionId ? `/petition/${this.forum.petitionId}`  : "",
        response: null
      };
    },
    computed: {
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
        return this.forum.likes.includes(this.$store.state.userEmail);
     },
     likes() {
      return this.forum.likes.length;
     }
    },
    mounted(){
      this.fetchResponse();
    },
    methods: {
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
  .containerT {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0px;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0px;
  }
  .toxicity {
    font-size:10pt;
    color: #898b8c;
    font-family: Arial, Helvetica, sans-serif
  }
  .refreet {
    font-size:10pt;
    color: #898b8c;
    font-family: Arial, Helvetica, sans-serif;
    margin-left: 70px;
  }
  .freet {
      box-shadow: 0px 2px 5px rgb(141, 156, 160);
      padding: 24px;
  }
  .actions button {
    margin-top: 10px;
    margin-right: 15px;
  }
  .author {
    color: #24b2e1;
    font-family: Arial, Helvetica, sans-serif;
  }
  .username {
    font-size: 25px;
    color: rgb(0, 0, 0);
  }
  .user-bio {
    margin-bottom: 8px;
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
    margin-top: 32px;
    margin-bottom: 32px;
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
  }
  </style>
