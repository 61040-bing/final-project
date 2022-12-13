
<!-- Form for creating freets (block style) -->

<script>

import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateRoundTableLinkedPetition',
  mixins: [BlockForm],
  props: {
    // Data from the stored freet
    petition: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: '/api/roundtables',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'roundTableName', label: 'Title', value: ''},
        {id: 'zoomLink', label: 'Zoom Link', value: ''},
        {id: 'startDate', label: 'Start Date', value: ''},
        {id: 'startTime', label: 'Start Time', value: ''},
        {id: 'endDate', label: 'End Date', value: ''},
        {id: 'endTime', label: 'End Time', value: ''},
      ],
      neighborhoodId: this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id,
      setDate: true,
      fetchAuthorPetition: true,
      title: 'Schedule RoundTable',
      callback: () => {
        const neighborhood = this.$route.params.id === undefined ? '638ce78e88e91521eb0338c0': this.$route.params.id;
        this.$store.commit('refreshNeighborhoodRoundTables', neighborhood);
        const message = 'Successfully created a round table!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
