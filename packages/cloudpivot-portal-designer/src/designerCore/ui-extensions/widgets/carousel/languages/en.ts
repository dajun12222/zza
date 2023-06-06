/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: 'Carousel',
  properties: {
    backgroundColor: 'Background Color',
    backgroundImg: 'Background Image',
    borderRadius: 'Border Radius',

    borderStyle: 'Border Style',
    borderThickness: 'Border Thickness',
    borderColor: 'Border Color',

    textColor: 'Text Color',
    textThickness: 'Text Thickness',

    photos: 'Photos',
    autoplay: 'Autoplay',
    autoplaySpeed: 'Autoplay Speed',
  },
  groups: {
    props: 'Property',
    text: 'Fonts',

    backgroudStyle: 'Backgroud Style',
    borderStyle: 'Border Style',

    advancedConfig: 'Advanced Config',
  },
  enums: {
    none: 'None',
    small: 'Small',
    medium: 'Medium',
    big: 'Big',
    dashed: 'Dashed',
    solid: 'Solid',
    normal: 'Normal',
    bold: 'Bold',
  },
  events: {
    click: 'Click',
  },
};
