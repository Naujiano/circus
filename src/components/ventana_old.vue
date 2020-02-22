<template>
  <Ly flexbox=1 column=1 grow=1 height=1 data-component="Ventana" :data-layout="isInline?'inline':'default'" style="background:#f4f4f4"
    ref="Ventana">
    <div style="padding:7px 2px;min-height:32px">
      <div style="float:right;text-align:right">
        <!--<div contenteditable="true" @blur="nameChange($event)" style="display:inline">{{ventana.data.name}}</div>-->
        <select @change="tableChange($event)">
                <option v-for="table in availableTables" :value="table" :selected="table==ventana.data.table?'selected':''">{{table}}</option>
            </select> {{tabs}}
        <br> {{ventana.data.identities}}
        <!--
             -->
      </div>
    </div>
    <Ly :overflow="!overflow" breakHeight=1>
      <Ly flexbox=1 height=1>
        <!--
                <Ly :overflow="overflow" class="slots" v-show="tree" style="background:white">
                    <Campos :ventana="ventana" :items="fieldsOfVentana(ventana)" labelKeyName="label" :cursor="['ventanas','data',index,'fields']" :branchs="itemEditor.branchs"  :tabName="tabName" :tabs="tabs"/>
                </Ly>
                -->
        <template v-if="overflow">
          <!--<div style="padding: 5px; height: 100%;box-sizing:border-box;border:0px solid red" ref="Formulario">-->
          <div v-show="formver" class="panel-envelope" style="height:100%;" ref="Formulario">
            <Formulario :item="form.data" :onFilter="formFilter" :overflow="overflow" :keysSettings="keysSettings" :ventana="ventana"
            />
          </div>
          <!--</div>-->
          <Ly grow=1 breakHeight=1 shrink=1 class="slots panel-envelope" v-show="list" style="flex-grow:1">
            <div style="float:left;position:absolute;margin-top:-40px">
              <button @click="toolbarClick('formver')" style="padding: 3px">
                    <div :class="{'arrow-left':formver,'arrow-right':!formver}"></div>
                </button>
              <Toolbar :buttons="buttons" style="width:auto;float:right;margin:-2px 0 0 3px" />
              <!--
                <select>
                    <option v-for="tab in Object.keys(parentTables)" :value="tab">{{tab}}</option>
                </select>
                -->
              <select ref="childTable">
                    <option v-for="tab in childTablesWindows" :value="tab.index">{{tab.name}}</option>
                </select>
              <button @click="injectChild()">>></button>
            </div>
            <Listado :rows="ventana.data.list.data" :ventana="ventana" :filter="formFilterState.data" :overflow="overflow" :formSetValues="formSetValues"
              :keysSettings="keysSettings" v-on:rowClick="rowClick" ref="listado" />
          </Ly>
        </template>
        <template v-else>
          <Ly flexbox=1 height column=1>
            <Ly class="slots" v-show="formver">
              <Formulario :item="form.data" :overflow="overflow" :keysSettings="keysSettings" :ventana="ventana" />
            </Ly>
            <Ly grow=1 breakHeight=1 shrink=1 class="slots" v-show="list">
              <Listado :rows="ventana.data.list.data" :multiline="true" :ventana="ventana" :filter="formFilterState.data" :overflow="overflow"
                :formSetValues="formSetValues" :keysSettings="keysSettings" v-on:rowClick="rowClick" ref="listado" /> </Ly>
          </Ly>
        </template>
      </Ly>
    </Ly>
  </Ly>
</template>



<script>
import $ from 'jquery'
import resizable from 'jquery-ui/ui/widgets/resizable'
import Ly from './layout.vue'
import Formulario from './formulario.vue'
import Listado from './listado.vue'
import Toolbar from './tool-bar.vue'
import {getTablesRelation,getFieldsForTable,saveTree,getDirectParents,getDirectSuns} from '../api.js'
import {log,cleanCopy} from '../helpers.js'
import { mapActions } from 'vuex'
import * as store from '../store.js'
import jsonBeautify from 'json-beautify'


export default {
  props: ['ventana','isInline','index'],
  components: { Ly, Formulario, Toolbar, Listado },
    data: function () {
        return {
            parentTables: getDirectParents(this.ventana.data.table),
            childTables: getDirectSuns(this.ventana.data.table),
            tree: true,
            formver: true,
            list: true,
            show: true,
            overflow: !this.isInline,
            itemEditor: {
                branchs: [
                    { key: "form" },
                    { key: "list" }
                ]
            },
            formFilterState: { data: {}, settings: this.keysSettings },
            form: { data: this.formDataBlanked() }
            , buttons: [
                {label:"ShowTree",onClick:()=>console.log(cleanCopy(this.$store.state))},
                { 
                    label: "AlterTree",
                    onClick: store.alterTree
                },
                { 
                    label: "Save Tree",
                    onClick: ()=>saveTree()
                },
                { 
                    label: "Edit Tree",
                    onClick: function(){
                        if($('#ttt').length){$('#ttt').remove();return}
                        const that = this//.$store.state
                        //return
                        const div = $('<textarea id="ttt"/>').val(jsonBeautify(that.$store.state.database, null, 2, 100)).css({
                            width: '50vw'
                            , height: '90vh'
                            , position: 'absolute'
                            , background: 'white'
                            , border: '1px solid #ddd'
                            , bottom: '50px'
                            , right: '50px'
                            , 'z-index': 200
                        }).on('blur',function(){
                            const val = JSON.parse(this.value)
                            that.$store.commit('setKey',{path:'.database',val})
                        })
                        $('body').prepend(div)
                    }.bind(this)
                },
             ],
        }
    },
  computed: {
      childTablesWindows () {
          const childTableNames = Object.keys(getDirectSuns(this.ventana.data.table))
        const ventanas = this.$store.state.ventanas.data.map ( (win,index) => ({name:win.name,table:win.table,index}))
        , childWindows = ventanas.filter ( win => {
            return childTableNames.indexOf(win.table.toLowerCase()) != -1
         } )
        return childWindows
      },
      availableTables () {
          const tablesObj = this.$store.state.database.tables
          return Object.keys(tablesObj)
      },
      tabs () {
          const table = this.ventana.data.table
          , tabs = getTablesRelation(table).names
          //console.log(tabs)  
        return tabs
      },
      keysSettings() {
          //log('func')
          const keysSettings = {}
          var val
          this.ventana.data.fields.forEach ( field => {
              const list = field.dbsettings ? field.dbsettings.list : false
              val = { data_type: field.data_type }
              if ( list ) {
                  Object.assign ( val, { list: { values: list } } )
                  keysSettings[this.fieldUniqueId(field)] = val
              } else {
              //if ( field.label == "DOM_Id") {
                  keysSettings[this.fieldUniqueId(field)] = val
              }
          })
          //console.log(keysSettings)
          return keysSettings
      },
      toolbarButtons () {
          return [
              {
                  label: this.formver ? " < " : " > ",
                  onClick: this.toolbarClick
              },
          ]
      }
   },
   methods: {
      ...mapActions(['setVentana']),
      injectChild() {
        const qe = this.$refs.listado.$refs.qe
        , params = qe.settings.params
        , indexVentana = this.$refs.childTable.value
        //console.log(indexVentana)
        //qe.clear() 
        this.$store.commit ( 'Ventana_setVisibility' , {indexVentana,visible:true} )
        this.$store.commit ( 'Ventana_injectQE' , {indexVentana,qeParams:params} )
      },
      rowClick(row){
          this.form.data = this.formDataBlanked()
        Object.assign(this.form.data , row)
      },
      nameChange ( event ) {
        const newName = event.target.innerHTML
        console.log(newName)
        this.$store.commit ( 'Ventana_setName' , {indexVentana:this.index,ventanaName:newName} )
      },
      tableChange ( event ) {
          if ( ! confirm ( 'Cambiar a -' + event.target.value + '- la tabla asociada a esta ventana.' ) ) {
              event.target.value = this.ventana.data.table
              return false
          }
        const newTable = event.target.value
        this.$store.commit ( 'Ventana_setTable' , {indexVentana:this.index,tableName:newTable} )
        getFieldsForTable ( newTable, ( { fields, identities } ) => {
            //console.log(cleanCopy(fields))
            this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            this.form.data = this.formDataBlanked()
        } )
        //this.$store.state.
      },
      toolbarClick (buttonLabel) {
          //console.log(buttonLabel)
          const key = (buttonLabel != 'formver') ? buttonLabel.toLowerCase() : 'formver'
          this[key] = ! this[key]
          setTimeout(function(){this.$refs.listado.containerResize()}.bind(this),10)
      },
      fieldsOfVentana(ventana) {
        return ventana.data.fields
        //log(this.$store.state)
        //return this.$store.state.database.tables[ventana.data.table].fields
      },
       tabName ( item ) {
            const itemTableName = item.table_name
           //console.log(itemTableName)
            //, tableName = this.ventana.table
            return itemTableName
        },
        formFilter ( filterState ) {
            this.formFilterState.data = filterState
            //console.log(cleanCopy(this.formFilterState))
        },
        fieldUniqueId ( field ) {
            const table_name = field.table_name
            , column_name = field.column_name
            return table_name + '.' + column_name
        },
        formSetValues ( formData ) {
            //Object.assign ( this.form.data, formData )
            this.form.data = Object.assign ( this.formDataBlanked(), formData )
            //log(this.form.data)
        },
      formDataBlanked() {
          const formData = {}
          this.$store.state.ventanas.data[this.index].fields.forEach ( field => {
              formData[this.fieldUniqueId(field)] = ""
          })
          //log(formData)
          return formData
      }
 },
 mounted: function () {
        getFieldsForTable ( this.ventana.data.table, ( { fields, identities } ) => {
            //console.log(cleanCopy(fields))
            this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            this.form.data = this.formDataBlanked()
        } )
        //return
        $(this.$refs.Formulario).resizable({
            handles: 'e'
        })
  }
}
</script>

<style scoped>
    .slots:not(:last-child) {
        width: 300px;
        z-index:1;
        overflow-x: hidden;
    }
</style>