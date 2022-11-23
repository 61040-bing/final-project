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
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm,
    LogoutForm
  }
};
</script>

<style>
</style>
