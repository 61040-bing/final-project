<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setEmail: true,
      setNeighborhood: true,
      setUser: true,
      fields: [
        {id: 'email', label: 'Email', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Sign in',
      callback: () => {
        if( this.$store.state.userObject.email === 'admin@admin.com'){
          this.$router.push('/admin');
        } else {
          this.$router.push({name: 'Home'});
        }
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  }
};
</script>
