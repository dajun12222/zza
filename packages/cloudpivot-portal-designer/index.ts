/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  portalDesign,
  portalDesignInApp,
  portalDesignPreview,
  appPortalDesignPreview,
} from './src/router';

import Store from './src/store/portal-design';

export const portalDesignRouter = portalDesign;

export const portalDesignInAppRouter = portalDesignInApp;

export const portalDesignPreviewRouter = portalDesignPreview;

export const appPortalDesignPreviewRouter = appPortalDesignPreview;

export const PortalDesignStore = Store;
