<template>
 <div>
  <auditModal></auditModal>
 </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import auditModal from "@/../extends/components/form/auditModal.vue";
@Component({
  name: 'formIndex',
  components: {
    auditModal
  },
})
export default class formIndex extends Vue {
  
}
</script>
<style lang="less" scoped>

</style>