/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Author: zws <nooldey@gmail.com>
 * @Date: 2021-04-27 16:28:08
 * @Last Modified by: zws
 * @Description: 解析函数定义脚本，并解析后返回函数名列表
 */

import { parse } from 'recast';

function getFunctionName(script: string) {
  let ast: any;
  const funcBox: string[] = [];
  try {
    ast = parse(script);
  } catch (error) {
    console.log(error);
    return funcBox;
  }
  const add = ast.program.body;
  for (const i in add) {
    if (!add.hasOwnProperty(i)) {
      continue;
    }
    const funcName = getFunctionStruct(add[i]);
    if (funcName !== 'Not Supported' && funcName !== 'Not Function') {
      if (typeof funcName === 'string') {
        funcBox.push(funcName);
      } else {
        console.warn('illegal function name', funcName);
      }
    } else {
      console.warn('Not Supported Script:', add[i]);
    }
  }
  return funcBox;
}

function getFunctionStruct(add: any) {
  /* eslint-disable indent */
  let result = '';
  switch (add.type) {
    case 'FunctionDeclaration':
      result = add.id.name;
      break;

    case 'VariableDeclaration':
      const decl = add.declarations[0];
      if (
        decl.init &&
        (decl.init.type === 'FunctionExpression' ||
          decl.init.type === 'ArrowFunctionExpression')
      ) {
        result = decl.id.name;
      } else {
        result = 'Not Supported';
      }
      break;

    default:
      result = 'Not Function';
      break;
  }
  return result;
}

export function scriptParser(script: string) {
  const names = getFunctionName(script);
  return names;
}
