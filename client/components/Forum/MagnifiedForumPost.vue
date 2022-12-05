<template>
  <div class="ha">
    <article
      v-if="forumPost"
      class="freet"
    >
      <section>
        <header>
          <h2>Forum Post</h2>
        </header>
        <article>
          <ForumPost
            :key="forumPost._id"
            :forum="forumPost"
            @refresh="fetchForumPost"
          />
        </article>
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
      <section class="comment">
        <CreateForumCommentForm 
          v-if="(($store.state.userNeighborhood === forumPost.neighborhood || (forumPost.neighborhood === '638ce78e88e91521eb0338c0' && $store.state.userEmail !== undefined)))"
          :key="forumPost.id"
        />
      </section>
      <section
        v-if="$store.state.forumPostComments.length"
      >
        <h1>Comments</h1>
        <ForumPost
          v-for="comment in comments"
          :key="comment.id"
          :forum="comment"
          @refresh="$store.commit('refreshForumPostComments', $route.params.postId);"
        />
      </section>
    </article>
  </div>
</template>
    
    <script>
    import CreateForumCommentForm from './CreateForumCommentForm.vue';
    import ForumPost from './ForumPost.vue';
    import moment from 'moment';

    export default {
      name: 'MagnifiedForumPost',
      components: {CreateForumCommentForm, ForumPost},
      data() {
        return {
          alerts: {}, // Displays success/error messages encountered during freet modification,
          forumPost: null
        };
      },
      computed: {
        comments(){
          if (!this.forumPost) return [];
          const comms = this.$store.state.forumPostComments;
          return comms;
        },
        expiryDate(){
          if (this.forumPost.expiryDate) {
            return moment(this.forumPost.expiryDate, 'MMMM Do YYYY, h:mm:ss a').toDate();
          }
          return null;   
      },
      valid(){
        if (this.forumPost.expiryDate) {
            return moment(this.forumPost.expiryDate, 'MMMM Do YYYY, h:mm:ss a').toDate() > new Date().getTime();
          }
          return true;
      }
       },
      mounted() {
          this.fetchForumPost();
      },
      methods: {
          async fetchForumPost() {
            const url =`/api/forum/${this.$route.params.postId}`;
            try {
              const r = await fetch(url);
              const res = await r.json();
              if (!r.ok) {
                throw new Error(res.error);
              }
              const response = await fetch(`/api/likes/${this.$route.params.postId}`).then(async r => r.json());
              res.forum.likes = response.map(liker => liker.author.email);
              this.forumPost = res.forum;
              this.$store.commit('refreshForumPostComments', this.$route.params.postId);
            } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        }
      }
    };
    </script>
    
    <style scoped>
    .freet {
        padding: 20px;
        position: relative;
        margin: auto;
    }
    .ha {
      width: 75%;
      margin: auto;
    }
    .comment {
      margin-top: 30px;
      margin-bottom: 0px;
    }
    h1,h2 {
      color: rgb(170, 85, 64);
    font-family: Arial, Helvetica, sans-serif;
    }
    </style>