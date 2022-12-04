<template>
  <section>
    <div class="container">
      <button class="button">View Submitted Petitions</button>
      <router-link to="/admin/editneighborhood">
        <button class="button">Edit Neighborhoods</button>
      </router-link>
    </div>
  </section>
</template>
    
  <script>
  
    export default {
      name: 'AdminPage',
      components: {},
      props: {
  
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