<template>
  <NeighborhoodPage :key="$route.params.name" />
</template>

<script>
import NeighborhoodPage from './NeighborhoodPage.vue'
export default {

  name: 'NeighborhoodWrapper',
  components: {NeighborhoodPage},
};
</script>