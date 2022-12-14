<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main class="page">
    <section>
      <header>
        <h2>Welcome Back!</h2>
      </header>
      <LoginForm />
    </section>
    <section>
      <header>
        <h2>Don't have an account?</h2>
      </header>
      <router-link class="router" to="/register">
        Sign Up
      </router-link>
    </section>
  </main>
</template>

<script>
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    LoginForm
  }
};
</script>

<style scoped>

.page {
  font-family: Arial, Helvetica, sans-serif;
  width:60%;
  margin: auto;
}
</style>
