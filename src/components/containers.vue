<script>
//import $ from 'jquery'
import Ly from './layout.vue'
import Ventana from './ventana.vue'
import Toolbar from './tool-bar.vue'
export default {
    data: function() {
        return {
        }
    },
  components: { Ly, Ventana, Toolbar },
  props: ['containers','panels'],
  data: function () {
      return {
          selectedIndex: 0
      }
  },
  computed: {
    ventanas () {
        return this.$store.state.ventanas.data
    },
    containerWidth() {
        const noContainers = this.containers.length
        return {width: `calc(100% / ${noContainers})`}
    }
  },
  methods: {
      visibleVentanas(container) {
          const visWinIndexes = this.$store.state.ventanas.data.map ( (ventana,index) => ({index,visible:ventana.visible}) ).filter( ventana => ventana.visible ).map ( ven => ven.index )
        return visWinIndexes //? visWinIndexes : []
      },
      ventanasDelContainer (container) {
        const ventanasWithIndex = this.ventanas.map ( ( ventana, index ) => ( { data:ventana , index } ) )
        if ( ! container ) return ventanasWithIndex
        const containerIndex = container.index
        , ventanasDelContainer = ventanasWithIndex.filter ( ventana => ventana.data.container.indexOf(containerIndex)!=-1 )
        return ventanasDelContainer
      },
      styleVentana (container, visible) {
          if ( this.containerType(container) != 'visible') return false
          const noVentanasVisibles = this.ventanasDelContainer ( container ).filter ( ventana => this.visibleVentanas ( container ).indexOf(ventana.index)!=-1 ).length
          //, style = { height: `calc(100% / ${noVentanasVisibles})` }
          , style = { height: `calc(100% / ${noVentanasVisibles})`, top:'0px', left:0, width:'100%', position:'absolute', border:'0px solid green' }
          //console.log(visible)
          return style
    },
    onButtonClick(indexVentana){
        /*
        this.hiddenVentanas = this.ventanasDelContainer().map ( ventana => {
            return ventana.index
        })
        */
        /*
        this.visibleVentanas = []
        const visibleVentanas = cleanCopy ( this.visibleVentanas )
        this.visibleVentanas = new matriz ( visibleVentanas ).switch ( indexVentana )
        */
        //this.$store.commit ( 'Ventana_setVisibility' , {indexVentana,visible:true} )
        this.selectedIndex = indexVentana
        const containers = $('.window-container')
        , pestanas = $('.pestanaVentana')
        containers.css({'z-index':-1})
        containers.eq(indexVentana).css({'z-index':1})
        pestanas.removeClass('pestanaVentanaSelected').eq(indexVentana).addClass('pestanaVentanaSelected')
        //containers.hide()

    },
    switchContainerType(container){
        const containerType = this.containerType ( container )
        , newType = containerType == 'visible' ? 'scroll' : 'visible'
        //console.log(newType)
        this.$store.commit ( 'setContainerType' , {index:container.index,type:newType} )
    },
    containerName ( container ) {
        return container.data.name
    },
    containerType ( container ) {
        return container.data.type
    },
    isInlineContainer ( container ) {
        return this.containerType(container)=='scroll'?1:0
    },
    toolbarButtons (container) {
        const ventanasDelContainer = this.ventanasDelContainer ( container )
        //console.log(ventanasDelContainer)
        const buttons = ventanasDelContainer.map ( ventana => ({
            label: ventana.data.name,
            onClick: () => this.onButtonClick(ventana.index,container)
            , onClose: function () {
                if ( ventanasDelContainer.length == 1 ) return
                if(confirm('Eliminar pestaña?')) {
                 const selectedIndex = this.selectedIndex
                 let newIndexVentana
                if ( selectedIndex == 0 ) 
                    newIndexVentana = 0 
                else if ( selectedIndex == this.ventanas.length - 1 ) 
                    newIndexVentana = this.ventanas.length - 2
                else
                    newIndexVentana = selectedIndex - 1 

                this.$store.commit ( 'Ventana_delete', {index: ventana.index} )
                 this.onButtonClick ( newIndexVentana  )
                }
            }.bind(this)
        }))
        buttons.push ({
                  label: "+",
                  onClick: function () {
                    const lastVentana = ventanasDelContainer[ventanasDelContainer.length-1]
                      this.$store.commit ( 'Ventana_clone', {index: lastVentana.index} )
                      this.onButtonClick ( this.ventanas.length - 1 )
                  }.bind(this)
                  ,onClose: function(){}
               })
              /*
        ventanasDelContainer.forEach ( ventana => {

            buttons.push ({
                  label: "Delete "+ ventana.data.name,
                  onClick: function () {
                      this.$store.commit ( 'Ventana_delete', {index: ventana.index} )
                  }.bind(this)
              })
        })
        */
       /*
        buttons.push ( {
            label: "Container Type",
            onClick: () => this.switchContainerType(container)
        })
        */
        return buttons
    },
    saveWindowName(target,indexVentana){
        this.$store.commit ( 'Ventana_setName' , {indexVentana,ventanaName:$(target).text()} )
        $(target).attr('contenteditable',false)
    },
    editWindowName(target){
        $(target).attr('contenteditable',true).focus()
    },
    panelSwitch(panel){
        //console.log(this.panels[panel])
        this.$emit('panelSwitch',panel)
    }
  }
  , mounted() {
      this.onButtonClick(0)
  }
}
</script>
<template>
	<Ly data-component="Containers" height=1 flexbox=1>
        <!--
        <Ly grow=1 height=1>
            <Ly flexbox=1 data-component="Containers" height=1>
                -->
		        <Ly grow=1 height=1 v-for="container in containers" :data-overflow="containerType(container)" :style="containerWidth">
                    <Ly flexbox=1 column=1 height=1>
                        <!--<Ly style="background:lightgray; padding-left:2px">{{containerName(container)}}</Ly>-->
                        <Ly flexbox=1 style="background:;padding:0 0 0px 0px;border-bottom:1px solid #999">
                            <div v-for="(boton,index) in toolbarButtons(container)" @click="boton.onClick" :class="{pestanaVentana:true,pestanaVentanaSelected:(visibleVentanas ( container ).indexOf(index)!=-1)}">
                                <div style="" class="botonLabel" contenteditable="false" @dblclick="editWindowName($event.target,index)" @blur="saveWindowName($event.target,index)">{{boton.label}}</div>
                                <div class="close closeButton" style="cursor:default"  @click.stop="boton.onClose" v-if="boton.label!='+'"/>
                            </div>
                            <!--<Toolbar :buttons="toolbarButtons(container)"/>-->
                        </Ly>
                        <Ly grow=1 height=1 :overflow="containerType(container)" style="position:relative">
                            <Ventana 
                                v-for="ventana in (ventanasDelContainer(container))"
                                :key="ventana.index"
                                v-if="visibleVentanas ( container ).indexOf(ventana.index)!=-2" 
                                :visible="visibleVentanas ( container ).indexOf(ventana.index)!=-2" 
                                :ventana="ventana" 
                                :isInline="isInlineContainer(container)" 
                                :style="styleVentana(container,visibleVentanas ( container ).indexOf(ventana.index)!=-1)"
                                :index="ventana.index"
                                class="window-container"
                                :switchVentana = "onButtonClick"
                                :panels = "panels"
                                @panelSwitch = "panelSwitch"
                            />
                        </Ly>
                    </Ly>
                </Ly>
            <!--
            </Ly>
        </Ly>
    -->
	</Ly>
</template>
<style>
    .pestanaVentana{
        border-radius: 5px 5px 0 0;
        border:1px solid #999;
        border-width: 1px 1px 0 1px;
        float:left;
        padding:5px 10px;
        cursor:default;
        background:#eee;
        max-width: 300px;
        flex-grow: 1;
        box-shadow: 0 -10px 9px #ddd inset;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .botonLabel {
        width: calc(100% - 20px);float:left;overflow:hidden;
    }
    .pestanaVentana:last-child{
        width: 20px;
        padding-left: 5px;
        flex-grow: 0;
    }
    .pestanaVentana:last-child div{
        overflow: visible;
    }
    .pestanaVentana.pestanaVentanaSelected,.pestanaVentana:hover.pestanaVentanaSelected {
        background-color:#e4e4e4;
        margin: -1px 0 -1px 0;
        box-shadow: none;
    }
    .pestanaVentana:hover {
        background:#fafafa;
    }
    .closeButton {
        margin-left: 4px;
        margin-top: 1px;
    }
</style>