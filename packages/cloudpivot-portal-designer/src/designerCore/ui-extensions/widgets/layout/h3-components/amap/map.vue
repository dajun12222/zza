<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="map">
    <!--        <AInput-->
    <!--            ref="searchInput"-->
    <!--            id="searchBox"-->
    <!--            allow-clear-->
    <!--            class="user-input"-->
    <!--            :placeholder="$t('widgets.formTip.input')"></AInput>-->
    <div class="search-wrapper">
      <p class="search-header">
        <h3-search-bar
          ref="searchInput"
          :value="searchKey"
          class="input"
          :maxlength="maxlength"
          autocomplete="off"
          @input="inputChangeValue"
          @focus="onFocus"
          @blur="onBlur"
        />
      </p>
      <div class="search-result">
        <div
          v-if="showCount"
          class="search-count"
        >
          <span>搜索结果：</span>
          <span>共 {{ count }} 条</span>
        </div>
        <div
          v-if="showEmpty"
          class="search-empty"
        >
          <div class="search-empty-center">
            <span class="box-center"></span>
            <p class="box-text">
              未找到“{{ searchKey }}”相关结果
            </p>
            <!--                        <p class="box-text">超出搜索范围</p>-->
          </div>
        </div>
      </div>
      <div
        id="outputInner"
        v-if="showList"
        ref="outputInner"
      >
        <ul>
          <li
            v-for="(item, index) in itemList"
            :key="index"
            @click="setCurrentAdd(item)"
          >
            <span>{{ item.name }}</span>
            <p>{{ item.address }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div
      :id="vid"
      class="map-content"
    ></div>
    <img
      src="./map-center.png"
      class="center"
      alt=""
      width=""
      height=""
      @click="centerPosition"
    />
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'; // Component Prop Watch Emit Model Provide Inject Mixins
import amap from './amap';
import { Input } from '@h3/antd-vue';
import { H3SearchBar } from '@lateinos/thinking-ui';
@Component({
  name: 'amap',
  components: {
    AInput: Input,
    H3SearchBar,
  },
})
export default class AppForm extends Vue {
  @Prop({ default: '' }) // 9335b7f07371245841b8c25cadd3a9e8
  mapKey!: string;

  @Prop({ default: false })
  defaultAddress!: any;

  @Prop({ default: 14 })
  zoom!: number;

  @Prop({
    default: '',
  })
  hasSelectAdd!: any;

  @Prop({
    default: false,
  })
  allowPosition!: boolean;

  AMap: any;

  aMap: any = {};

  Geocoder: any = {};

  Geolocation: any = {};

  center: any = [];

  isSet: any = false;

  Autocomplete: any;

  vid: string = new Date().getTime().toString();

  address: any = false;

  setAddress: any;

  /**
   * @desc 设置地图标记
   */
  tempMarkers: any = false;

  userZoom: number = this.zoom;

  showEmpty: boolean = false;

  showCount: boolean = false;

  showList: boolean = false;

  maxlength: number = 32;

  searchKey: string = '';

  count: number = 0;

  itemList: any = [];

  // 失去焦点
  onBlur () {
    console.log('onBlur');
  }

  // 获取焦点
  onFocus () {
    if (!this.searchKey) {
      this.showCount = true;
    } else {
      this.searchPlaceList(this.searchKey);
    }
  }

  // 输入框值改变
  inputChangeValue (val: string) {
    this.searchKey = val;
    this.searchPlaceList(val);
  }

  // 重置搜索状态
  resetSearch () {
    const input: any = (this.$refs.searchInput as any).$refs.input;
    input.value = '';
    this.searchKey = '';
    this.showEmpty = false; // 显示为空搜索的搜索
    this.showList = false; // 搜索列表
    this.count = 0; // 搜索数量
    this.showCount = false; // 显示搜索数量
  }

  // 点击搜索列表
  setCurrentAdd (item: any) {
    this.resetSearch();
    this.setAddress({ lnglat: item.location });
  }

  // 搜索服务
  searchPlaceList (val: any) {
    // const that = this;
    this.Autocomplete.search(val, (status: string, result: any) => {
      // 搜索成功时，result即是对应的匹配数据
      if (status === 'complete') {
        this.count = result.count;
        this.showCount = true;
        this.showEmpty = false;
        this.showList = true;
        this.itemList = result.tips;
      } else if (status === 'no_data') {
        this.count = 0;
        this.showCount = false;
        this.showEmpty = true;
        this.itemList = [];
      } else {
        this.itemList = [];
        this.showCount = false;
        this.count = 0;
        this.showEmpty = false;
      }
    });
  }

  loadGeolocation () {
    if (this.defaultAddress) {
      return;
    }
    // 加载定位插件
    this.aMap.plugin('AMap.Geolocation', () => {
      this.Geolocation = new this.AMap.Geolocation({
        timeout: 1000, // 超过10秒后停止定位，默认：无穷大
        showButton: false, // 显示定位按钮，默认：true
      });
      this.Geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'error') {
          console.info('需要https才能移动端精准定位');
          this.getCityAddress(this.AMap);
        }

        if (status === 'complete') {
          this.emitData({
            position: result.position,
            addressComponent: result.addressComponent,
            formattedAddress: result.formattedAddress,
          });
        }
      });
    });
  }

  loadGeocoder () {
    this.aMap.plugin('AMap.Geocoder', () => {
      this.Geocoder = new this.AMap.Geocoder();
      this.setAddress = (ev: any) => {
        this.Geocoder.getAddress(ev.lnglat, (status: string, result: any) => {
          if (status === 'complete' && result.regeocode) {
            this.emitData({
              position: ev.lnglat,
              addressComponent: result.regeocode.addressComponent,
              formattedAddress:
                ev.formattedAddress || result.regeocode.formattedAddress,
            });
          }
        });
      };
      this.defAddressChange();
      // 如果已选地址
      if (this.hasSelectAdd && this.hasSelectAdd.lng && this.hasSelectAdd.lat) {
        const lnglat: any = new this.AMap.LngLat(
          this.hasSelectAdd.lng,
          this.hasSelectAdd.lat,
        );
        this.setAddress({ lnglat: lnglat });
      }
      this.aMap.on('click', this.setAddress);
    });
  }

  /**
   * @desc 初始化地图
   * @return 地图实例
   */
  initMap () {
    if (this.isSet) {
      return false;
    }
    this.isSet = true;
    amap(this.mapKey, '1.4.14', AMap => {
      this.AMap = AMap;
      this.aMap = new AMap.Map(this.vid, {
        resizeEnable: true,
        zoom: this.userZoom,
        lang: this.$i18n.locale === 'en' ? 'en' : ', zh_cn',
      });

      this.loadGeolocation();
      this.aMap.on('zoomchange', () => {
        this.userZoom = this.aMap.getZoom();
      });
      // 加载经纬度解析成地址插件
      this.loadGeocoder();
      // 加载搜索插件
      this.aMap.plugin('AMap.Autocomplete', () => {
        this.Autocomplete = new AMap.Autocomplete({
          // input: (this.$refs.searchInput as any).$el,
          // input: 'searchBox',
          // output: 'outputInner',
          input: '',
          output: '',
        });
        this.Autocomplete.on('select', (s: any) => {
          this.setAddress({ lnglat: s.poi.location });
        });
        this.changeSearchAddres();
      });
    });
  }

  getAverage (num1: number, num2: number) {
    return (num1 + num2) / 2;
  }

  getCityAddress (AMap: any) {
    this.aMap.plugin('AMap.CitySearch', () => {
      const city = new AMap.CitySearch();
      city.getLocalCity((status1: string, res: any) => {
        if (status1 === 'error') {
          console.info('获取位置失败');
        }
        if (status1 === 'complete') {
          const pos: any = res.bounds;
          this.emitData({
            position: {
              Q: this.getAverage(pos.wc.Q, pos.oc.Q),
              R: this.getAverage(pos.wc.R, pos.oc.R),
              lat: this.getAverage(pos.wc.lat, pos.oc.lat),
              lng: this.getAverage(pos.wc.lng, pos.oc.lng),
            },
            addressComponent: res,
            formattedAddress: `${res.province}${res.city}`,
          });
        }
      });
    });
  }

  setMapMarkers (AMap: any, address: any) {
    if (this.tempMarkers) {
      this.tempMarkers.setMap(false);
    }
    const m = new AMap.Marker({
      map: this.aMap,
      position: address.position,
    });
    this.tempMarkers = m;
    // 设置文本标签
    m.setLabel({
      content: `<div class='info-label'>${address.formattedAddress}</div>`, // 设置文本标注内容
      direction: 'center', // 设置文本标注方位
    });
  }

  /**
   * @desc 把标记移到所选位置，并把中心点移动标记位置，并通知外部地址数据已改变
   */
  emitData (address: any) {
    this.address = address;
    this.center = address.position;
    this.setMap();
    this.setMapMarkers(this.AMap, this.address);
    this.$emit('change', this.address);
    this.changeSearchAddres();
  }

  // 根据选择的城市限制搜索范围
  changeSearchAddres () {
    if (this.Autocomplete && this.address) {
      this.Autocomplete.setCity(this.address.addressComponent.citycode);
    }
  }

  // 设置地图的中心点及缩放
  setMap (ks = false) {
    if (ks) {
      this.userZoom = this.zoom;
    }
    this.aMap.setZoomAndCenter(this.userZoom, this.center);
  }

  centerPosition () {
    if (this.allowPosition) {
      this.setCurrentPosition();
    } else {
      this.setMap(true);
    }
  }

  setCurrentPosition () {
    this.Geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'error') {
        console.info('需要https才能移动端精准定位');
        this.getCityAddress(this.AMap);
      }

      if (status === 'complete') {
        this.emitData({
          position: result.position,
          addressComponent: result.addressComponent,
          formattedAddress: result.formattedAddress,
        });
      }
    });
  }

  mounted () {
    this.initMap();
  }

  @Watch('$i18n.locale')
  setLan () {
    if (this.$i18n.locale === 'en') {
      this.aMap.setLang(this.$i18n.locale);
    } else {
      this.aMap.setLang('zh_cn');
    }
  }

  @Watch('defaultAddress')
  defAddressChange () {
    if (this.defaultAddress && this.defaultAddress.lnglat) {
      const l = this.defaultAddress.lnglat;
      this.defaultAddress.lnglat = new this.AMap.LngLat(l.lng, l.lat);
      this.setAddress(this.defaultAddress);
    }
  }

  @Watch('zoom')
  zoomChange () {
    this.setMap(true);
  }
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
.map > .map-content {
  width: 100%;
  height: 100%;
}

.map .info-label {
  font-size: 12px;
  line-height: 16px;
  /* max-width: 12em;
    overflow: hidden;
    text-overflow: ellipsis; */
  white-space: nowrap;
  border: none;
  color: #fff;
}
.map .amap-marker-label {
  padding: 3px 6px;
  margin-top: 30px;
  border-radius: 5px;
  border: none;

  background-color: rgba(0, 0, 0, 0.5);
}
.map .center {
  position: absolute;
  right: 11px;
  bottom: 10px;
  width: 50px;
  z-index: 9;
}
.search-header {
  margin: 0;
  width: 100%;
  background: #fff;
  padding: 8px 0;
  display: flex;
  /deep/.h3think-search-bar__form {
    background-color: #f2f4f8;
    border-radius: 28px;
  }
}
.search-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 200;
}
#outputInner {
  background: #fff;
  max-height: 320px;
  overflow-y: scroll;
  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 4px;
      margin: 0;
      list-style: none;
      border-bottom: 1px solid #eeeeee;
      span {
        color: #333;
      }
      p {
        margin: 0;
        color: #999999;
      }
    }
  }
}
.search-input {
  border: 1px solid #f4f4f8;
  background: #f4f4f8;
  border-radius: 28px;
  line-height: 30px;
  width: 100%;
  padding: 0 15px 0 24px;
  font-size: 14px;
  color: #333333;
}
.search-count {
  border-top: 1px solid #e4e4e4;
  background: #f7f8fc;
  width: 100%;
  line-height: 32px;
  padding: 0 4px;
  color: #999999;
  font-size: 14px;
}
.search-empty {
  height: 300px;
  width: 100%;
  background: #f7f8fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.search-empty-center {
  .box-text {
    color: #999999;
    font-size: 14px;
    line-height: 32px;
    margin: 0;
  }
}
.box-center {
  width: 100px;
  height: 100px;
  display: inline-block;
  background: #d8d8d8;
}
.user-input {
  position: absolute;
  width: 50%;
  left: 10px;
  top: 10px;
  z-index: 1;
}
</style>
