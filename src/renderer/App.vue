<template>
  <div class="layout-full-size">
    <router-view></router-view>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';

  export default {
    name: 'pond',
    mounted() {
      this.$store.dispatch('loadProjects')
        .catch((error) => {
          throw error;
        });

      // Setup IPC listeners
      ipcRenderer.on('project-created', (event, arg) => {
        this.$store.dispatch('addProject', arg);
      });

      //
      // Clean up on exit
      //

      // require('electron').remote.app.on('before-quit', () => {
      //   environments.cleanup();
      // });
    },
  };
</script>

<style lang="less">
 @import './less/theme';
</style>
