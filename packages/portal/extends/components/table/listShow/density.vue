<template>
<span>
    <a-tooltip>
        <template #title>密度</template>
        
        <a-dropdown :trigger="['click']">
            <i class="icon aufontAll h-icon-all-filter-o"></i>
            <template #overlay>
            <a-menu @click="menuClick">
                <a-menu-item v-for="(item) in menuList" :key="item.size" :class="{'active': item.status}">
                    {{ item.name }}
                </a-menu-item>
            </a-menu>
            </template>
        </a-dropdown>
    </a-tooltip>
</span>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table,Tooltip,Dropdown,Menu } from "@h3/antd-vue";

interface menus {
    size: string,
    name: string,
    status: boolean
}

@Component({
    name: 'density',
    components: {
        ATable: Table,
        ATooltip: Tooltip,
        ADropdown: Dropdown,
        AMenu: Menu,
        AMenuItem: Menu.Item,
    },
})
export default class density extends Vue {



    menuList:Array<menus> = [
        {
            size: 'default',
            name: '默认',
            status: true,
        },
        {
            size: 'middle',
            name: '中等',
            status: false,
        },
        {
            size: 'small',
            name: '紧凑',
            status: false,
        },
    ];

    menuClick(e){
        let key = e && e.key || 'default';
        this.menuList.map((item:menus) => {
            if(item.size === key){
                item['status'] = true;
            }else{
                item['status'] = false;
            }
        })
        this.$emit('density',key);
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
.active {
    background-color: #e6f7ff;
    color: rgba(24,144,255,1);
}
</style>