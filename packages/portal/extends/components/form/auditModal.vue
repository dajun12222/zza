<template>
    <div>
<!-- <a-modal
    :visible="value"
    :closable="false"
    :maskClosable="false"
    title="留痕数据项"
    width="90%"
    height="85%"
    wrapClassName="unsave-confirm"
    @cancel="close"
    @ok="close"
    >  -->
    <!-- <div class="auditModal" :class="{ 'auditModal1': mode !== 'showData','activeAuditModal': isMediation }"> -->
      <!-- 中介单位新增问题铺满页面，上一行备注为修改之前代码 -->
    <div class="auditModal" :class="{ 'auditModal1': getContailLayout,'activeAuditModal': isMediation }">
        <div class="importData">
            <showData ref="showDataFn" :isMediation="isMediation" @review="review" />
        </div>
        <div v-if="!isMediation && mode !== 'review' && mode !== 'showhtml' && mode !== 'del'" class="screenData">
            <quoteData @quote="quoteChange" />
        </div>
        <!-- <reviewModal v-model="reviewStatus" :reviewObj="reviewObj" /> -->
    </div>
    <!-- <div v-if="!isMediation && mode !== 'review' && mode !== 'showhtml'" class="screenData">
        <quoteData @quote="quoteChange" />
    </div> -->
    <reviewModal v-model="reviewStatus" :reviewObj="reviewObj" />
</div>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin } from "@h3/antd-vue";
import showData from './showData.vue';
import quoteData from './quoteData.vue';
import reviewModal from './reviewModal.vue';
import api  from '@/../extends/api';
import OAuthApi from "@/apis/oauth";
const qs = require('qs');
@Component({
    name: 'auditModal',
    components: {
        AModal: Modal,
        showData,
        quoteData,
        reviewModal,
    },
})
export default class auditModal extends Vue {

    isMediation:boolean = false;

    reviewStatus:boolean = false;

    reviewObj:any = {};

    @Prop({ default: true }) value?:boolean;

    close(){
        this.$emit('input',false);
    }

    quoteChange(item:any){
       let showDataFn = this.$refs.showDataFn as any;
       if(showDataFn){
        showDataFn.assignment(item);
        // console.log(item)
        // debugger
       }

    }

    async review(item:any){
        this.reviewObj = item;
        let option = qs.stringify({ questionQualitative: item.qualitativeProblem,qualitativeBasis: item.qualitativeBasis });
        const res: any = await api.similar(option);        
        // const res: any = await api.similar({qualitativeProblem: item.qualitativeProblem,qualitativeBasis: item.qualitativeBasis});        
        if (res.data) {
        this.reviewObj = res.data;        
        } else {
        this.reviewObj = {};
        }
        this.reviewStatus = true;
    }

    bizObjectId:string = '6a07d7c360f64d6d8b5ae784c7efee8a';

    mode:string = 'edit';

    schemaCode:string = '';

    get getContailLayout(){
        let status = true;
        if(this.mode !== 'showData'){
            status = false;
        }
        if(!this.isMediation && this.mode !== 'review' && this.mode !== 'showhtml' && this.mode !== 'del'){
            status = false;
        }
        return status;
    }

    async created(){
        // console.log('created.....');
        let route = this.$route as any;
        this.bizObjectId = route.query.bizObjectId || '6a07d7c360f64d6d8b5ae784c7efee8a';
        this.mode = route.query.mode;
        this.schemaCode = route.query.schemaCode;
        const res = await OAuthApi.getUserInfo();
        if (res.errcode === 0) {
            let info:any = res.data;
            let maps = {
                userId: info['id'] || ''
            };
            let queryPage = qs.stringify(maps);
            const respone:any = await api.getPersonPermission(queryPage);
            if(respone.errcode === 0){
                this.isMediation = respone.data;
            }
            if(!this.isMediation){
                if(this.mode === 'view'){
                    this.isMediation = true;
                }else{
                    let maps1 = {
                        userId: info['id'] || '',
                        formId: this.bizObjectId,
                        schemaCode: this.schemaCode
                    };
                    let queryPage1 = qs.stringify(maps1);
                    const respone1:any = api.getWorkItemCheckUserId(queryPage1);
                    if(respone1.errcode === 0){
                        this.isMediation = true;
                    }
                }
            }
            // console.log(this.isMediation)
            // debugger
        }
    }

}
</script>
<style lang="less" scoped>
.auditModal {
    display: grid !important;
    height: 100%;
}
.auditModal1 {
    grid-template-rows: 50% 50%;

}
.activeAuditModal {
    grid-template-rows: 100%;
}
/deep/ .ant-table {
    font-size: 14px;
}
/deep/ .ant-input {
    font-size: 14px;

}
/deep/ .elColLabel {
    font-size: 14px;
    height: 24px;
}
/deep/ .ant-pagination {
    font-size: 14px;
}
/deep/ .ant-select {
    font-size: 14px;
}
/deep/ .ant-btn {
    font-size: 14px;
}
/deep/ .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th {
    padding: 5px;
    background: #fafafa;
}
/deep/ .ant-btn-primary:focus {
    background-color: #6f76fa;
    border-color: #6f76fa;
}
// /deep/ .primary:hover {
//     background-color: #99a1ff;
//     border-color: #99a1ff;
// }
/deep/ .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td {
    padding: 5px;
}
/deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
    padding: 2px 2px;
}
// /deep/ .elColPadding input {
//     height: 24px;
// }
// /deep/ .ant-select-selection--multiple {
//     height: 24px;
//     min-height: auto;
// }
// /deep/ .ant-select-selection__rendered {
//     position: absolute;
//     height: 100%;
//     top: -3px;
//     overflow: hidden;
// }
// /deep/ .ant-select-selection__choice {
//     position: absolute;
//     top: 0;

// }
/deep/ .ant-modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    .ant-modal-body {
        flex: 1;
        overflow-y: auto;
        // display: grid;
        // grid-template-columns: 50% 50%;
        // grid-template-rows:  100%;
        padding: 0;
        .importData {
            border-right: 1px solid #e8e8e8;
            padding: 12px 24px;
            height: 100%;
        }
        .screenData {
            padding: 12px 24px;
            height: 100%;
        }
        .dataContent {
            height: 100%;
        }
    }
    .ant-modal-footer {

    }
}
</style>
