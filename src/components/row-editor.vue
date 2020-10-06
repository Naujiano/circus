<template>
    <div style="position:relative; width:100%;height:auto; border:1px solid blue;margin-bottom:10px;">
        <div class="fieldBox" v-for="(val, key) in internalRow"  style="border:1px solid red; float:left;padding:4px;">
            <label style="display:block;float:left" v-html="key"></label>
            <div contenteditable="true" @blur="editKeyName(i,$event)" v-html="val" style="border:1px solid gray;display:inline;padding:4px;float:left;clear:both"></div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        row: Object,
    },
    data() {
        return {
            internalRow: ""
        }
    },
    computed: {
    },
    watch: {
        row(){
            this.internalRow = this.row
            delete this.internalRow._checked
            delete this.internalRow._filterPassed
            delete this.internalRow._rowIndex
            delete this.internalRow.PK_ID
        }
    },
    methods: {
    }
}
</script>
<style scoped>
    .clearfix::after {
      content: "";
      clear: both;
      display: table;
    }
</style>