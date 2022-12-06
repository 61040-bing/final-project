
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

        <input
          v-else
          :type="field.id === 'targetSignatures' ? 'number' : 'text'"
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
      title: 'Create a petition',
      callback: () => {
        this.$store.commit('refreshPetitions',this.$route.params.id);
        const message = 'Successfully created a petition!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
