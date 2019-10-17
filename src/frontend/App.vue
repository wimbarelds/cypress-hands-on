<template>
  <div id="app" class="app">
    <DirectoryBrowser @setPath="setPath($event)" />
    <FileBrowser :path="path" @setFile="setFile($event)" @goto="setPath($event)" />
    <FileDetail v-if="file && file.isFile" :file="file" />
  </div>
</template>

<script>
import DirectoryBrowser from './components/DirectoryBrowser.vue';
import FileBrowser from './components/FileBrowser.vue';
import FileDetail from './components/FileDetail.vue';

export default {
  name: 'app',
  components: {
    DirectoryBrowser,
    FileBrowser,
    FileDetail,
  },
  data: () => ({
    path: '/',
    file: null,
  }),
  methods: {
    setPath(path) {
      this.path = path;
      this.file = null;
    },
    setFile(file) {
      this.file = file;
    }
  }
}
</script>


<style lang="scss" scoped>
.app {
  display: flex;
  height: 100%;
}

.directorybrowser {
  width: 450px;
  background-color: #EEE;
  box-shadow: 6px 0 6px -2px rgba(60, 60, 60, .25);
  padding: 20px;
}

.filebrowser {
  flex: 1;
  padding: 20px;
}

.filedetail {
  background-color: #DDD;
  width: 300px;
  padding: 20px;
}
</style>

<style lang="scss">
html, body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

*, *::before, *::after {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5 {
  margin-top: 0;
  margin-bottom: 0;

  * + & {
    margin-top: 1rem;
  }
  & + * {
    margin-top: .5rem;
  }
}
</style>