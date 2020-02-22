<template>
    <Ly flexbox=1 column=1 data-component="context-menu">
        <Ly>{{title}}<button @click="close()">Close</button></Ly>
        <Ly><Toolbar :buttons="buttons"/></Ly>
        <Ly><ItemEditor :item="item" :lists="lists" :branchs="branchs" v-on:change="formChange" :keysSettings="keysSettings"/></Ly>
     </Ly>
</template>
<script>
//import {cleanCopy} from '../helpers.js'
import Ly from './layout.vue';
import ItemEditor from './item-editor.vue'
import Toolbar from './tool-bar.vue'
export default {
    components: { ItemEditor, Ly, Toolbar },
    data () {
        return {
            buttons: [{label:"Save",onClick:this.commitForm}]
        }
    },
    computed: {
        item () {
            const item = this.$store.state.contextMenu.item
            //console.log(cleanCopy(item))
            return item ? item : {}
        },
        cursor () {
            return this.$store.state.contextMenu.cursor
        },
        title () {
            return this.$store.state.contextMenu.title
        },
        branchs () {
            return this.$store.state.contextMenu.branchs
        },
        lists () {
            //console.log(cleanCopy(this.$store.state.contextMenu.lists))
            return this.$store.state.contextMenu.lists
        },
        keysSettings () {
            return this.$store.state.contextMenu.keysSettings
        }
    },
    methods: {
        formChange(item) {
            //const newState = object.cleanCopy(this.campos)
            //console.log(item)
            //const cursor = this.cursor
            Object.keys(item).forEach ( key => item[key] = item[key].value )
            this.$store.dispatch('context-menu' , {action:"formChange",item} )
        },
        commitForm(campos) {
             this.$store.dispatch('context-menu' , {action:"save"} )
        },
        close(){
            this.$store.dispatch('context-menu' , {action:"clear"} )
        }
    },
    createdd () {
        const aa = JSON.parse(JSON.stringify(this.$store.state.contextMenu.campos))
        //console.log(aa)
        this.campos = this.$store.state.contextMenu.campos
    }
}
</script>
<style>
    [data-component="context-menu"] {border:1px solid green;position:absolute;z-index:1;top:200px;left:700px;background:white;}
</style>