import { Vue } from 'vue-property-decorator';

export default class FieldSelectModal extends Vue {
  field: string = '';

  getSubDataList(item, type: string = 'child') {
    if (type === 'tempList') {
      return item.subSchema ? item.subSchema.tempList : item.tempList;
    } else {
      return item.subSchema ? item.subSchema.properties : item.childColumns;
    }
  }

  getIsSystemField(item) {
    return item.isSystem || item.defaultProperty || item.isDefaultProperty;
  }

  getItemName(item) {
    const locale = this.$i18n.locale || 'zh';
    let name = item.name;
    if (item.name_i18n) {
      let name_i18n =
        typeof item.name_i18n === 'string'
          ? JSON.parse(item.name_i18n)
          : item.name_i18n;
      name = name_i18n[locale] || name;
    }
    return name;
  }

  getItemTitle(item) {
    return `${this.getItemName(item)}[${item.code}]`;
  }

  getAllSelect(dataItemList, type, excludeDataItemTypeArr) {
    return dataItemList.every((item) =>
      this.getAllSelectItem(item, type, excludeDataItemTypeArr),
    );
  }

  getAllSelectItem(item, type, excludeDataItemTypeArr) {
    return (
      item.checked ||
      (type === 'sub' && this.getIsSystemField(item)) ||
      excludeDataItemTypeArr.includes(item.propertyType)
    );
  }

  getSomeSelect(dataItemList, type, excludeDataItemTypeArr) {
    return dataItemList.some((item) =>
      this.getSomeSelectItem(item, type, excludeDataItemTypeArr),
    );
  }

  getSomeSelectItem(item, type, excludeDataItemTypeArr) {
    return (
      item.checked &&
      !(type === 'sub' && this.getIsSystemField(item)) &&
      !excludeDataItemTypeArr.includes(item.propertyType)
    );
  }
}
