<!-- Form for getting freets (all, from user) (inline style) -->

<template>
</template>

<script>

export default {
  name: 'GetAllPetitionsForm',
  methods: {
    async submit() {
      const url = `/api/petitions`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updatePetitions', res);
      } catch (e) {
        this.$store.commit('refreshPetitions');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
