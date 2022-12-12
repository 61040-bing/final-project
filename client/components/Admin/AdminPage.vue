<template>
  <section
    v-if="$store.state.userObject !== null && $store.state.userObject.email === 'admin@admin.com'"
    class="dashboard"
  >
    <h2>Dashboard</h2>
    <div class="container">
      <router-link to="/admin/submittedpetitions">
        <button
          class="button"
          style="background-color: #4C0050;"
        >
          <span style="text-decoration: none">
            View Submitted Petitions
          </span>
         
          <font-awesome-icon
            icon="fa-solid fa-scroll "
            style="width: 150px; height: 150px;"
          />
        </button>
      </router-link>
      <router-link to="/admin/editneighborhood">
        <button
          style="background-color: #4CAF50;"
          class="button"
        >
          Edit Neighborhoods
          <font-awesome-icon 
            style="width: 150px; height: 150px;"
            icon="fa-solid fa-pen-to-square"
          />
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

.dashboard {
  width: 60%;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-decoration: none;
  font-family: Arial, Helvetica, sans-serif;
}
.container {
  display: flex;
  flex-direction: row;
  gap: 200px;
  align-items: center;
  margin-top: 5%;
  justify-content: space-evenly;
}

.button {
  border: none;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: center;
  font-size: 25px;
  border-radius: 5px;
  padding: 20px;
  gap: 20px;
  width: 100%;
  height: 200px;
}

a {
  text-decoration: none;
}

.button:hover {
  cursor: pointer;
}
  </style>