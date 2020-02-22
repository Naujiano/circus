<template>
    <div>  
        <input v-model="filter"/>{{filter}}
        <Tabs :tabs="tabNames">
            <ly v-for="tab in tabNames" flexbox=1 column=1 grow=1 data-component="item-list" :slot="tab">
                <ly v-for="item in itemsInTab(tab)" class="item-list item" v-show="inFilter(item.data[labelKeyName])">
                    <div @click="itemSelected(item.data,item.index)">{{item.data[labelKeyName]}}</div>
                </ly>
            </ly>
        </Tabs>
    </div>
</template>

<script>
import Ly from './layout.vue'
import Tabs from './tabs.vue'
//import {cleanCopy,log} from '../helpers'
//import LyItem from './ly-item.vue'

export default {
  props: ['items','labelKeyName','cursor','branchs','tabName','tabs','keysSettings'],
  components: { Ly, Tabs },
  data: () => ({
      filter: ""
  }),
  computed: {
    tabNames () {
        console.log('long:' + this.items.length)
        return this.tabs || ['main']
    },
    indexedItems() {
        return this.items.map ( (data, index) => ({data,index}))
    }
  },
  methods: {
      inFilter ( fieldName ) {
        const name = fieldName.toLowerCase()
        , filter = this.filter.toLowerCase()
        return name.indexOf(filter) != -1
      },
      itemSelected (item,i) {
          console.log(cleanCopy(item))
          const cursor = this.cursor.concat([i])
          , action = "open"
          , title = item[this.labelKeyName]
          , lists = this.lists
          , branchs = this.branchs
          , keysSettings = this.keysSettings
          //console.log(cleanCopy(data))
          //console.log(cleanCopy(lists))
        this.$store.dispatch ('context-menu',{action,item,cursor,title,branchs,keysSettings})
      },
    itemsInTab(tab) {
        //log(tab)
        if ( ! this.tabName ) return this.indexedItems
        
        return this.indexedItems.filter ( item => this.tabName(item.data).toLowerCase() == tab.toLowerCase() )
    }
  }
}
</script>

<style scoped>
    [data-component="item-list"] .item-list.item { cursor: pointer; overflow: hidden }
    [data-component="item-list"] .item-list.item:hover { background: #ddd }
</style>