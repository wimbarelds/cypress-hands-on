<template>
  <div class="filebrowser">
      <h2>
        /<a v-for="pathLink in pathLinks" @click="browse(pathLink.link)" :key="`pathlink-${pathLink.link}`">{{ pathLink.text}}/</a>
        <span class="loading" v-if="loading">Loading...</span>
      </h2>
      <div class="error" v-if="error">{{ error }}</div>
      <div class="files">
        <div class="file" v-for="file in files" :key="`file ${file.path}`" @click.stop="select(file)" @dblclick.stop="browse(file.filepath)">
          <div class="file-icon" :class="{[file.ext]: true, folder: file.isDirectory }"></div>
          <div class="file-name">{{ file.name }}</div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    path: String,
  },
  data: () => ({
    loading: true,
    files: [],
    error: null,
  }),
  watch: {
    path: {
      immediate: true,
      async handler() {
        this.error = null;
        this.files = [];
        try {
          const response = await axios.post(this.path);
          this.files = response.data.map((obj) => ({
            ...obj,
          }))
          .sort((f1, f2) => f1.isFile === f2.isFile ? 0 : f1.isFile ? 1 : -1);
          this.loading = false;
        } catch (err) {
            this.loading = false;
            this.error = 'Something went wrong fetching data from the server';
        }
      }
    }
  },
  computed: {
    pathLinks() {
      const parts = this.path.split('/').map((s) => s.trim()).filter((s) => s);
      let link = '/';
      const links = [];
      for (const part of parts) {
        link += part + '/';
        links.push({ text: part, link });
      }
      return links;
    }
  },
  methods: {
    select(file) {
      this.$emit('setFile', file);
    },
    browse(path) {
      this.$emit('goto', path);
    },
  },
};
</script>

<style lang="scss">
h2 a {
  cursor: pointer;
  &:hover {
    color: #468;
  }
}
.loading {
  opacity: .5;
}

.file {
  display: inline-block;
  margin: 5px;
  width: 100px;
  height: 90px;
  padding: 5px;
  border: solid transparent 1px;

  &:hover {
    background-color: rgba(197, 205, 212, .75);
    border: solid rgb(152, 165, 177) 1px;
  }
}

.file-icon {
  margin: 2px auto 10px;
  width: 52px;
  height: 52px;
  background-position: center;
  background-image: url('/icons/other.png');
  background-repeat: no-repeat;
  
  @each $ext in (ai, aac, aiff, avi, bmp, c, cpp, css, csv, dat, dmg, doc, dotx, dwg, dfx, eps, exe, flv, folder, gif, h, hpp, html, ics, iso, java, jpg, js, key, less, mid, mp3, mp4, mpg, odf, ods, odt, otp, ots, ott, pdf, php, png, ppt, psd, py, qt, rar, rb, rtf, sass, scss, sql, tga, tgz, tiff, txt, wav, xls, xlsx, xml, yml, zip) {
    &.#{$ext} {
      background-image: url('/icons/' + $ext + '.png');
    }
  }
}

.file-name {
  max-width: 100px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
</style>