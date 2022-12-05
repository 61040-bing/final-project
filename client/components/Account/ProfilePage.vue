<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
    <main class="page">

      <section style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 40px; margin-bottom: 40px">
        <h2> {{$store.state.userObject.firstName}} {{$store.state.userObject.lastName}}</h2>
        <article>
          <h2>Your Neighborhood:</h2>
          <h4>{{$store.state.userObject.neighborhood.name}}</h4>
        </article>

      </section>
      <h4 style="display: flex; width: 100%; align-items: center; justify-content: center"> Edit Information </h4>
        <AccountSettings/>
      <section>
      </section>
    </main>
  </template>

  <script>
  import LogoutForm from '@/components/Account/LogoutForm.vue';
  import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
  import AccountSettings from "./accountSettings";

  export default {
    name: 'ProfilePage',
    components: {
      AccountSettings,
      LogoutForm,
      DeleteAccountForm
    },

    methods : {
    },
  };
  </script>

  <style>
  </style>

<style scoped>

.example {
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
}
.example img {
  max-width:100%;
  max-height:100%;

}

.example .overlay {
  position: absolute;
  top: 50px;
  right: 50px;
  font-weight: bold;
  text-align: right;
  font-size: 25px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
  background: white;
  border-radius: 25px;
  padding:15px;
}

.example .name-overlay {
  position: absolute;
  top: 450px;
  left: 50px;
  font-weight: bold;
  text-align: right;
  font-size: 50px;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 25px;
  padding:15px;
}

.winner {
  font-size: 20px;
  font-weight: lighter;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}

.example .img_overlay{
  position:absolute;
  top:0;
  left:0;
  height:0;
  bottom:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
}
.navbar {
  font-size: 30px;
  padding: 0px;
  font-family: Arial;
  display: flex;
  flex-direction: row;
  gap: 300px;
  justify-content: center;
  background: rgb(198, 193, 193);
  padding: 20px;
}
.navbar p{
  cursor: pointer;
}
.content {
  margin-top: 50px;
  padding: 0px;
  font-family: Arial;
  width: 45%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.selected {
  color: rgb(170, 85, 64);
  font-weight: bolder;
}

.hoverPointer{

}
.hoverPointer:hover{
  cursor: pointer;
  color: rgb(170, 85, 64);
}

.page{
  width: 80%;
}
</style>
