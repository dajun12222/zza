<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<style lang="less">
@import '~cloudpivot/common/styles/mixins.less';
#custom-list-container {
  .px2rem(font-size, 28px);
  text-align: left;
}
// 错误信息
#custom-list-parsing-error {
  color: red;
  .px2rem(font-size, 22px);
}
.custom-list-wrapper {
  overflow-x: hidden;
}
.fields-list-wrapper {
  .px2rem(margin-top, @horizontal-padding-md / 2);
  .px2rem(margin-bottom, @horizontal-padding-md / 2);
}
.custom-list-item-container {
  display: flex;
  width: calc(100% + 1.546666666666667rem);
  transition: 0.3s;
}
.custom-list-item {
  flex: 1;
  display: flex;
  align-items: center;
  .px2rem(margin, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  background: @white-background;
  word-break: break-all;
  box-shadow: 0px 0px 10px #d6e8f8;
  &-warp {
    flex: 1;
    .px2rem(margin-left, 30px);
  }
  // layout  -- start
  &-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // .px2rem(min-height, 96px);
    min-height:1rem;
  }
  &-status {
    position: relative;
    margin-left: 0.2rem;
    width: 1.6rem;
  }
  &-info {
    flex: 1;
  }
  &-creater {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    color: #999;
    .px2rem(font-size, 24px);
    position: relative;
    &-info-avatar {
      @user-img: 56px;
      .px2rem(width, @user-img);
      .px2rem(height, @user-img);
      border-radius: 50%;
      object-fit: cover;
    }
  }
  // layout -- end

  // 图片
  img {
    max-width: 100%;
  }
  // 标题
  &-title {
    .px2rem(font-size, 32px);
    color: rgba(0, 0, 0, 0.85);
  }
}
.custom-list-item-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.546666666666667rem;
  .px2rem(margin-top, @horizontal-padding-md);
  .px2rem(margin-bottom, @horizontal-padding-md);
  .px2rem(border-radius, @border-radius-lg);
  .px2rem(font-size, 28px);
  font-family: PingFangSC-Regular, PingFang SC;
  background: #f4454e;
  color: #ffffff;
}
.onlineTemplate .custom-list-item-warp,.onlineExamTemplate .custom-list-item-warp{
    margin-left: 0;
  }
.onlineTemplate .custom-list-item-content{
  height: 2.65rem;
  .custom-list-item-info{
    display: flex;
    justify-content: space-between;
    .custom-list-item-info-warp{
      width: calc(100% - 44%);
      .custom-list-item-title{
        height: 1rem;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 超出几行省略 */
        overflow: hidden;
      }
      .custom-list-item-creator{
        display: flex;
        justify-content:left;
        color: #999;
        margin-bottom: .1rem;
        span{
          display: inline-block;
        }
        span:nth-child(1){
          max-width: 57%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span:nth-child(2){
          max-width: calc(100% - 39%);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .custom-list-item-progress{
        color: #999;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bar{
          width: 40%;
          background: #e2e2e2;
          height: 10px;
          margin-top: .06rem;
          .barP{
            height: 100%;
            background: #85b585;
          }
        }
      }
    }
  }
  img{
    width: 40%;
    height: 100%;
    object-fit:cover;
  }
}
.onlineExamTemplate .custom-list-item-content{
  .custom-list-item-title{
    height: 1rem;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 超出几行省略 */
    overflow: hidden;
  }
}
.onlineExamTemplate .custom-list-item-creater{
    font-size: .4rem;
    .customCon{
      // width: 69.9%;
    }
    .customBtn{
      width: 30%;
      margin-left: .1rem;
      position: absolute;
      top: 0;
      right: 0;
      > div {
        background: aliceblue;
        border-radius: 3px;
        text-align: center;
        padding: 5px 0;
      }
    }
    .custom-list-item-creater-time{
      margin-bottom: 0;
    }
    .custom-list-item-creater-info{
      margin-bottom: .2rem;
    }
}
.onlineExamTemplate .goExam{
  font-size: .4rem;
  color: #5291ff;
}
.mb5{
    margin-bottom: .2rem;
  }
</style>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { listApi } from 'cloudpivot/api';
// 函数
import common from 'cloudpivot/common';
import comm from 'cloudpivot/common/mobile';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { renderer } from 'cloudpivot-form/form';
import { DataItemType } from 'cloudpivot-form/form/schema';
// 默认模板
import listCustomTemplateConverter from 'cloudpivot-list/list/src/components/listCustom/template/mobile/handler';

// 引入vue编译器
const vueCompiler = require('cloudpivot-list/list/src/components/mobile/application-list/vueCompiler.build');

const { getRealValue } = common.utils.BusinessFunctions;
// 默认头像
const defaultAvatar = require('./avatar.png');

@Component
export default class listCustomTemplate extends Vue {
  @Prop() vm: any;

  @Prop() columns: any;

  @Prop() originalListData: any;

  @Prop() templateString: any;

  @Prop() batchFlag?: boolean;

  @Prop() selectAll?: boolean;

  @Prop() canDelete?: boolean;

  DataItemType: any = DataItemType;

  imgToken: any = "";

  localHref:any = "";

  // 如果模板字符串改变, compiled 相关也重置
  templateRender: Function | null = null;

  templateStaticRenderFns: Function | null = null;

  @Watch('templateString')
  onTemplateStringChange() {
    this.templateRender = null;
    this.templateStaticRenderFns = null;
  }

  // 渲染
  render(h) {
    const that = this;
    const { vm, columns, originalListData, batchFlag, selectAll, canDelete } =
      that;
    const onlineLearningImg = window.location.href.split('/mobile')[0]+'/api/api/aliyun/download?refId=';
      let templateString = '';
      if(vm.params.schemaCode === 'onlineLearning'){
        templateString =
          that.templateString.trim() || listCustomTemplateConverter.onlineTemplate;
      }else if(vm.params.schemaCode === 'onlineExam'){
        templateString =
          that.templateString.trim() || listCustomTemplateConverter.onlineExamTemplate;
      }else if(vm.params.schemaCode === 'onlineCourseExam'){
        templateString =
          that.templateString.trim() || listCustomTemplateConverter.onlineCourseExamTemplate;
      }else if(vm.params.schemaCode === 'analysis'){
        templateString =
          that.templateString.trim() || listCustomTemplateConverter.analysisExam;
      }else{
        templateString =
          that.templateString.trim() || listCustomTemplateConverter.template;
      }
    

    // 优先使用缓存模板
    if (!that.templateRender) {
      const compiled = vueCompiler.compile(templateString);
      if (compiled.errors.length) {
        that.templateParsingError = `Error compiling template:\n\n${templateString}'\n\n${compiled.errors.join(
          '\n',
        )}`;
        return that.errorRender(h);
      }
      that.templateRender = new Function(compiled.render);
      that.templateStaticRenderFns = new Function(compiled.staticRenderFns);
    }

    return h({
      // compiled
      render: that.templateRender,
      staticRenderFns: that.templateStaticRenderFns,
      // 基本属性
      components: {
        checkboxItem: comm.components.Checkbox,
      },
      data() {
        return {
          vm,
          columns,
          originalListData,
          batchFlag,
          selectAll,
          canDelete,
          onlineLearningImg,
        };
      },
      // 生命周期
      beforeCreate() {
        that.$emit('beforeCreate');
      },
      created() {
        that.$emit('created', this);
        this.localHref = location.href;
      },
      beforeMount() {
        that.$emit('beforeMount', this);
      },
      mounted() {
        this.$nextTick(() => {
          that.$emit('mounted', this);
          window.addEventListener('popstate', this.handlePopState);
        });
      },
      beforeDestroy() {
        window.removeEventListener('popstate', this.handlePopState);
      },
      // 计算属性
      computed: {
        // 列表
        listData() {
          // @ts-ignore 忽略ts的检测, 这块东西是运行时
          let z:any;
          if(vm.params.schemaCode === 'onlineLearning' ||
            vm.params.schemaCode === 'onlineExam' || 
            vm.params.schemaCode === 'onlineCourseExam' ){
            (this as any).originalListData['imgToken'] = localStorage.getItem('token');
            z = (this as any).originalListData;
          }else{
            z = (this as any).originalListData.map((t) => {
              const item = { ...t };
              const fields: any = [];
              Object.entries(t.data).forEach(([k, v]) => {
                // @ts-ignore 忽略ts的检测, 这块东西是运行时
                const c = this.columns.find((col: any) => col.propertyCode === k);
                if (c) {
                  const {
                    displayFormat,
                    name,
                    name_i18n,
                    propertyCode,
                    propertyType,
                    sortKey,
                  } = c;

                  // 关联表单处理
                  if (c.propertyType === DataItemType.RelevanceForm) {
                    if (!t.data[k]) {
                      return;
                    }
                    const key = t.data[k].displayCode;
                    const value = t.data[k][key];
                    let filedValue: string = '';
                    if (Array.isArray(value)) {
                      filedValue = value[0].name;
                    } else {
                      filedValue = value;
                      if (t.data[k].displayCode === 'sequenceStatus') {
                        switch (value) {
                          case 'DRAFT':
                            filedValue = '草稿';
                            break;
                          case 'PROCESSING':
                            filedValue = '进行中';
                            break;
                          case 'COMPLETED':
                            filedValue = '已完成';
                            break;
                          case 'CANCELED':
                            filedValue = '已作废';
                            break;
                          default:
                            filedValue = '';
                            break;
                        }
                      }
                      // 处理地址
                      if (
                        t.data[k].propertyType === DataItemType.Address &&
                        value
                      ) {
                        const address = JSON.parse(value);
                        address.provinceName
                          ? (filedValue = address.provinceName)
                          : (filedValue = '');
                        address.cityName
                          ? (filedValue += address.cityName)
                          : (filedValue += '');
                        address.districtName
                          ? (filedValue += address.districtName)
                          : (filedValue += '');
                        address.address
                          ? (filedValue += address.address)
                          : (filedValue += '');
                      }
                    }
                    fields.push({
                      displayFormat,
                      name,
                      name_i18n,
                      propertyCode,
                      propertyType,
                      sortKey,
                      // @ts-ignore
                      value: getRealValue(c, filedValue),
                    });
                  } else if (c.propertyType === DataItemType.RelevanceFormEx) {
                    if (!t.data[k]) {
                      return;
                    }
                    const key = t.data[k].displayCode;
                    const fieldData = t.data[k].items
                      .map((item) => {
                        const value = item[key];
                        let filedValue: string = '';
                        if (Array.isArray(value)) {
                          filedValue = value[0].name;
                        } else {
                          filedValue = value;
                          if (key === 'sequenceStatus') {
                            switch (value) {
                              case 'DRAFT':
                                filedValue = '草稿';
                                break;
                              case 'PROCESSING':
                                filedValue = '进行中';
                                break;
                              case 'COMPLETED':
                                filedValue = '已完成';
                                break;
                              case 'CANCELED':
                                filedValue = '已作废';
                                break;
                              default:
                                filedValue = '';
                                break;
                            }
                          }
                          // 处理地址
                          if (
                            t.data[k].propertyType === DataItemType.Address &&
                            value
                          ) {
                            const address = JSON.parse(value);
                            address.provinceName
                              ? (filedValue = address.provinceName)
                              : (filedValue = '');
                            address.cityName
                              ? (filedValue += address.cityName)
                              : (filedValue += '');
                            address.districtName
                              ? (filedValue += address.districtName)
                              : (filedValue += '');
                            address.address
                              ? (filedValue += address.address)
                              : (filedValue += '');
                          }
                        }
                        return filedValue;
                      })
                      .join(';');
                    fields.push({
                      displayFormat,
                      name,
                      name_i18n,
                      propertyCode,
                      propertyType,
                      sortKey,
                      // @ts-ignore
                      value: getRealValue(c, fieldData),
                    });
                  } else {
                    fields.push({
                      displayFormat,
                      name,
                      name_i18n,
                      propertyCode,
                      propertyType,
                      sortKey,
                      // @ts-ignore
                      value: getRealValue(c, t.data[k]),
                    });
                  }
                }
              });
              // @ts-ignore
              item.fields = fields.sort((c, n) => c.sortKey - n.sortKey);
              // console.log(t.data)
              if (t.data.creater.length) {
                item.creater = t.data.creater[0];
                if (item.creater.imgUrl) {
                  if (
                    !item.creater.imgUrl.includes('http') &&
                    !item.creater.imgUrl.includes('data:image/png;')
                  ) {
                    item.creater.imgUrl = that.getDownloadUrlNew(
                      item.creater.imgUrl,
                    );
                  }
                } else {
                  item.creater.imgUrl = defaultAvatar;
                }
                // item.creater.imgUrl = item.creater.imgUrl || defaultAvatar;
              }
              item.status = that.__parseStatus(t);
              if (that.selectAll) {
                item.select = true;
              }
              return item;
            });
          }

          // 批量删除时过滤进行中的
          // if(batchFlag) {
          //   z = z.filter((item: any) => item.sequenceStatus !== 'PROCESSING')
          // }
          // console.log(z, 'zzzzzzzzzzzzzzzzzz');

          return z;
        },
        // 扩展
        extensions() {
          try {
            // @ts-ignore 忽略ts的检测, 这块东西是运行时
            return this.vm.eventHooksHandler.scription.extensions;
          } catch (err) {
            return {};
          }
        },
      },
      // 方法
      methods: {
        handlePopState() {
          let router:any = this['$route'];
          const isOnExamPage = router.path === '/audit/lineExamView';  //解决左滑回到考试页的问题
          if (isOnExamPage) {
            window.history.pushState(null, '', (this as any).localHref);
            vm.$router.push({
              path: '/apps/apps-form-list/onlineExam',
            })
          }
        },
        // 列表详情
        showListItemDetail(ev, item) {
          console.log(ev,item)
          // 兼容处理，老版本的模板中无ev参数，升级后会导致异常。
          item = item || ev;
          if (that.batchFlag) {
            return;
          }
          if (item.isOpenForm === false) {
            return;
          }
          if(vm.params.schemaCode === 'onlineLearning'){
            item['schemaCode'] = vm.params.schemaCode;
            // let { href } = (this as any).$router.resolve({ 
            //     name: 'studyView', 
            //     query: {
            //         courseName:encodeURIComponent(item.courseName),
            //         courseBlurb:item.courseBlurb,
            //         learnDuration:item.learnDuration,
            //         learningDuration:item.learningDuration,
            //         courseId:item.id,
            //         refId:item.appendix[0].refId,
            //         learnRate:item.learnRate,
            //         refName:encodeURIComponent(item.appendix[0].name),
            //     },
            // });
            // let onlocal = window.open('', ' _blank');
            // onlocal.location = href;
            vm.$router.push({
              name: 'studyView',
              query: {
                courseName:encodeURIComponent(item.courseName),
                  courseBlurb:item.courseBlurb,
                  learnDuration:item.learnDuration,
                  learningDuration:item.learningDuration,
                  courseId:item.id,
                  refId:item.appendix[0].refId,
                  learnRate:item.learnRate,
                  refName:encodeURIComponent(item.appendix[0].name),
              },
            });
          }else{
            listApi
              .getFormUrl({
                bizObjectId: item.id,
                schemaCode: item.schemaCode,
              })
              .then((res) => {
                if (!res || typeof res !== 'string') {
                  throw new Error('跳转失败!');
                }
                (this as any).$router
                  .push({
                    path: res + `&return=${(this as any).$route.fullPath}`,
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                that.$h3.toast.show({
                  text: err.toString(),
                });
              });
          }
          
        },
        goExam(item){
          // if( vm.params.schemaCode === 'onlineExam' || 
          //   vm.params.schemaCode === 'onlineCourseExam'){

          // }
          vm.$router.push({
              name: 'lineExamView',
              query: {
                  type: vm.params.schemaCode === 'onlineExam' ? 1 : 2,
                  id: item.examLibraryid,
              },
            });  
        },
        goHistoryExam(item){
          vm.$router.push({
            name: 'historyExam',
            query: {
                type: vm.params.schemaCode === 'onlineExam' ? 1 : 2,
                isOpenPage: true,
                id: item.onlineExamId,
                name: item.examinationName,
            },
          });  
        },
        deleteItem(item) {
          const { schemaCode, id } = item;
          that.$h3.modal.show({
            content: '删除后数据不可恢复，是否删除？',
            actions: [
              {
                //@ts-ignore
                text: this.$t('cloudpivot.form.renderer.cancel').toString(),
                onPress() {},
              },
              {
                //@ts-ignore
                text: this.$t('cloudpivot.form.renderer.ok').toString(),
                onPress: () => {
                  this.deleteListData({ schemaCode, ids: [id] });
                },
              },
            ],
          });
        },
        deleteListData(param) {
          listApi.deleteListData(param).then((res) => {
            if (res.errcode === 0) {
              that.$h3.toast.show({
                text: '删除成功',
                iconType: 'check',
              });
              that.$emit('reloadList');
            } else {
              that.$h3.toast.show({
                text: '删除失败，请重新尝试',
                iconType: 'close',
              });
            }
          });
        },
        selectItem(b, index) {
          //@ts-ignore
          this.listData[index].select = b;
          //@ts-ignore
          that.$emit('selectedsome', b, index, this.listData);
        },
        getAttachmentUrl(file) {
          if (!file || !file.refId) {
            return '';
          }
          return renderer.UploadControl.service.getDownloadUrl(file);
        },
      },
    });
  }

  // 模板有错误时, 输出错误信息
  templateParsingError: string = '';

  templateParsingErrorHtml: any;

  errorRender(h) {
    return h(
      'div',
      {
        attrs: { id: 'custom-list-container' },
      },
      [
        h(
          'pre',
          { attrs: { id: 'custom-list-parsing-error' } },
          this.templateParsingError,
        ),
      ],
    );
  }

  // 其他函数
  get __lang() {
    return localStorage.getItem('locale') || 'zh';
  }

  __parseStatus(listItem) {
    let randomIdx: number = 3;
    const sequenceStatus: any = listItem.sequenceStatus || '';
    switch (sequenceStatus) {
      // 本地缓存
      case 'CACHE':
        randomIdx = 4;
        break;
      // 草稿
      case 'DRAFT':
        randomIdx = 0;
        break;
      // 进行中
      case 'PROCESSING':
      case 'null':
        // TODO 进行中状态需要调整
        randomIdx = 1;
        break;
      case '':
        // 当状态为空时不显示状态
        randomIdx = 5;
        break;
      // 完成
      case 'COMPLETED':
        randomIdx = 2;
        break;
      // 作废
      default:
        randomIdx = 3;
        break;
    }

    const value = ['draft', 'pending', 'complete', 'closure', 'cache', ''][
      randomIdx
    ];
    const text =
      {
        draft: '草稿',
        pending: '进行中',
        complete: '已完成',
        closure: '已作废',
        cache: '本地草稿',
      }[value] || '';
    let img = '';
    try {
      value &&
        (img = require(`cloudpivot/common/assets/mobile/images/${value}${
          this.__lang === 'zh' ? '' : '-en'
        }.png`));
    } catch (err) {
      console.warn('img loading failed!');
    }
    return { value, text, img };
  }

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  getDownloadUrl(refId: string) {
    let url = `${
      this.apiHost
    }/api/aliyun/download?refId=${getDownloadUrlNew.getRefId(refId)}`;
    if (this.token) {
      url += '&T=' + this.token;
    }
    return url;
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }
}
</script>
