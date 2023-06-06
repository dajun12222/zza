/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: Fan
 * @Date: 2020-04-14 17:57:19
 * @description: 表单组件注册器.
 * @LastEditors: Fan
 */
import * as cs from '../component-schema';
import {
  ComponentAsset,
  ComponentInfo,
  ObjectPropertyInfo,
  PropertyInfo,
} from '../typings';
class RegisterFormComponents {
  assets: { [type: string]: ComponentAsset } = {};

  formControllerType: number[] = [];

  append(opts: ComponentAsset) {
    const { info } = opts;
    const st = this.verified(info);
    if (!st) {
      return;
    }
    if (!this.assets[info.type]) {
      opts.schema['properties'] = this.bfs(opts.schema);
      this.assets[info.type] = opts;
      this.formControllerType.push(info.formControllerType);
    } else {
      const _info = this.assets[info.type].info;
      if (info.force && !_info.force) {
        this.assets[info.type] = opts;
        console.warn(`${info.title}(${info.type}) force!`);
      } else {
        console.warn(`有出重复的组件, ${info.title}(${info.type})`);
      }
    }
  }

  // 解析 schema 继承
  bfs(schemaItem: ObjectPropertyInfo): { [key: string]: PropertyInfo } {
    if (schemaItem['$ref']) {
      const _$ref = schemaItem['$ref'];
      //@ts-ignore
      if (cs[_$ref]) {
        //@ts-ignore
        const inheritProperties = this.bfs(cs[_$ref]);
        const properties = Object.assign(
          {},
          inheritProperties,
          schemaItem.properties,
        );
        return properties;
      } else {
        console.error(`${_$ref} 继承对象未找到`);
        return schemaItem.properties;
      }
    } else {
      return schemaItem.properties;
    }
  }

  getAssets() {
    return this.assets;
  }

  verified(info: ComponentInfo) {
    const { formControllerType, type } = info;
    if (!type) {
      console.error(`组件的 type 必填!`, info);
      return false;
    }
    if (!('' + formControllerType)) {
      console.error(`组件的 formControllerType 必填!`, info);
      return false;
    }
    if (this.formControllerType.includes(formControllerType)) {
      console.error(
        `组件的 formControllerType ${formControllerType} 有重复! 请换一个`,
        info,
      );
      return false;
    }
    return true;
  }
}

export var register = new RegisterFormComponents();
