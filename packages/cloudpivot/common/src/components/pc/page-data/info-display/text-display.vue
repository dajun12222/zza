<template>
  <span class="text-display" :title="value">
    {{ value || '--' }}
  </span>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'text-display',
  components: {},
})
export default class TextDisplay extends Vue {
  @Prop()
  value!: any;
}
</script>

<style lang="less" scoped>
.text-display {
  font-size: 12px;
  font-weight: 400;
  color: #111218;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
