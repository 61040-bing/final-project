<template>
  <section
    v-if="$store.state.userObject"
    class="buffer"
  >
    <CreateForumForm 
      v-if="$store.state.userObject.neighborhood._id === $route.params.id || ($route.params.id === undefined && $store.state.userObject.email !== undefined)"
    />
    <section v-if="$store.state.forumPosts.length">
      <header class="left">
        <h2>
          Posts
        </h2>
      </header>
      <ForumPost
        v-for="post in $store.state.forumPosts"
        :key="post.id"
        :forum="post"
        @refresh="$store.commit('refreshForumPosts', $route.params.id === undefined ? cityId : $route.params.id);"
      />
    </section>
    <section v-else>
      <h3>No posts found!</h3>
    </section>
  </section>
  <section v-else>
    Login to View!
  </section>
</template>
  
  <script>
  import ForumPost from '@/components/Forum/ForumPost.vue';
  import CreateForumForm from '@/components/Forum/CreateForumForm.vue';
  export default {
    name: 'ForumPage',
    components: {ForumPost, CreateForumForm},
    data(){
      return {
        cityId: '638ce78e88e91521eb0338c0'
      }
    },
    mounted(){
      this.$store.commit('refreshForumPosts', this.$route.params.id === undefined ? this.cityId : this.$route.params.id);
    }
  };
  </script>
  
  <style scoped>
  .mainPage {
    margin: auto;
    width: 50%;
  }
  .buffer {
    margin-top: 30px;
  }
  .left h2 {
    color: rgb(170, 85, 64);
    font-family: Arial, Helvetica, sans-serif;
  }
  section {
    display: flex;
    flex-direction: column;
  }
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  button {
      margin-right: 10px;
  }
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  .welcome h2 {
    color: #24b2e1;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25pt;
  }
  .welcome h3 {
    font-family: Arial, Helvetica, sans-serif;
  }
  </style>