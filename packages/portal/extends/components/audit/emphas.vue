<template>
    <div class="elEmphas">
    <template v-if="list.length">
       <pad v-for="(item,index) in list" :key="index">
        {{ item }}
      </pad>
    </template>
   
    <div v-else class="empty-box">
      <img class="user-empty" src="../../style/image/userEmpty.png" />
      <div>暂无内容</div>
    </div>
    
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
      .empty-box{
        text-align: center;
        color: rgba(17, 18, 24, 0.5);
      }
      .user-empty{
        width: 157px;
        height: 157px;
        margin-bottom: 10px;
      }
    }
    </style>
    