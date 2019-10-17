<template>
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-else-if="error">{{ error }}</div>
    <div class="dirtree" v-else>
        <template v-for="child in children">
            <div class="directory" :key="`dir ${child.path}`" @click.stop="onChildClick(child, $event)">
                <span class="state" :class="{ expanded: child.expanded, collapsed: !child.expanded, empty: child.empty }" @click.stop="expandToggle(child)"></span>
                <span class="filename">{{ child.name }}</span>
                <DirTree v-if="child.expanded" :path="child.filepath" @empty="markEmpty(child)" @select="$emit('select', $event)" />
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'DirTree',
    props: {
        'path': String,
    },
    data: () => ({
        loading: true,
        error: null,
        children: [],
    }),
    async created() {
        this.error = null;
        try {
            const response = await axios.post(this.path);
            this.children = response.data.filter((obj) => obj.isDirectory).map((obj) => ({
                ...obj,
                expanded: false,
                empty: false,
            }));
            if (this.children.length === 0) this.$emit('empty');
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.error = 'Something went wrong fetching data from the server';
        }
    },
    methods: {
        onChildClick(child, event) {
            [ ... document.querySelectorAll('.dirtree .directory.active') ].forEach((el) => el.classList.remove('active'));
            event.target.closest('.directory').classList.add('active');
            this.$emit('select', child.filepath);
            child.expanded = !child.expanded;
        },
        expandToggle(child) {
            child.expanded = !child.expanded;
        },
        markEmpty(child) {
            child.empty = true;
        },
    }
}
</script>

<style lang="scss">
.loading {
    display: inline;
    opacity: .5;
    margin-left: 1em;
}
.error {
    display: block;
    font-size: 80%;
    color: #F00;
    opacity: .5;
    margin-left: 20px;
}

.dirtree {
    user-select: none;
}

.directory {
    position: relative;
    cursor: default;
    line-height: 20px;

    > .dirtree {
        margin-left: 20px;
    }

    &.active {
        & > * {
            position: relative;
            z-index: 1;
        }

        &::before {
            content: '';
            outline: dotted #000 1px;
            background-color: #666;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            z-index: 0;
            opacity: .1;
            pointer-events: none;
        }
    }
}

.state {
    position: relative;
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    cursor: pointer;
    vertical-align: text-bottom;
    transition: opacity .4s ease-in-out;

    &::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -1px;
        border: solid #666;
        border-width: 2px 2px 0 0;
        transform-origin: center;
        transition: transform .3s ease-out;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &.expanded::before {
        transform: translate(-50%, -50%) rotate(135deg);
    }

    &.empty {
        opacity: 0;
        pointer-events: none;
    }
}

.children {
    padding-left: 10px;
}
</style>