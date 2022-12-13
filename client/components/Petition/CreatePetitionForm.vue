
<!-- Form for creating freets (block style) -->



<script>

import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreatePetitionForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/petitions',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Title', value: ''},
        {id: 'content', label: 'Description', value: ''},
        {id: 'targetSignatures', label: 'Number of Signatures Needed', value: ''},
      ],
      neighborhoodId: this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id,
      title: 'Create A Petition',
      callback: () => {
        this.$store.commit('refreshPetitions',this.$route.params.id);
        const message = 'Successfully created a petition!';
        this.$set(this.alerts, message, 'success');
        this.$emit('hide');
        this.$emit('success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
