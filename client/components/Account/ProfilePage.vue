<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
    <main class="page">
      <section>
        <LogoutForm />
      </section>
      <section>
        <DeleteAccountForm />
      </section>
    </main>
  </template>
  
  <script>
  import LogoutForm from '@/components/Account/LogoutForm.vue';
  import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
  
  export default {
    name: 'ProfilePage',
    components: {
      LogoutForm,
      DeleteAccountForm
    }
  };
  </script>
  
  <style>
  </style>