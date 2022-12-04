<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
    <main class="page">

      <section style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 40px; margin-bottom: 40px">
        <div> {{$store.state.userObject.firstName}} {{$store.state.userObject.lastName}}</div>
        <article>
          <div>Your Neighborhood:</div>
          <div>{{$store.state.userObject.neighborhood}}</div>
        </article>
      </section>


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
