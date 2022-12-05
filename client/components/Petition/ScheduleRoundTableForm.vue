
<!-- Form for creating freets (block style) -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>

        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />

        <input v-else-if="field.id === 'startDate' || field.id === 'endDate'"
          type="date" 
          :name="field.id"
          :value="field.value"
          min="2022-12-04" max="2025-12-31"
          @input="field.value = $event.target.value">
  

        <input v-else-if="field.id === 'startTime' || field.id === 'endTime'"
          type="time"
          :name="field.id"
          :value="field.value"
          min="2022-12-04" max="2025-12-31"
          @input="field.value = $event.target.value">

        <input
          v-else
          :type="'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ScheduleRoundTableForm',
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
      petitionId: this.petition._id,
      setDate: true,
      title: 'Schedule RoundTable',
      callback: () => {
        this.$store.commit('refreshNeighborhoodRoundTables',this.$route.params.id);
        const message = 'Successfully created a petition!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
