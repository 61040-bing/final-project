<!-- Form for getting freets (all, from user) (inline style) -->

<template>
</template>

<script>

export default {
  name: 'GetPetitionsForm',
  methods: {
    async submit() {
      const url = this.$route.params.id ? `/api/petitions?neighborhood=${this.$route.params.id}` : `/api/petitions?neighborhood=${'638ce78e88e91521eb0338c0'}`;
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
