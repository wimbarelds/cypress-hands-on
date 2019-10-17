<template>
  <div class="directorybrowser">
      <h1>vue-file-browser</h1>
      <DirTree path="/" @select="$emit('setPath', $event)" />
  </div>
</template>

<script>
import DirTree from './DirTree.vue';

export default {
    components: {
        DirTree,
    },
};
</script>

<style>

</style>