<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main class="page">
    <section>
      <header>
        <h2>Welcome to Participate!</h2>
      </header>
      <RegisterForm />
    </section>
    <section>
      <header>
        <h2>Already have an account?</h2>
      </header>
      
      <router-link class="router" to="/login">
        Sign In
      </router-link>
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'RegisterPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style>
</style>
