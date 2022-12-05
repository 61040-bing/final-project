<script>
import BlockForm from '@/components/common/BlockForm.vue';
export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/forum',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a forum post',
      neighborhoodId: this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id,
      refreshPosts: true,
      fetchPetition: true,
      callback: () => {
        const message = 'Successfully created a forum post!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
Footer
