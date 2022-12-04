<template>
  <article
    class="freet"
  >
    <section class="container">
      <header class="user-bio">
        <h3 class="author">
          <span class="username">{{ forum.author.firstName + " " + forum.author.lastName }}</span>
        </h3>
      </header>

      <span class="date">
        {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()] }} {{ date.getDate() }}, {{ date.getFullYear() }}
      </span>
      <h3 v-if="forum.qna">
        Q&A
      </h3>
    </section>

    <router-link
      v-if="($route.name === 'Neighborhood')"
      :to="path"
      style="text-decoration: none; color: inherit;"
    >
      {{ forum.content }}
    </router-link>
    <div v-else>
      {{ forum.content }}
    </div>
    <button
      v-if="!liked"
      @click="likeRequest"
    >
      Upvote
    </button>
    <button
      v-if="liked"
      @click="removeLikeRequest"
    >
      Remove Upvote
    </button>
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

      {{response.content}}
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
        likers: [],
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
        if (this.forum.likes !== undefined){
          return this.forum.likes.includes(this.$store.state.userEmail);
        }
      return this.likers.includes(this.$store.state.userEmail);
     },
    },
    mounted(){
      this.fetchLikers();
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
      async fetchLikers(){
        const url = `/api/likes/${this.forum._id}`;
        const res = await fetch(url).then(async r => r.json());
        this.likers = res.map(liker => liker.author.email);
        console.log(res);
      },
      async likeRequest() {
        try {
          const r = await  fetch(`/api/likes/${this.forum._id}`, {method: 'POST', headers: {'Content-Type': 'application/json'}});
          if (this.forum.likes !== undefined){
            this.$store.commit('refreshForumPostComments', this.forum.parentId._id);
          } else{
            this.fetchLikers()
          }
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
          if (this.forum.likes !== undefined){
            this.$store.commit('refreshForumPostComments', this.forum.parentId._id);
          } else{
            this.fetchLikers()
          }
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
    flex-direction: row;
    align-items: center;
    margin-bottom: 0px;
  }

  .containerT {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  }
  .actions button {
    margin-top: 10px;
    margin-right: 15px;
  }
  .author {
    color: #24b2e1;
    font-family: Arial, Helvetica, sans-serif;
  }
  .content {
    color: #898b8c;
    font-family: Arial, Helvetica, sans-serif;
  }
  .username {
    font-size: 25px;
    color: rgb(0, 0, 0);
    padding-left: 5px;
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
    margin-left: 20px;
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
    margin: 50px;
  }
  </style>
