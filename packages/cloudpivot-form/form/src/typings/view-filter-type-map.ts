/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { DataItemType } from './../schema';
const rules = [
  {
    name: '等于',
    name_i18n: '{"zh":"等于","en":"="}',
    value: 'Eq',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      DataItemType.Number,
      DataItemType.Date,
      DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Logic,
      DataItemType.Address,
    ],
  },
  {
    name: '不等于',
    name_i18n: '{"zh":"不等于","en":"!="}',
    value: 'NotEq',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      DataItemType.Number,
      DataItemType.Date,
      DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
    ],
  },

  {
    name: '大于',
    name_i18n: '{"zh":"大于","en":">"}',
    value: 'Gt',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },
  {
    name: '小于',
    name_i18n: '{"zh":"小于","en":"<"}',
    value: 'Lt',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },

  {
    name: '大于等于',
    name_i18n: '{"zh":"大于等于","en":">="}',
    value: 'Gte',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },
  {
    name: '小于等于',
    name_i18n: '{"zh":"小于等于","en":"<="}',
    value: 'Lte',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },

  {
    name: '包含',
    name_i18n: '{"zh":"包含","en":"contain"}',
    value: 'Like',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      // DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      // DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
    ],
  },
  {
    name: '不包含',
    name_i18n: '{"zh":"不包含","en":"not contain"}',
    value: 'NotLike',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      // DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      // DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
    ],
  },

  {
    name: '为空',
    name_i18n: '{"zh":"为空","en":"empty"}',
    value: 'IsNull',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
    ],
  },
  {
    name: '不为空',
    name_i18n: '{"zh":"不为空","en":"not empty"}',
    value: 'IsNotNull',
    acceptTypes: [
      DataItemType.ShortText,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.Dropdown,
      DataItemType.DropdownMulti,
      DataItemType.StaffSingle,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
    ],
  },

  {
    name: '介于',
    name_i18n: '{"zh":"介于","en":"between"}',
    value: 'Between',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },
  {
    name: '不介于',
    name_i18n: '{"zh":"不介于","en":"not between"}',
    value: 'NotBetween',
    acceptTypes: [DataItemType.Number, DataItemType.Date],
  },
];

export default rules;

export function getRulesList(propertyType, code) {
  if (code === 'sequenceStatus') {
    // 单据状态
    return [
      {
        name: '包含',
        name_i18n: '{"zh":"包含","en":"contain"}',
        value: 'Like',
        acceptTypes: [],
      },
    ];
  }

  let res = rules.filter((el) => el.acceptTypes.includes(propertyType));
  // 迭代54需求，部门单选控件设置“作为查询条件”属性为true时，需新增“属于/不属于”类型查询方式
  if (
    ['createdDeptId', 'ownerDeptId'].includes(code) ||
    propertyType === DataItemType.DeptSingle
  ) {
    const OF = [
      {
        name: '属于',
        name_i18n: '{"zh":"属于","en":"belong to"}',
        value: 'Of',
        acceptTypes: [],
      },
      {
        name: '不属于',
        name_i18n: '{"zh":"不属于","en":"not belong to"}',
        value: 'NotOf',
        acceptTypes: [],
      },
    ];
    res = [...res, ...OF];
  }

  return res;
}

export function getRulesLisForRelevance(propertyType, code) {
  let res = rules.filter((el) => el.acceptTypes.includes(propertyType));

  if (code === 'sequenceStatus') {
    // 单据状态
    res = res.filter((el) => !['IsNull', 'IsNotNull'].includes(el.value));
  }
  // 迭代54需求，部门单选控件设置“作为查询条件”属性为true时，需新增“属于/不属于”类型查询方式
  if (
    ['createdDeptId', 'ownerDeptId'].includes(code) ||
    propertyType === DataItemType.DeptSingle
  ) {
    const OF = [
      {
        name: '属于',
        name_i18n: '{"zh":"属于","en":"belong to"}',
        value: 'Of',
        acceptTypes: [],
      },
      {
        name: '不属于',
        name_i18n: '{"zh":"不属于","en":"not belong to"}',
        value: 'NotOf',
        acceptTypes: [],
      },
    ];
    res = [...res, ...OF];
  }

  if ([DataItemType.Number, DataItemType.Date].includes(propertyType)) {
    res = [
      ...res,
      ...[
        {
          name: '为空',
          name_i18n: '{"zh":"为空","en":"empty"}',
          value: 'IsNull',
          acceptTypes: [],
        },
        {
          name: '不为空',
          name_i18n: '{"zh":"不为空","en":"not empty"}',
          value: 'IsNotNull',
          acceptTypes: [],
        },
      ],
    ];
  } else if ([DataItemType.Address].includes(propertyType)) {
    // res = res.filter((el) => !['Like', 'NotLike'].includes(el.value));
  } else {
    //Else Empty block statement
  }

  return res;
}
