<template>
    
    <Ly flexbox=1 column=1 height=1 data-component="Formulario" style="border:0 solid #ddd;border-width:0 0px 0 0;">
        <div v-show="showToolbar" style="width:250px;height:30px;min-height:32px;padding:4px 4px 0 4px;border:0 solid #ddd;border-width: 0 0 0px 0" ref="Formulario">
            <Toolbar :buttons="buttons" style="float:left"/>
            <input type="checkbox" style="float:left" :checked="showFields" @click="showFields=$event.target.checked">
            <div style="float:left;margin-top:2px">&nbsp;Campos&nbsp;&nbsp;</div>
            <input type="checkbox" style="float:left" :checked="showPath" @click="showPath=$event.target.checked">
            <div style="float:left;margin-top:2px">&nbsp;Rutas&nbsp;</div>
        </div>
        <div style="width:100%; text-align:center;cursor:pointer" @click="showToolbar=!showToolbar" class=""><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="292.362px" height="292.362px" viewBox="0 0 292.362 292.362" style="enable-background:new 0 0 292.362 292.362;zoom:0.7"	 xml:space="preserve"><g>	<path style="cursor:pointer" d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424		C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428		s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>
        <div style="padding:3px;background:;"><input v-model="filter" class="form-control" placeholder="Buscar..." @focus="$event.target.select()"></div>
        <div style="position:relative;left:calc(100% - 50px);top:-20px;height:0;overflow:visible;font-size:9px;color:gray">{{shownNumber}} / {{Object.keys(formState.editorData).length}}</div>
        <!---<Ly grow=1 :overflow="overflow" style="background:" @scroll="alert('juan')">-->
        <div class="LyItem LyItem-grow LyItem-overflow" @scroll="positionContext($event)" style="background:; padding:0">
            <GridFields 
                :item="formState.editorData" 
                data-component="Formulario" 
                v-on:change="formChange" 
                v-on:clickLabel="clickLabel"
                v-on:focusField="focusField"
                v-on:filter="updateShownNumber"
                v-on:addField="addField"
                :filter="filter" 
                :keysSettings="keysSettings"
                :showFields="showFields"
                :showPath="showPath"
                ref="gridfields"
            />
        </div>
    </Ly>


</template>

<script>
import Ly from './layout.vue'
import Toolbar from './tool-bar.vue'
import GridFields from './grid-fields.vue'
export default {
    components: { GridFields, Toolbar, Ly },
    data: function () {
        return {
            showToolbar: false,
            buttons: [
                /*
                {
                    label: "Load",
                    onClick: this.loadFields
                },
                */
                {
                    label: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 44 44"><g><circle cx="20" cy="20" r="7"></circle><path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,33.3l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0l-5.4-5.4c-0.2-0.2-0.4-0.2-0.6-0.1-1.7,1.1-3.7,1.7-5.9,1.7-6.1,0-11-4.9-11-11s4.9-11 11-11 11,4.9 11,11c0,2.2-0.6,4.2-1.7,5.9-0.1,0.2-0.1,0.5 0.1,0.6l5.4,5.4c0.3,0.5 0.3,1.1-0.1,1.5z"></path></g></svg>`,
                    onClick: this.filter,
                    //title: "Generar parámetros de filtrado con los valores introducidos"
                     helpCode: "form-toolbar-filter"
                },
                {
                    label: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.5 330.5" style="enable-background:new 0 0 330.5 330.5;" xml:space="preserve"><path d="M178.3,136.6l16.4,16.4l69.7-69.7c2.3-2.3,3.4-5.2,3.4-8.2c0-3-1.1-5.9-3.4-8.2c-4.5-4.5-11.8-4.5-16.4,0L178.3,136.6z	 M172.3,140.2l-0.7-0.7l-12.4,12.4l-7.7,7.7l20.4,20.4l8.3-8.3l11.8-11.8l-0.9-0.9l-1.2-1.2l-16.4-16.4L172.3,140.2z M66.8,197.2	c-0.1,0-0.2,0.1-0.3,0.1c-0.5,0.1-0.9,0.3-1.3,0.6l-0.2,0.1L65,198c-0.5,0.3-0.8,0.7-1.2,1.2c-0.3,0.5-0.6,1-0.8,1.6	c-0.5,1.7-0.3,3.7,1.3,4.9c3.8,3,7.7,6,11.6,8.9l0.7-0.3l1.7-0.7L80,213l14.1-5.4l20.6-7.9l-14.3,16.6l-8,9.2l-1.1,1.3l-1.1,1.3	l-1.1,1.3c0.8,0.3,1.6,0.4,2.5,0.2c0.5-0.1,1-0.3,1.6-0.5c0.1,0,0.1-0.1,0.2-0.1c0.6-0.3,1.1-0.5,1.7-0.7l3.3,3.3	c0,0.8-0.1,1.5-0.1,2.3c-0.1,0.7-0.1,1.5-0.2,2.2c-0.1,1.1-0.3,2.2-0.6,3.3c-0.6,2.5,0.8,5.7,3.5,6.2c4.4,0.9,8,2.4,11.1,4.5	c3.5,2.4,6.4,5.4,9.1,9.1c1.3,1.8,2.6,3.6,3.9,5.6c1,1.6,2.6,2.3,4.1,2.3c0.7,0,1.4-0.1,2-0.4c2.4-0.9,4.2-3.4,3.1-6.2l32.3-75.5	l-20.2-20.2L66.8,197.2z M165.2,330.5L165.2,330.5C74,330.5,0,256.5,0,165.2v0C0,74,74,0,165.2,0h0c91.3,0,165.2,74,165.2,165.2v0	C330.5,256.5,256.5,330.5,165.2,330.5z"></path></svg>`,
                    onClick: this.clean
                    //,title: "Vaciar formulario"
                    , helpCode: "form-toolbar-clear"
                },
                /*
                ,{
                    label: "Set",
                    onClick: this.setQuery
                }
                */
            ],
            formState: {
                data: (function(){
                    return this.formStateData ( JSON.cc ( this.item ) )
                }.bind(this))() 
                , editorData: this.item 
            },
            filter: ""
            , shownNumber: 0
            , focusedKeyName: ""
            , showFields: false
            , showPath: false
        }
    },
    props: ['item','onFilter','overflow','keysSettings','ventana'],
    watch: {
        item: function ( val, oldVal ) {
            this.formState.editorData = val
            this.formState.data = this.formStateData ( val )
            //console.log('new item')
        }
    },
    computed : {
      },
    mounted: function () {
        const $form = $(this.$refs.Formulario)
        $form.width($form.width())
        /*
        window.bus.$on('contextListChecked',function(checkedIds){
            this.contextListCheckClick(checkedIds)
        }.bind(this))
        window.bus.$on('contextListClosed',function(){
            this.focusedKeyName=""
        }.bind(this))
        window.bus.$on('contextList:keyup',function(val){
            this.contextListCheckClick(val)
        }.bind(this))
        */
    },
    updated: function() {
        //console.log('updated')
    },
    methods: {
        positionContext(event) {
            window.contextList.positionContext(event)
        },
        contextListKeyUp ( val ) {
            const formState = JSON.cc ( this.formState )
            , key = this.focusedKeyName
            formState.editorData[key] = val
            formState.data[key] = { value: val, text: val }
            this.formState = formState
        },
        contextListRowClick(row){
            
        },
        contextListCheckClick(checkedRows){
            const formState = JSON.cc ( this.formState )
            , key = this.focusedKeyName
            , checkedLiterals = JSON.stringify ( checkedRows.map ( row => row[Object.keys(row)[1]] ) )
            formState.editorData[key] = checkedLiterals
            formState.data[key] = { value: checkedLiterals, text: checkedLiterals }
            this.formState = formState
        },
        updateShownNumber(n){
            this.shownNumber=n
        },
        shownNumber_old() {
            let shownNumber = 0
            //console.log(this.$refs)
            if ( this.$refs.gridfields )
                shownNumber = this.$refs.gridfields.shownNumber
            return shownNumber
        },
        clickLabel($field) {
            const selectedQuery = this.$store.state.selectedQuery
            , queryName = selectedQuery.name
            , $input = $field.find('input').add($field.find('select'))
            , fieldName = $field.find('label').text()
            , value = "{{" + queryName + "|" + fieldName + "}}"
            $input.val(value)
            this.formState.editorData[fieldName] = value
            this.formState.data[fieldName].text = value
            this.formState.data[fieldName].value = value
            /*
            console.log(JSON.cc(this.formState.editorData))
            */
        },
        focusField($field) {
            const keyName = $field.attr('id')
            , val = $field.val()
            , type = this.utils.getBasicDataType (this.keysSettings[keyName].data_type)
            this.focusedKeyName = keyName
            window.contextList.openContext(keyName,$field,val,type,this.contextListCheckClick)
        },
        filterState () {
            const formState = this.formState.data
            , filterState = {}
            //, dynamicListModels = {}
            /*
            Object.keys(listsModels).forEach ( key => {
                const model = listsModels[key]
                if ( ! model.length ) //No es un Array (modelo estático).
                    dynamicListModels[key] = model
            })
            */
            Object.keys(formState).forEach ( key => {
                let value = ( typeof formState[key].value == 'string' || typeof formState[key].value == 'number' ) ? formState[key].value.toString() : ''
                , data_type = ( this.keysSettings && this.keysSettings[key] ) ? this.keysSettings[key].data_type : null
                , list = ( this.keysSettings && this.keysSettings[key] ) ? this.keysSettings[key].list : null
                //, listModelName = lists[key]
                , lm = this.api.getListModel(key)
                , listModel = ( lm && lm.length )  ? ({values:lm}) : false
                , text = formState[key].text
                , regexp = new RegExp ( "{{.*|.*}}", "gi")
                , matches = value.match ( regexp )
                let vista = ""
                , campo = ""
                if ( matches != null ) {
                    const codigo = matches[0].replace ( "{{" , "" ).replace ( "}}" , "" ).split ( "|" )
                    vista = codigo[0]
                    campo = codigo[1]
                }
                if ( listModel ) { // Me salto mi mecanismo de listas convencionales para trabajar con las nuevas multiselec.
                    data_type = "varchar"
                    text = value
                }
                if ( value && value != "" ) filterState[key] = { value, data_type, text, vista, campo, list:listModel }

            })
            //console.log(formState)
            //console.log(JSON.cc(filterState))
            return (filterState)
        },
        formStateData ( editorData ) {
            let formData = {}
            , item = JSON.cc ( editorData )
            //console.log('item')
            Object.keys(item).forEach ( key => {
                const val = item[key]
                formData[key] = { value: val, text: val }
            })
            //console.log(JSON.cc (formData))
            return JSON.cc (formData)
        },
        setQuery () {
            this.clean()
            const actualFormState = this.formState.editorData
            , query = this.$store.state.selectedQuery
            , params = query.queryEditor.params
            Object.keys(params).forEach ( key => {
                const value = params[key].value
                actualFormState[key] = value
            } )
            this.formState.data = this.formStateData (actualFormState)
            //this.formState.editorData = actualFormState
            //console.log(JSON.cc(actualFormState))
        },
        filter_old () {
            //console.log(this.keysSettings)
            this.onFilter(this.filterState())
            this.clean()
            //console.log(JSON.cc(this.filterState()))
        },
        clean () {
            //console.log(this.keysSettings)
            const item = this.formState.data
            , blankedItem = {}
            , blankedEditorItem = {}
            //log(item)
            Object.keys(item).forEach ( key => {
                blankedItem[key] = { value: "", text: "" }
                blankedEditorItem[key] = ""
            })
            const formState = JSON.cc ( this.formState )
            formState.data = blankedItem
            formState.editorData = blankedEditorItem
            this.formState = formState
        },
        addField(campo){
            this.onFilter(this.filterState())
            this.clean()
        },
        formChange(item) {
            //console.log(item)
            this.formState.data = item
            window.contextList.closeContext()
            //window.bus.$emit('contextListBlur')
        },
        loadFields () {
            //log(this.items)
            //console.log(fields)
            getFieldsForTable ( this.ventana.data.table, ( { fields, identities } ) => {
                //console.log(JSON.cc(fields))
                this.$store.commit ( 'Ventana_setFields', {indexVentana: this.ventana.index, fields, identities})
            } )
        }
    }
  }
</script>

<style scoped>
    input {
        font-size:11px;
        box-shadow: none;
        border-radius: 2px;
        background: white;
    }
</style>