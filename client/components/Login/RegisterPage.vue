<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main class="page">
    <section>
      <RegisterForm />
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

<style scoped>

.page {
  font-family: Arial, Helvetica, sans-serif;
  width:60%;
  margin: auto;
}
</style>
