<template>
  <section
    v-if="$store.state.userObject !== null && $store.state.userObject.email === 'admin@admin.com'"
    class="dashboard"
  >
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
            style="width: 100px; height: 100px;"
          />
        </button>
      </router-link>
      <router-link to="/admin/editneighborhood">
        <button
          style="background-color: #4CAF50;"
          class="button"
        >
          <span style="padding-left: 15px; padding-right: 15px; text-decoration: none">
            Edit Neighborhoods
          </span>
          <font-awesome-icon 
            style="width: 100px; height: 100px;"
            icon="fa-solid fa-file-pen"
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
  margin-top: 2%;
  text-decoration: none;
  font-family: Arial, Helvetica, sans-serif;
  color: #000000;
}
.container {
  display: flex;
  flex-direction: row;
  gap: 200px;
  justify-content: space-evenly;
  position: absolute;
  top: 40%;
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
  width: 450px;
  height: 150px;
}

a {
  text-decoration: none;
}

.button:hover {
  cursor: pointer;
}
  </style>