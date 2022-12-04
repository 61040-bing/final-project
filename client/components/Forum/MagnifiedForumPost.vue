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
        />
      </section>
    </article>
</div>
</template>
    
    <script>
    import CreateForumCommentForm from './CreateForumCommentForm.vue';
    import ForumPost from './ForumPost.vue';
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
          // comms.sort((commentOne, commentTwo)=>{
          //   return c
          // })
          return comms;
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