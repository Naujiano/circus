<script>
    export default {
        props: {
            tabs: {
                type: Array,
                required: true
            }
        },
        data: () => ({
            selectedTab: false
            , beforeTabsArr: []
            
        }),
        computed: {
            tabsArr(){ 
                const tabs = this.tabs.map ( ( name, index ) => ({ name, index }) ) 
            //console.log('selectedTab')
                if ( this.beforeTabsArr != tabs ) this.selectedTab = this.tabs[0]
                this.beforeTabsArr = tabs
                return tabs
            }
        },
        methods: {
            buttonClick(tab) {
                console.log(tab.index)
                this.selectedTab = tab.name
            }
        },
        beforeMount() {
            this.selectedTab = this.tabs[0]
        }
    }
</script>

<template>
    <div data-component="tabs">
        <button v-for="tab in tabsArr" @click="buttonClick(tab)" v-if="tabsArr.length>1">{{tab.name}}</button>
        <div v-for="tab in tabsArr" v-show="tab.name == selectedTab" class="slot">
            <slot :name="tab.name"/>
        </div>
    </div>
</template>
<style>
    .slot {
        display:block;
        clear:both;
    }
</style>