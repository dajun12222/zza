<template>
<a-modal
    :visible="value"
    :maskClosable="false"
    :footer="null"
    title="复核"
    width="98%"
    height="98%"
    wrapClassName="unsave-confirm"
    @cancel="close"
    @ok="close"
    >
    <div class="reviewModal">
        <div class="showReview">
            <showReview :reviewObj="reviewObj" />
        </div>
        <!-- <div class="quoteReview">
            <quoteReview :reviewObj="reviewObj" />
        </div> -->
    </div>
</a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin } from "@h3/antd-vue";
import showReview from './review/showReview.vue';
import quoteReview from './review/quoteReview.vue';

@Component({
    name: 'reviewModal',
    components: {
        AModal: Modal,
        showReview,
        quoteReview
    },
})
export default class reviewModal extends Vue {

    @Prop({ default: true }) value?:boolean;

    @Prop({ default: {} }) reviewObj?:any;

    close(){
        this.$emit('input',false);
    }

    ok(item:any){
        this.$emit('input',false);

    }

}
</script>
<style lang="less" scoped>
/deep/ .ant-modal {
    top: 10px;
}
/deep/ .ant-modal-header {
    padding: 12px 24px;
}
/deep/ .ant-modal-footer {
    padding: 2px 16px;
}
.reviewModal {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.showReview {

}
.quoteReview {
    flex: 1;
    overflow-y: auto;
    height: 100%;
}
</style>
