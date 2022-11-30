<template>
  <NeighborhoodPage :key="$route.params.id" />
</template>

<script>
import NeighborhoodPage from './NeighborhoodPage.vue'
export default {

  name: 'NeighborhoodWrapper',
  components: {NeighborhoodPage},
};
</script>