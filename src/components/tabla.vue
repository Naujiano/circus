<template>
<div id="component-container" :style="{border:'0px solid red',width:width,height:height,overflow:'hidden','box-sizing':'border-box',position:'relative','padding-top':(searchable?'59px':'20px')}">
    <div :style="{height:'100%','overflow-x':'auto','overflow-y':'scroll'}" v-on:scroll="scrollHeaders" id="scrollableDiv" ref="scrollableDiv">
        <table v-if="!multiline" style="margin:0" class="table table-condensed header">
            <tbody :style="{position:'absolute','margin-top':(searchable?'-59px':'-25px')} " ref="header">
                <tr><td v-for="key in keys" v-if="hiddenKeys.indexOf(key)==-1" style="cursor:pointer" @click="orderBy(key,$event.target)" :data-order="getOrder(key)">{{key}}</td></tr>
                <tr v-if="searchable"><td v-for="(key,i) in keys" v-if="hiddenKeys.indexOf(key)==-1" ><div contenteditable="true" style="width:100%" @keyup="filterTable()"></td></tr>
            </tbody>
        </table>
        <table data-component="Tabla" ref="tabla" class="table table-condensed">
            <tbody ref="tbody">
                <tr v-for="(row,rowIndex) in editedRows" @click="onRowClick(row,rowIndex)" v-show="row._filterPassed">
                    <template v-if="!multiline">
                        <td v-for="key in keys" :class="tdClass" v-if="key!='_util'&&hiddenKeys.indexOf(key)==-1"><div :contenteditable="editablekeys.indexOf(key)!=-1" @blur="editTable($event,key,row._rowIndex)" @keyup="resizeHeaders()" :style="{'max-height':cellMaxHeight,'overflow-x':'hidden','overflow-y':'auto'}">{{row[key]}}</div></td>
                        <td :class="tdClass" v-if="deleteable"><button @click="onRowDelete(row._rowIndex)">Delete</button></td>
                    </template>
                    <template v-else>
                    <!--
                        <td>
                            <Ly flexbox=1 wrap=1>
                                <Ly grow=1 shrink=1 v-for="key in keys">{{row[key]}}</Ly>
                            </Ly>
                        </td>
                    -->
                    </template>
                </tr>
            </tbody>
            <tfoot v-if="!multiline" style="visibility:hidden">
                <tr><td v-for="key in keys" v-if="hiddenKeys.indexOf(key)==-1" style="padding-top:0;padding-bottom:0"><div style="height:0;overflow:hidden">{{key}}</div></td></tr>
            </tfoot>
        </table>
    </div>
</div>
</template>

<script>
import $ from 'jquery'
export default {
  //props: [ 'rows', 'multiline', 'nowrap', 'searchable' ],
  props: {
    rows: {
        type: Array
        , required: true
    }
    , multiline: Boolean
    , nowrap: Boolean
    , searchable: Boolean
    , deleteable: Boolean
    , orderable: Boolean
    , width: String
    , height: String
    , cellMaxHeight: String
    , hiddenKeys: {
        type: Array
        , default: function (){return []}
    }
    , editablekeys: {
        type: Array
        , default: function (){return []}
    }
  },
  data: function () {
    return {
        orderby: {}
        , editedRows: this.generateEditedRows()
    }
  },
  watch: {
    rows(){
        this.editedRows = this.generateEditedRows()
    }
  },
  computed: {
      keys: function  () {
          //console.log(this.editedRows)
          if ( ! this.rows.length ) return []
          //console.log(this.rows.length)
          const llaves = Object.keys(this.rows[0])
          if ( this.deleteable ) llaves.push('_util')
          return llaves 
      },
      tdClass() {
          const classes = {nowrap:false}
          if ( this.nowrap ) classes.nowrap = 1
          return classes
      }
  },
  methods: {
      generateEditedRows() {
        return this.rows.map ( (row,i) => {
            /*
            Object.keys(row).forEach ( key => {
                const val = row[key]
                if ( val != null && typeof val == 'object' ) row[key] = JSON.stringify ( val ) 
            })
            */
            return Object.assign ( {}, row, { _rowIndex: i, _filterPassed: true } )
        } )
      },
      editTable ( event, key, rowIndex ) {
            const value =  $(event.target).text()
            this.editedRows[rowIndex][key] = value
            const row = Object.assign({},this.editedRows[rowIndex])
            delete row._rowIndex
            delete row._filterPassed
            this.$emit('rowEdit',{rowIndex,key,value})
            //filterTable()
      },
      onRowDelete ( rowIndex ) {
            const value =  $(event.target).text()
            this.editedRows.splice(rowIndex,1)
            this.$emit('rowDelete',rowIndex)
            //filterTable()
      },
      filterTable () {
          const searchFields = $('.header [contenteditable="true"]')
          //this.filteredRows = this.editedRows
          this.editedRows.forEach ( (row,i) => {
              let filterPassed = true
              Object.keys(this.rows[0]).forEach ( (key,i) => {
                  if ( filterPassed ) {
                    const val = searchFields.eq(i).text()
                    , rowVal = row[key]
                    , re = new RegExp ( val , "gi" )
                    , matches = ( rowVal && rowVal != null && typeof rowVal != "undefined" ) ? rowVal.toString().match(re) : false
                    //this.filteredRows = this.filteredRows.filter ( row => row[key].indexOf(val) != -1 )
                    //filterPassed = val == "" ? true : ( val == "*" ? ( row[key] != "" ) : ( row[key].indexOf(val) != -1 ) )
                    filterPassed = val == "" ? true : matches

                  }
              })
              this.editedRows[i]._filterPassed = filterPassed
          })
          this.resizeHeaders()
          //console.log(this.editedRows)
        //, filteredRows = this.rows.filter ( row => row[key].indexOf(val) != -1 )
        //this.filteredRows = filteredRows

      },
      onRowClick (row,rowIndex) {
        //const $tr = $(event.currentTarget)
        //$tr.closest('table').find('tr').removeClass('rowSelected')
        const $trs = $(this.$refs.tabla).find('tr')
        $trs.removeClass('rowSelected')
        const $tr = $trs.eq(rowIndex)
        $tr.addClass ( 'rowSelected')
          this.$emit('rowClick',row)
      },
      orderBy ( key, target ) {
          if ( !this.orderable ) return false
          const order = this.orderby[key] 
          let newOrder
          switch ( order ) {
              case 'asc':
                newOrder = 'desc'
                break
              case 'desc':
                newOrder = false
                break
              default:
                newOrder = 'asc'
          }
          delete this.orderby[key]
          $(target).removeAttr('data-order')
          if ( newOrder ) {
            this.orderby[key] = newOrder
            $(target).attr('data-order',newOrder)
          }
          this.$emit('orderBy',this.orderby)
        //log(this.orderby)
      },
      getOrder ( key ) {
          const order = this.orderby[key]
          return order
      },
      resizeHeaders() {
        const $header = $(this.$refs.header)
        , $tbody = $(this.$refs.tbody)
        , $columns = $tbody.find('tr:visible').eq(0).find('td')
        , $headerColumns = $header.find('tr').eq(0).find('td')
        //console.log('hc:'+$headerColumns.length)
        $header.width($tbody.width())
        $columns.each ( function (i) {
            const $col = $(this)
            , $headerCol = $headerColumns.eq(i)
            , width = $col.width()
            //console.log(i+'*'+width)
            $headerCol.width ( width )
        })
        this.scrollHeaders()
        //$table.css({background:'red'})
      },
      scrollHeaders() {
          //this.resizeHeaders()
          const div = this.$refs.scrollableDiv //$('#scrollableDiv')[0]
          , $header = $(this.$refs.header)
          , scrollLeft = ( div.scrollLeft * -1 ) 
          , width = $('#component-container').width()
          $header.css({'margin-left':scrollLeft+ 'px'})//.width (width-scrollLeft-20)
          //$(this.$refs.header).css({clip:`rect(0px,${width-scrollLeft-16}px,100px,0px)`})
          //console.log(width
      }
  },
  updated(){
    //if ( this.editedRows.length ) this.onRowClick(this.editedRows[0],0)
      this.resizeHeaders()
  },
  mounted(){
    //if ( this.editedRows.length ) this.onRowClick(this.editedRows[0],0)
      this.resizeHeaders()
  }
}
</script>

<style scoped>
    .table {
        margin: 0;
    }
    tfoot, tfoot * {
        max-height: 0;
        height: 0;
    }
    .header {
        border:0px solid gray;
        //margin-top:-1px;
    }
    .header tr {
        background:#f4f4f4;
        //color: white;
    }
    [data-component="Tabla"] tr:hover {
        background: #eee;
    }
    td {
        border:1px solid #ddd;
        box-sizing:border-box;
        font-size:11px;
    }
    .header td {
        //border:0;
    }
    .header td div {
        background: white;
        border:1px solid lightgray;
        padding: 2px;
        box-sizing: border-box;
    }
    td.nowrap {
        white-space: nowrap;
    }
    [data-order="asc"] {
        background: blue
    }
    [data-order="desc"] {
        background: green
    }
    table {
        border-collapse: collapse;
        cursor: pointer;
    }
    td [contenteditable="true"] {
        cursor: text;
        border: 1px solid transparent;
        box-sizing: border-box;
    }
    td [contenteditable="true"]:hover {
        border-color: gray;
    }
    td [contenteditable="true"]:focus {
        background:white;
        color: #444;
    }
</style>