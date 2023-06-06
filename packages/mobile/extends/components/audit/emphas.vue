<template>
    <div class="elEmphas">
    <pad v-for="(item,index) in list" :key="index">
      {{ item }}
    </pad>
    
    
    </div>
        
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import pad from '@/../extends/components/static/pad.vue';
  
    @Component({
      name: 'emphas',
      components: {
        pad,
      },
    })
    export default class Emphas extends Vue {
      @Prop({}) list?:any;
    }
    </script>
    <style lang="less" scoped>
    .elEmphas {
      height: 100%;
      overflow-y: auto;
    }
    </style>
    