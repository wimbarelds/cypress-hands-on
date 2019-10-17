<template>
  <div class="filedetail">
      <h2>{{ file.name }}</h2>
      <img v-if="canPreview" :src="file.filepath" class="preview" :alt="file.name">
      <div class="actions">
          <a :href="file.filepath" class="btn" download>Download</a>
      </div>
      <ul class="details">
          <li><label>Filesize</label> {{ fileSize }}</li>
          <li><label>Created</label> {{ created }}</li>
          <li><label>Modified</label> {{ modified }}</li>
          <li v-if="file.mime"><label>Mime</label> {{ file.mime }}</li>
      </ul>
  </div>
</template>

<script>
const formatDate = (d) => {
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear().toString().padStart(4, '0');
    return `${dd}-${mm}-${yyyy}`;
};

export default {
    props: {
        file: Object
    },
    computed: {
        canPreview() {
            return this.file.mime && this.file.mime.indexOf('image/') === 0;
        },
        fileSize() {
            const units = [ 'bytes', 'KB', 'MB', 'GB', 'TB', 'WTFs' ];
            const unitIndex = Math.floor(Math.log2(this.file.size) / 10);
            const unit = units[unitIndex];
            const sizeInUnit = Math.round(this.file.size / (1 << (unitIndex * 10)) * 10) / 10;
            return `${sizeInUnit} ${unit}`;
        },
        created() {
            const date = new Date(this.file.ctime);
            return formatDate(date);
        },
        modified() {
            const date = new Date(this.file.mtime);
            return formatDate(date);
        },
    },
};
</script>

<style lang="scss">
.filedetail {
    display: flex;
    flex-direction: column;
}

.preview {
    max-width: 100%;
    object-fit: contain;
}
.btn {
    display: block;
    padding: 5px 10px;
    background-color: #369;
    color: #FFF;
    margin: 1em 0;
    text-decoration: none;
    text-align: center;
    font-size: 80%;
    transition: background-color .3s ease-in-out;

    &:hover {
        background-color: #246;
    }
}

.details {
    list-style: none;
    display: block;
    padding: 0;
    margin: 0;
    font-size: 90%;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 5px;
    }
    
    &::-webkit-scrollbar-track {
        background: #ddd;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #666; 
    }

    li {
        display: block;
        padding: 0;
        margin: 0;

        label {
            font-weight: bold;
            display: inline-block;
            width: 35%;
        }
    }
}
</style>