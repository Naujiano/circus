<template>
  <Ly flexbox=1 column=1 grow=1 height=1 data-component="Ventana" :data-layout="isInline?'inline':'default'" style="background:"
    ref="Ventana">
    <div style="width:100%; padding: 5px 5px" v-show="admin">
        <div class="toolbar-box">
            <div class="toolbar-box-title">Navegación</div>
            <select ref="parentTable" data-help-code="ventana-toolbar-parents" v-if="parentTablesWindows.length" class="form-control" style="display:inline;width:auto;font-size:11px;margin-top:2px" @change="injectParent()">
                <option>Padres...</option>
                <option v-for="tab in parentTablesWindows" :value="tab.index">{{tab.name}}</option>
            </select>
            <select ref="childTable" data-help-code="ventana-toolbar-childs" v-if="childTablesWindows.length" class="form-control" style="display:inline;width:auto;font-size:11px" @change="injectChild()">
                <option>Hijos...</option>
                <option v-for="tab in childTablesWindows" :value="tab.index">{{tab.name}}</option>
            </select>
        </div>
        <div class="toolbar-box">
            <div class="toolbar-box-title">Tabla Principal</div>
            <select @change="tableChange($event)" class="form-control" style="display:inline;width:auto;font-size:11px;margin-bottom:-2px;margin-top:1px" :data-help-code="getRelations(tabs.names,evaluatedFieldsOfVentana.identities)">
                <option v-for="table in availableTables" :value="table[0]" :selected="table[0]==ventana.data.table?'selected':''">{{table[1].table_alias}}</option>
            </select>
        </div>
        <div class="toolbar-box">
            <div class="toolbar-box-title">Paneles</div>
            <Toolbar :buttons="buttons2" style="width:auto;float:left;margin:0px 0 -2px 3px" />
        </div>
        <div class="toolbar-box">
            <div class="toolbar-box-title">Archivo de Configuración</div>
            <select id="configFileSelect" class="form-control" style="display:inline;width:auto;font-size:11px;margin-bottom:-2px;margin-top:1px; float:left">
                <option value="">Importar Config...</option>
                <option v-for="fn in configFilesList" :value="fn" :selected="fn==api.parsedSearch.reset">{{fn}}</option>
            </select>
            <Toolbar :buttons="buttons" style="width:auto;float:left;margin:0px 0 -2px 3px" />
        </div>
        <div class="toolbar-box">
            <div class="toolbar-box-title">Salir</div>
            <button @click="logout()">SALIR</button>
        </div>
    </div>
    <!--
    <div style="padding:7px 5px;min-height:32px">
      <div style="float:right;text-align:right">
      </div>
    </div>
    --> 
      <!--<Ly flexbox=1 height=1>-->
      <div style="display:flex;flex-grow:1;height:calc(100% - 0px);max-height:calc(100% - 50px);position:relative">
          <div v-show="panels.form&&admin" class="panel-envelope" style="height:100%;border:0px solid red" ref="Formulario">
            <Formulario :item="form.data" :onFilter="formFilter" :overflow="overflow" :keysSettings="keysSettings" :ventana="evaluatedVentana" style="min-width:150px;background:#f4f4f4;padding:0px"
            />
          </div>
          
          <Ly grow=1 breakHeight=1 shrink=1 class="slots panel-envelope" v-show="list" style="flex-grow:1">
              <!--
            <div style="float:left;position:absolute;margin-top:-42px;margin-left:-10px;padding-left: 30px">
              <button v-show="admin" @click="toolbarClick('formver')" style="position:absolute;height:18px;margin-left:-30px;margin-top:4px">
                    <div :class="{'arrow-left':formver,'arrow-right':!formver}"></div>
                </button>
            </div>
            -->
            <Listado :rows="ventana.data.list.data" :ventana="evaluatedVentana" :filter="formFilterState.data" :overflow="overflow" :formSetValues="formSetValues"
              :keysSettings="keysSettings" v-on:rowClick="rowClick" ref="listado" style="background:#f4f4f4;padding:5px;box-sizing:border-box"/>
          </Ly>
          
      </div>
  </Ly>
</template>



<script>
import { mapActions } from 'vuex'
import jsonBeautify from 'json-beautify'
import Ly from './layout.vue'
import Formulario from './formulario.vue'
import Listado from './listado.vue'
import Toolbar from './tool-bar.vue'
//import queryString from 'query-string';
//const parsedSearch = this.api.parsedSearch //queryString.parse(location.search)


export default {
  props: [ 'ventana', 'isInline', 'index', 'switchVentana', 'panels' ],
  components: { Ly, Formulario, Toolbar, Listado },
    data: function () {
        return {
            configFilesList: [],
            parentTables: this.api.getDirectParents(this.ventana.data.table),
            childTables: this.api.getDirectSuns(this.ventana.data.table),
            evaluatedFieldsOfVentana: { fields: [], identities: [] },
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
            formFilterState: { data: [], settings: this.keysSettings },
            form: { data: {} }
            //, techButtons: this.api.parsedSearch.dev && this.api.parsedSearch.admin
            , admin: this.api.parsedSearch.admin
            , buttons2: [
                {
                    label: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"><path fill="#444444" d="M0 16h16v-16h-16v16zM3 1v1h1v-1h11v14h-12v-1h-1v1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h1z"></path><path fill="#444444" d="M2 12h1v1h-1v-1z"></path><path fill="#444444" d="M3 13h1v1h-1v-1z"></path><path fill="#444444" d="M3 11h1v1h-1v-1z"></path><path fill="#444444" d="M3 9h1v1h-1v-1z"></path><path fill="#444444" d="M2 10h1v1h-1v-1z"></path><path fill="#444444" d="M2 8h1v1h-1v-1z"></path><path fill="#444444" d="M2 6h1v1h-1v-1z"></path><path fill="#444444" d="M3 7h1v1h-1v-1z"></path><path fill="#444444" d="M3 5h1v1h-1v-1z"></path><path fill="#444444" d="M3 3h1v1h-1v-1z"></path><path fill="#444444" d="M2 4h1v1h-1v-1z"></path><path fill="#444444" d="M2 2h1v1h-1v-1z"></path></svg>`,
                    helpCode:"",
                    onClick: () => { 
                        this.$emit('panelSwitch','form')
                    }
                },
                {
                    label: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"><path fill="#444444" d="M16 16v-16h-16v16h16zM1 13h1v-1h-1v-11h14v12h-1v1h1v1h-1v-1h-1v1h-1v-1h-1v1h-1v-1h-1v1h-1v-1h-1v1h-1v-1h-1v1h-1v-1h-1v1h-1v-1h-1v-1z"></path><path fill="#444444" d="M12 13h1v1h-1v-1z"></path><path fill="#444444" d="M13 12h1v1h-1v-1z"></path><path fill="#444444" d="M11 12h1v1h-1v-1z"></path><path fill="#444444" d="M9 12h1v1h-1v-1z"></path><path fill="#444444" d="M10 13h1v1h-1v-1z"></path><path fill="#444444" d="M8 13h1v1h-1v-1z"></path><path fill="#444444" d="M6 13h1v1h-1v-1z"></path><path fill="#444444" d="M7 12h1v1h-1v-1z"></path><path fill="#444444" d="M5 12h1v1h-1v-1z"></path><path fill="#444444" d="M3 12h1v1h-1v-1z"></path><path fill="#444444" d="M4 13h1v1h-1v-1z"></path><path fill="#444444" d="M2 13h1v1h-1v-1z"></path></svg>`,
                    helpCode:"",
                    onClick: () => { 
                        this.$emit('panelSwitch','bottom')
                    }
                },
            ]
            , buttons: [
                /*{label:"ShowTree",onClick:()=>console.log(JSON.cc(this.$store.state))},*/
                
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="transform:rotate(180deg)"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    helpCode:"config-load",
                    //title: "Guardar Vista",
                    onClick: () => { 
                        const configFile = $('#configFileSelect option:selected').text()
                        this.loadConfigFile(configFile)
                        console.log(configFile)
                    }
                },
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    helpCode:"config-save",
                    onClick: () => { 
                        const configFile = this.api.saveTree("",1) //$('#configFileSelect option:selected').text()
                        if ( ! this.configFilesList.filter ( ele => ele.toLowerCase() == configFile.toLowerCase() ).length ) this.configFilesList.push (configFile)
                        window.circus.showHelpBox({title:'Configuración Guardada',text:"Se ha guardado la configuración actual en el archivo " + configFile})
                        //console.log(configFile)
                    }
                },
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330.5 330.5"><path d="M178.3 136.6l16.4 16.4 69.7-69.7c2.3-2.3 3.4-5.2 3.4-8.2 0-3-1.1-5.9-3.4-8.2 -4.5-4.5-11.8-4.5-16.4 0L178.3 136.6zM172.3 140.2l-0.7-0.7 -12.4 12.4 -7.7 7.7 20.4 20.4 8.3-8.3 11.8-11.8 -0.9-0.9 -1.2-1.2 -16.4-16.4L172.3 140.2zM66.8 197.2c-0.1 0-0.2 0.1-0.3 0.1 -0.5 0.1-0.9 0.3-1.3 0.6l-0.2 0.1L65 198c-0.5 0.3-0.8 0.7-1.2 1.2 -0.3 0.5-0.6 1-0.8 1.6 -0.5 1.7-0.3 3.7 1.3 4.9 3.8 3 7.7 6 11.6 8.9l0.7-0.3 1.7-0.7L80 213l14.1-5.4 20.6-7.9 -14.3 16.6 -8 9.2 -1.1 1.3 -1.1 1.3 -1.1 1.3c0.8 0.3 1.6 0.4 2.5 0.2 0.5-0.1 1-0.3 1.6-0.5 0.1 0 0.1-0.1 0.2-0.1 0.6-0.3 1.1-0.5 1.7-0.7l3.3 3.3c0 0.8-0.1 1.5-0.1 2.3 -0.1 0.7-0.1 1.5-0.2 2.2 -0.1 1.1-0.3 2.2-0.6 3.3 -0.6 2.5 0.8 5.7 3.5 6.2 4.4 0.9 8 2.4 11.1 4.5 3.5 2.4 6.4 5.4 9.1 9.1 1.3 1.8 2.6 3.6 3.9 5.6 1 1.6 2.6 2.3 4.1 2.3 0.7 0 1.4-0.1 2-0.4 2.4-0.9 4.2-3.4 3.1-6.2l32.3-75.5 -20.2-20.2L66.8 197.2zM165.2 330.5L165.2 330.5C74 330.5 0 256.5 0 165.2v0C0 74 74 0 165.2 0h0c91.3 0 165.2 74 165.2 165.2v0C330.5 256.5 256.5 330.5 165.2 330.5z"/></svg>`,
                    helpCode:"config-delete",
                    onClick: () => { 
                        const configFile = $('#configFileSelect option:selected').text()
                        this.deleteConfigFile(configFile)
                        this.configFilesList = this.configFilesList.filter (ele=>{if(ele!=configFile)return true;return false})
                        //$('#configFileSelect')[0].selectedIndex = 0
                        //$('#configFileSelect').blur()
                        //console.log(configFile)
                    }
                }
                /* BOTÓN PARA EDITAR ARCHIVO DE CONFIGURACIÓN. DESACTIVADO DE MOMENTO.
                { 
                    label: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;" xml:space="preserve"><g>	<g>		<path d="M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003			S232.835,0,149.996,0z M133.314,149.997c0,3.133-0.571,6.111-1.569,8.901l41.868,20.142c4.819-5.275,11.731-8.595,19.436-8.595			c14.553,0,26.353,11.796,26.353,26.348c0,14.555-11.803,26.356-26.359,26.356c-14.553,0-26.359-11.801-26.359-26.356			c0-1.395,0.145-2.757,0.353-4.09l-44.568-21.436c-4.357,3.188-9.71,5.089-15.52,5.089c-14.555,0-26.356-11.796-26.356-26.361			c0-14.55,11.801-26.348,26.356-26.348c5.81,0,11.165,1.901,15.523,5.086l44.571-21.431c-0.21-1.336-0.353-2.692-0.353-4.09			c0-14.558,11.803-26.356,26.359-26.356c14.553,0,26.356,11.798,26.356,26.356c0,14.555-11.803,26.356-26.356,26.356			c-7.7,0-14.617-3.328-19.436-8.598l-41.868,20.134C132.744,143.89,133.314,146.875,133.314,149.997z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`,
                    onClick: function(){
                        if($('#ttt').length){$('#ttt').remove();return}
                        const that = this//.$store.state
                        //return
                        const div = $('<textarea id="ttt"/>').val(jsonBeautify(that.$store.state.database, null, 2, 100)).css({
                            width: '100vw'
                            , height: '100vh'
                            , position: 'absolute'
                            , background: 'white'
                            , border: '1px solid #ddd'
                            //, bottom: '50px'
                            //, right: '50px'
                            , 'z-index': 200
                        }).on('blur',function(){
                            const val = JSON.parse(this.value)
                            that.$store.commit('setKey',{path:'.database',val})
                            $('#ttt').remove()
                        })
                        $('body').prepend(div)
                    }.bind(this)
                },
                */
             ],
        }
    },
  computed: {
      database(){
                   return JSON.cc(this.$store.state.database)
      },
        evaluatedVentana () {
            const evaluatedVentana = this.ventana
            Object.assign ( evaluatedVentana.data , this.evaluatedFieldsOfVentana )

            return evaluatedVentana
        },
      childTablesWindows () {
          const childTableNames = Object.keys(this.api.getDirectSuns(this.ventana.data.table))
        const ventanas = this.$store.state.ventanas.data.map ( (win,index) => ({name:win.name,table:win.table,index}))
        , childWindows = ventanas.filter ( win => {
            return childTableNames.indexOf(win.table.toLowerCase()) != -1
         } )
        return childWindows
      },
      parentTablesWindows () {
          const parentTableNames = Object.keys(this.api.getDirectParents(this.ventana.data.table))
          //const parentTableNames = cleanCopy(this.tabs.names)//.map ( (name,index) => ({name,index:})))
          //parentTableNames.splice ( 0,1 )
          const ventanas = this.$store.state.ventanas.data.map ( (win,index) => ({name:win.name,table:win.table,index}))
          , parentWindows = ventanas.filter ( win => {
            return parentTableNames.indexOf(win.table.toLowerCase()) != -1
        } )
          //console.log(parentWindows)
          return parentWindows
      },
      availableTables () {
          return Array.from (window.tablesMap)

          const tablesObj = this.$store.state.database.tables
          return tablesObj.map ( ( o ) => o.table_alias )
          return Object.keys(tablesObj)
      },
      tabs () {
          const table = this.ventana.data.table
          , tabs = this.api.getTablesRelation(table)//.names
          //console.log(tabs)  
        return tabs
      },
      keysSettings() {
          //log('func')
          const keysSettings = {}
          var val
          this.evaluatedFieldsOfVentana.fields.forEach ( field => {
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
   watch: {
       ventana() {
           this.form.data = this.formDataBlanked()
       },
       database() {
           const that = this
           that.setFieldsForTable()
           //return
           that.$refs.listado.qeParams.forEach ( param => {
               const fieldConfig = that.evaluatedFieldsOfVentana.fields[param.index]
               , { list, listModel , listAlias, listType, key } = fieldConfig
               , newListConfig = { list, listModel , listAlias, listType, key }
                //debugger
               Object.assign ( param, fieldConfig )

           })
           that.$refs.listado.qeParams = JSON.cc(that.$refs.listado.qeParams)
       }

   },
   methods: {
      ...mapActions(['setVentana']),
    logout() {
        window.logout()
    },
    loadConfigFile ( fileName ) {
        //const fileName = $(target).find('option:selected').text()
        this.api.loadConfig ( fileName )
    },
    deleteConfigFile ( fileName ) {
        if ( ! confirm ( 'Eliminar ' + fileName + '?' ) ) return false
        this.api.deleteConfig ( fileName, (res) => {
            alert(res)
            this.loadFilesList ( $('#configFileSelect')[0] )
        } )
    },
      getRelations(tabs,identities) {
          const lis = []
          tabs.forEach ( (tab,i) => {
              const li = '<li style="text-transform:">' + tab + ' (' + identities[i] + ')</li>'
              lis.push (li)
          })
          const $text = $('<div/>').append('<titulo>Relaciones</titulo>').append('<ul style="list-style-type: square;padding-left:10px">'+lis.toString().replace(/\,/g,'')+'</ul>')
          return $text.html()//.wrap('<div/>').parent().html()
      },
      injectChild() {
        const qe = this.$refs.listado.$refs.qe
        , params = qe.settings.params
        , indexVentana = this.$refs.childTable.value
        this.$refs.childTable.selectedIndex=0
        let actualQeParams = this.$store.getters.qeParams(indexVentana)
        if ( ! actualQeParams ) actualQeParams = []
        this.$store.commit ( 'Ventana_injectQE' , {indexVentana,qeParams:actualQeParams.concat(params)} )
        //this.$store.commit ( 'Ventana_injectQE' , {indexVentana,qeParams:params} )
        this.switchVentana(indexVentana)
      },
      injectParent() {
        const qe = this.$refs.listado.$refs.qe
        , params = qe.settings.params
        , indexVentana = this.$refs.parentTable.value
        , joinSyntax = this.tabs.joinSyntax
        //, indexTabla = this.$refs.parentTable.selectedIndex
        , nombreTabla = this.parentTablesWindows.filter ( win => win.index == indexVentana )[0].table
        //, idfield = nombreTabla+'.'+this.ventana.data.identities[indexTabla]
        , descripcion = this.ventana.data.table.toUpperCase() + ' con ' + params.filter(par=>par._active).map ( par => {
            let val = par.value
            try {
                const json = JSON.parse ( val )
                if ( typeof json == 'object' && !json.length ) { //es select con descripcion
                    val = json.descripcion
                }
            } catch ( err ) { }
            
            return `${par.alias}: ${val}`
        })
        , that = this
        this.api.getIdentitiesForTableSet(nombreTabla,function(padre){
            const pkpadre = nombreTabla + '.' + padre[0].column_name
            console.log(pkpadre)
            const sql = `SELECT ${pkpadre} FROM ${joinSyntax} ${qe.settings.sqlSyntax?' WHERE '+qe.settings.sqlSyntax:''}`
            , val = JSON.stringify({
                sql: sql
                , descripcion
            })
            , param = {
                alias: pkpadre
                , campo: ""
                , data_type: "text"
                , key: pkpadre
                , reference: pkpadre
                , leftText: ""
                , rightText: ""
                , text: val
                , value: val
                , vista: ""
                , operator: "AND"
                , _active: true
                , _extended: false
                , _inlist: true
                , _orderby: ""
            }
            that.$refs.parentTable.selectedIndex=0
            let actualQeParams = that.$store.getters.qeParams(indexVentana)
            if ( ! actualQeParams ) actualQeParams = []
            const newParams = [param].concat(actualQeParams)
            that.utils.unifyObjectKey ( {array: newParams, key: 'alias'} )
            that.$store.commit ( 'Ventana_injectQE' , {indexVentana,qeParams:newParams} )
            that.switchVentana(indexVentana)
        })
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
          /*
          if ( ! confirm ( 'Cambiar a -' + event.target.value + '- la tabla asociada a esta ventana.' ) ) {
              event.target.value = this.ventana.data.table
              return false
          }
          */
        const newTable = event.target.value
        this.setFieldsForTable (newTable)
      },
      setFieldsForTable (tableName) {
        window.working(1)
        if ( tableName ) this.$store.commit ( 'Ventana_setTable' , {indexVentana:this.index,tableName} )
        tableName = tableName ? tableName : this.ventana.data.table
        this.api.getFieldsForTable ( tableName, ( { fields, identities } ) => {
            //this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            this.evaluatedFieldsOfVentana = { fields, identities }
            this.form.data = this.formDataBlanked()
            window.working(0)
        } )
      },
      toolbarClick (buttonLabel) {
          const key = (buttonLabel != 'formver') ? buttonLabel.toLowerCase() : 'formver'
          this[key] = ! this[key]
          setTimeout(function(){this.$refs.listado.containerResize()}.bind(this),10)
      },
      fieldsOfVentana(ventana) {
        return this.evaluatedFieldsOfVentana.fields
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
            const that = this
            /*
            console.log(filterState)
            if ( parameterExists () ) {
                window.circus.showHelpBox ({title:'Este campo ya está en el listado',text:'El campo que está intentando añadir ya está presente en el listado.'})
                //return false
            }
            function parameterExists () {
                const params = that.$refs.listado.$refs.qe.parameters.data
                , key = Object.keys(filterState)[0]
                let exists = false
                params.forEach ( par => {
                    if ( par.reference == key ) exists = true
                })
                return exists
            }
            */
            //debugger
            const filteredField =  filterState[Object.keys(filterState)[0]]
            const index = filteredField.index
            //console.log(this.$store.state.ventanas.data[this.index].fields[index])
            //this.formFilterState.data = filterState
            let fieldConfig = JSON.cc (this.evaluatedFieldsOfVentana.fields[index])  //JSON.cc(this.$store.state.ventanas.data[this.index].fields[index])
            
            //fieldConfig = Object.assign ( fieldConfig, filteredField )
            // debugger

            this.formFilterState.data = [fieldConfig]
            //console.log(this.formFilterState.data)
            const actualRows = this.$refs.listado.grid.rows
            if ( ! actualRows ) return false

            //AÑADO UNA COLUMNA AL LISTADO PROVISONALMENTE

            const rows = []//JSON.cc ( this.grid.rows )
            actualRows.forEach ( fila => {
                //const fila = JSON.cc ( row )
                const newLine = {}
                Object.keys(fila).forEach ( (key,i)=>{
                    if ( i == 1 ) newLine[Object.keys(filterState)[0].split(".")[3]] = ""
                    newLine[key] = fila[key]
                })
                rows.push ( newLine )
            })
            this.$refs.listado.grid.rows = rows
            this.$nextTick(function(){this.$refs.listado.compute()})
            //this.$refs.listado.compute()

        },
        fieldUniqueId ( field ) {
            const table_name = field.table_name
            , column_name = field.column_name
            if ( field.literal ) return column_name
            //const dbID = this.api.getTableConnectionId ( table_name )
            const dbID = field.table_catalog
            return dbID + '.dbo.' + table_name + '.' + column_name
        },
        formSetValues ( formData ) {
            //Object.assign ( this.form.data, formData )
            const blankedData = this.formDataBlanked()
            Object.keys(formData).forEach ( key => {
                if ( typeof blankedData[key] != 'undefined' ) 
                    blankedData[key] = formData[key]
            })
            this.form.data = blankedData//Object.assign ( this.formDataBlanked(), formData )
            //log(this.form.data)
        },
      formDataBlanked() {
          const formData = {}
          this.evaluatedFieldsOfVentana.fields.forEach ( field => {
              formData[this.fieldUniqueId(field)] = ""
          })
          return formData
          //return JSON.cc ( this.$store.state.ventanas.data[this.index].fields )
      }
 },
 created: function () {
        this.api.getFieldsForTable ( this.ventana.data.table, ( { fields, identities } ) => {
            //console.log(JSON.cc(fields))
            //this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            this.evaluatedFieldsOfVentana = { fields, identities }
            this.form.data = this.formDataBlanked()
        } )
        this.api.listFiles('./json/',(list)=>{
            /*
            target.options.length = 1
            const $select = $(target)
            */
            this.configFilesList = list
            /*
            list.forEach ( item => {
                $select.append(`<option value="${item}">${item}</option>`)
            })
            */
        })
        $(this.$refs.Formulario).resizable({
            handles: 'e'
            //,ghost:true
        })
        const that = this
        $(window.document).on('keyup',function(e){
          if(e.keyCode==13) that.$refs.listado.loadPage()
        })
  }
  ,updated: function () {
        $(this.$refs.Formulario).resizable({
            handles: 'e'
            //,ghost:true
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