/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ListOptions } from '../../core/schema';
import { ListGeneratorMap } from './generator-validates';
import { ListParseMap } from './parser-validates';

/**
 *
 * @param object 设计视图配置数据
 * @returns html  转换后的编辑器内容
 */
export async function objectToHtml(options: ListOptions) {
  try {
    const generator = ListGeneratorMap(options);
    if (generator) {
      await generator.generate();
    }
    return generator;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @param html  编辑器的内容
 * @returns options  转换为AST树，再转为设计视图配置数据
 */
export async function htmlToObject(html: string, options: ListOptions) {
  try {
    const parser = ListParseMap(html, options);
    if (parser) {
      await parser.parse();
    }
    return parser;
  } catch (error) {
    throw new Error(error);
  }
}
