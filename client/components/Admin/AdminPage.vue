<template>
  <section v-if="$store.state.userObject !== null && $store.state.userObject.email === 'admin@admin.com'">
    <div class="container">
      <router-link to="/admin/submittedpetitions">
      <button class="button">
        View Submitted Petitions
      </button>
    </router-link>
      <router-link to="/admin/editneighborhood">
        <button class="button">
          Edit Neighborhoods
        </button>
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </section>
  <section v-else>
    Forbidden Access
  </section>
</template>
    
  <script>
  
    export default {
      name: 'AdminPage',
      components: {},
      props: {
  
      },
      data(){
        return {
          alerts: {}, // Displays success/error messages encountered during freet modification,
        }
      }
    };
    </script>
    
  <style scoped>
  .container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
  align-items: center;
  margin-top: 20%;
}

.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 25px;
  border-radius: 10px;
  padding: 20px;
}
  </style>