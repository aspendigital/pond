<template>
  <div class="app-container">
    <sidebar></sidebar>

    <template v-if="loading">
      <div class="project-view-container main-view flex-item">
        <div class="loading-projects">
          <div><p>{{ $t('projects.loading') }}</p></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="project-view-container main-view flex-item" v-if="hasProjects">
        <projects-side-panel></projects-side-panel>
      </div>
      <div class="project-view-container main-view flex-item" v-else>
        <welcome></welcome>
      </div>
    </template>
  </div>
</template>

<script>
  import Sidebar from './sidebar.vue';
  import ProjectsSidePanel from './projects-side-panel.vue';
  import Welcome from './welcome.vue';

  export default {
    components: {
      ProjectsSidePanel,
      Sidebar,
      Welcome,
    },
    computed: {
      hasProjects() {
        return false;// this.$store.state.projects.list.length > 0;
      },
      loading() {
        return false;// this.$store.state.projects.loading;
      },
    },
  };
</script>