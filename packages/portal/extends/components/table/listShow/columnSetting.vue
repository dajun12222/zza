<template>
<span>
<a-popover placement="bottomRight" trigger="click">
    <a-tooltip>
        <template #title>列设置</template>
        <i class="icon aufontAll h-icon-all-setting-o"></i>
    </a-tooltip>
    <template #title>
        <div class="aTooltipShow">
            <a-checkbox v-model="allChecked" @click="allCheckedBox">列展示</a-checkbox>
            <a @click="reset">重置</a>
        </div>
    </template>
    <template #content>
        <div class="aMenuContent">
            <a-menu
            size="small"
            >
                <a-menu-item-group v-for="(item,index) in columnData" v-show="item && item.content && item.content.length > 0" :key="index">
                    <template #title>{{ item.title }}</template>
                    <a-menu-item v-for="(c,z) in item.content" :key="z">
                        <a-checkbox v-model="c.checked" @click="checkedBox(index,z)">{{ c.title }}</a-checkbox>
                        <template class="test111">
                            <a-tooltip v-show="index !== 2">
                                <template #title>固定在列尾</template>
                                <i class="icon aufontAll h-icon-all-arrow-down-o" @click="flexRight(index,z,c)"></i>
                            </a-tooltip>
                            <a-tooltip v-show="index !== 1">
                                <template #title>不固定</template>
                                <i class="icon aufontAll h-icon-all-highly-adaptive-o" @click="flexCenter(index,z,c)"></i>
                            </a-tooltip>
                            <a-tooltip v-show="index !== 0">
                                <template #title>固定在列首</template>
                                <i class="icon aufontAll h-icon-all-arrow-up-o" @click="flexLeft(index,z,c)"></i>
                            </a-tooltip>
                        </template>
                    </a-menu-item>
                </a-menu-item-group>
            </a-menu>
        </div>
    </template>
</a-popover>
</span>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table,Tooltip,Dropdown,Menu,Popover,Checkbox } from "@h3/antd-vue";



@Component({
    name: 'density',
    components: {
        ATable: Table,
        ATooltip: Tooltip,
        ADropdown: Dropdown,
        AMenu: Menu,
        AMenuItem: Menu.Item,
        AMenuItemGroup: Menu.ItemGroup,
        APopover: Popover,
        ACheckbox: Checkbox,
        ACol: Col
    },
})
export default class density extends Vue {

    @Prop({}) columns?:any;

    columnData:any = [];

    @Watch('columns',{ deep: true, immediate: true })
    onChangeColumns(newVal:any){
        if(newVal && newVal.length > 0){
            this.columnSetUp(newVal);
        }else{
            this.columnData = [];
        }
    }

    columnSetUp(data:any){
        let arr:any = [
            {
                'title': '固定在左侧',
                'content': [],
            },
            {
                'title': '不固定',
                'content': [],
            },
            {
                'title': '固定在右侧',
                'content': [],
            }
        ];
        data.map((item:any,index:number) =>{
            item['checked'] = true;
            item['sort'] = index + 1;
            if(item && item['fixed'] && item['fixed'] === 'left'){
                arr[0]['content'].push(item);
            }else
            if(item && item['fixed'] && item['fixed'] === 'right'){
                arr[2]['content'].push(item);
            }else
            if(item && item['fixed'] && item['fixed']){
                arr[0]['content'].push(item);
            }else{
                arr[1]['content'].push(item);
            }
        })
        this.columnData = arr;
    }

    checkedBox(i:number,z:number){
        let columnData:any = JSON.parse(JSON.stringify(this.columnData));
        let obj:any = columnData[i]['content'][z];
        obj['checked'] = !obj['checked'];
        columnData[i]['content'][z] = obj;
        this.columnData = columnData;
        this.columnSetting();
    }

    columnSetting(){
        let columnData:any = JSON.parse(JSON.stringify(this.columnData));
        let dataColumns:any = [];
        this.columnData.map((item:any) => {
            item && item.content.map((c:any) => {
                if(c && c['checked']){
                    dataColumns.push(c);
                }
            })
        })
        this.$emit('columnSetting',dataColumns);
    }

    allChecked:boolean = true;

    allCheckedBox(){
        this.allChecked = !this.allChecked;
        this.columnData.map((item:any) => {
            item && item.content.map((c:any) => {
                c['checked'] = this.allChecked;
            })
        })
        this.columnSetting();
    }

    reset(){
        this.allChecked = true;
        this.columnSetUp(this.columns);
        this.columnSetting();
    }

    flexLeft(i:number,z:number,item:any){
        item['flex'] = 'left';
        this.flexSetUp(i,z,item,0);
    }

    flexCenter(i:number,z:number,item:any){
        item['flex'] = '';
        this.flexSetUp(i,z,item,1);
    }

    flexRight(i:number,z:number,item:any){
        item['flex'] = 'right';
        this.flexSetUp(i,z,item,2);
    }

    flexSetUp(i:number,z:number,item:any,n:number){
        let columnData:any = JSON.parse(JSON.stringify(this.columnData));
        columnData[i]['content'].splice(z,1);
        columnData[n]['content'].push(item);
        columnData[n]['content'] = this.sortFn(columnData[n]['content']);
        this.columnData = columnData;
        this.columnSetting();
    }

    sortFn(data:any){
        return data.sort((a,b) => {
            return a.sort - b.sort;
        })
    }

}
</script>
<style lang="less" scoped>
span {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.aTooltipShow {
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
    padding-bottom: 5px;
}
.aMenuContent {
    max-height: 400px;
    overflow-y: auto;
    /deep/ .ant-menu-item-group-title {
        padding: 0;
    }
    /deep/ .ant-menu-item {
        height: 24px;
        line-height: 24px;
        i {
            margin: 0 4px;
            float: right;
        }
    }
}


</style>