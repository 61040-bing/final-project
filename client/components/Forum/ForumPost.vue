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
    </section>

    <router-link
      :to="path"
      style="text-decoration: none; color: inherit;"
    >
      {{ forum.content }}
    </router-link>
    
  
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
        path: `/forum/${this.forum._id}`
      };
    },
    computed: {
      date(){
        return moment(this.forum.dateCreated, 'MMMM Do YYYY, h:mm:ss a').toDate();
      }
    },
    methods: {
    
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: row;
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
    background-color: #24b2e1;
    color: white;
    border: 2px solid #24b2e1; 
    border-radius: 5px;
    padding-left:5px;
    padding-right:5px;
    box-shadow: 0px 1px 2px rgb(141, 156, 160);
    font-size: 15px;
  }
  </style>
