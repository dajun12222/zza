/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import {
  redrawLines,
  redrawOnActivityChange,
} from 'cloudpivot-admin-core/src/common/workflow/controllers/line';
import Line from 'cloudpivot-admin-core/src/common/workflow/Line';
import Store from 'cloudpivot-admin-core/src/store/index';
import * as TraceType from 'cloudpivot-admin-core/src/typings/traceType';
import * as WorkflowNamespace from 'cloudpivot-admin-core/src/typings/workflow';
import { pathToObj } from '../utils';
import TraceManager from './workflowTrace';
// 原子痕迹
// _Source: 记录_Target原来的状态,可选
export default class AtomicTrace {
  constructor(_TraceType: number, _Target: any, _Source: any) {
    const workflowStoreData = pathToObj(this.StorePath, Store.state);
    let _lines = workflowStoreData.lines;
    const _activities = workflowStoreData.activities;
    switch (_TraceType) {
      case TraceType.Activity.Remove:
        {
          this.Activity = _Target;
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);

          this.Redo = () => {
            const _ID: number = this.Activity.ID;
            let _index: number = 0;
            // if (this.Activity.isSelected) {
            //   this.Activity.Unselect();
            // }
            _activities.some((activity: any, idx: number) => {
              if (activity.ID === _ID) {
                _index = idx;
                return true;
              }
            });
            // 此时的lines并没有更新到store中
            _lines = workflowStoreData.lines;
            _lines.forEach((m: any) => {
              // mutiple lines need to be removed
              if (
                m.startActivity.activityCode ===
                  _activities[_index].activityCode ||
                m.endActivity.activityCode === _activities[_index].activityCode
              ) {
                Store.commit(`${this.StorePath}/removeLine`, m);
              }
            });

            _activities.splice(_index, 1);
            Store.commit(`${this.StorePath}/setActivityToState`, _activities);
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            const _ID: number | undefined = this.Activity.ID;
            const relatedActivities = _activities.filter(
              (activity: any) => activity.ID === _ID,
            );
            if (relatedActivities.length === 0) {
              _activities.push(this.Activity);
              Store.commit(`${this.StorePath}/setActivityToState`, _activities);
            }
            // 此时的lines并没有更新到store中
            Store.commit(`${this.StorePath}/setLines`, _lines);
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;
      case TraceType.Activity.Add:
        {
          this.Activity = _Target;
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            const _ID = this.Activity.ID;
            const relatedActivities = _activities.filter(
              (activity: any) => activity.ID === _ID,
            );
            if (relatedActivities.length === 0) {
              _activities.push(this.Activity);
            }
            Store.commit(`${this.StorePath}/setActivityToState`, _activities);
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            const _ID: number | undefined = this.Activity.ID;
            let _index: number = 0;
            // if (this.Activity.isSelected) {
            //   this.Activity.Unselect();
            // }
            _activities.some((activity: any, idx: number) => {
              if (activity.ID === _ID) {
                _index = idx;
                return true;
              }
            });
            // 此时的lines并没有更新到store中
            _lines = workflowStoreData.lines;
            _lines.forEach((m: any) => {
              if (
                m.startActivity.activityCode ===
                  _activities[_index].activityCode ||
                m.endActivity.activityCode === _activities[_index].activityCode
              ) {
                Store.commit(`${this.StorePath}/removeLine`, m);
              }
            });
            _activities.splice(_index, 1);
            Store.commit(`${this.StorePath}/setActivityToState`, _activities);
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;
      case TraceType.Activity.Move:
        {
          this.Activity = _Target;
          this.SourceState = TraceManager.GetWorkflowElementProperties(_Source);
          this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
          // 找到当前活动并重新赋值
          const _ID = this.Activity.ID;
          const _curActivity = _activities.filter(
            (activity: any) => activity.ID === _ID,
          )[0];
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            _curActivity.x = this.TargetState.x;
            _curActivity.y = this.TargetState.y;
            _curActivity.top = this.TargetState.top;
            _curActivity.left = this.TargetState.left;
            _curActivity.bottom = this.TargetState.bottom;
            _curActivity.center = this.TargetState.center;
            _curActivity.middle = this.TargetState.middle;
            _curActivity.right = this.TargetState.right;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            _curActivity.x = this.SourceState.x;
            _curActivity.y = this.SourceState.y;
            _curActivity.top = this.SourceState.top;
            _curActivity.left = this.SourceState.left;
            _curActivity.bottom = this.SourceState.bottom;
            _curActivity.center = this.SourceState.center;
            _curActivity.middle = this.SourceState.middle;
            _curActivity.right = this.SourceState.right;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;

      case TraceType.Multi.VerticalDistance:
        {
          this.Activity = _Target;
          this.SourceState = _Source;
          this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
          // 找到当前活动并重新赋值
          const _ID = this.Activity.ID;
          const _curActivity = _activities.filter(
            (activity: any) => activity.ID === _ID,
          )[0];
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            _curActivity.y = this.TargetState.y;
            _curActivity.top = this.TargetState.top;
            _curActivity.bottom = this.TargetState.y + this.TargetState.height;
            _curActivity.middle =
              this.TargetState.y + this.TargetState.height / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            _curActivity.y = this.SourceState.y;
            _curActivity.top = this.SourceState.top;
            _curActivity.bottom = this.SourceState.y + this.SourceState.height;
            _curActivity.middle =
              this.SourceState.y + this.SourceState.height / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;
      case TraceType.Multi.HorizontalDistance:
        {
          this.Activity = _Target;
          this.SourceState = _Source;
          this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
          // 找到当前活动并重新赋值
          const _ID = this.Activity.ID;
          const _curActivity = _activities.filter(
            (activity: any) => activity.ID === _ID,
          )[0];
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            _curActivity.x = this.TargetState.x;
            _curActivity.left = this.TargetState.left;
            _curActivity.right = this.TargetState.x + this.TargetState.width;
            _curActivity.center =
              this.TargetState.x + this.TargetState.width / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            _curActivity.y = this.SourceState.x;
            _curActivity.left = this.SourceState.left;
            _curActivity.right = this.SourceState.x + this.SourceState.width;
            _curActivity.center =
              this.SourceState.x + this.SourceState.width / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            // _activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;
      case TraceType.Activity.Resize:
        {
          this.Activity = _Target;
          this.SourceState = _Source;
          this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
          // 找到当前活动并重新赋值
          const _ID = this.Activity.ID;
          const _curActivity = _activities.filter(
            (activity: any) => activity.ID === _ID,
          )[0];
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            _curActivity.width = this.TargetState.width;
            _curActivity.height = this.TargetState.height;
            _curActivity.right = this.TargetState.x + this.TargetState.width;
            _curActivity.center =
              this.TargetState.x + this.TargetState.width / 2;
            _curActivity.bottom = this.TargetState.y + this.TargetState.height;
            _curActivity.middle =
              this.TargetState.y + this.TargetState.height / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            //_activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            _curActivity.width = this.SourceState.width;
            _curActivity.height = this.SourceState.height;
            _curActivity.right = this.SourceState.x + this.SourceState.width;
            _curActivity.center =
              this.SourceState.x + this.SourceState.width / 2;
            _curActivity.bottom = this.SourceState.y + this.SourceState.height;
            _curActivity.middle =
              this.SourceState.y + this.SourceState.height / 2;
            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            //_activities = workflowStoreData.activities;
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;
      case TraceType.Line.Remove:
        this.Line = _Target;
        this.SourceState = TraceManager.GetWorkflowElementProperties(_Target);

        this.Redo = () => {
          this.Line.Unselect();
          const index: number = _lines.indexOf(this.Line);
          if (index > -1) {
            _lines.splice(index, 1);
            Store.commit(`${this.StorePath}/setLines`, _lines);
            redrawLines(_lines);
          }
        };
        this.Undo = () => {
          const _StartActivityID = this.SourceState.startActivityID;
          const _EndActivityID = this.SourceState.endActivityID;
          this.Line.startActivity = _activities.filter(
            (activity: any) => activity.ID === _StartActivityID,
          )[0];
          this.Line.endActivity = _activities.filter(
            (activity: any) => activity.ID === _EndActivityID,
          )[0];
          // 起止活动都存在
          if (this.Line.startActivity && this.Line.endActivity) {
            _lines.push(this.Line);
            Store.commit(`${this.StorePath}/setLines`, _lines);
            redrawLines(_lines);
          }
        };
        break;
      case TraceType.Line.Add:
        this.Line = _Target;
        this.SourceState = TraceManager.GetWorkflowElementProperties(_Target);
        this.Redo = () => {
          const _ID = this.Line.ID;
          if (_lines.filter((line: Line) => line.ID === _ID).length === 0) {
            _lines.push(this.Line);
            Store.commit(`${this.StorePath}/setLines`, _lines);
            redrawLines(_lines);
          }
        };
        this.Undo = () => {
          this.Line.Unselect();
          const index: number = _lines.indexOf(this.Line);
          if (index > -1) {
            _lines.splice(index, 1);
            Store.commit(`${this.StorePath}/setLines`, _lines);
            redrawLines(_lines);
          }
        };
        break;
      case TraceType.Line.PointChange:
        this.Line = _Target;
        this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
        this.SourceState = TraceManager.GetWorkflowElementProperties(_Source);
        this.Redo = () => {
          const { startActivity, startPoint, endActivity, endPoint, points } =
            this.TargetState;
          this.Line.setProps({
            startActivity,
            startPoint,
            endActivity,
            endPoint,
            points,
          });
          this.Line.draw();
          Store.commit(this.StorePath + '/updateLineProps', this.TargetState);
        };
        this.Undo = () => {
          // 撤销
          const { startActivity, startPoint, endActivity, endPoint, points } =
            this.SourceState;
          this.Line.setProps({
            startActivity,
            startPoint,
            endActivity,
            endPoint,
            points,
          });
          this.Line.draw();
          Store.commit(this.StorePath + '/updateLineProps', this.SourceState);
        };
        break;
      case TraceType.Multi.SameTop:
      case TraceType.Multi.SameRight:
      case TraceType.Multi.SameBottom:
      case TraceType.Multi.SameLeft:
        {
          this.Activity = _Target;
          this.SourceState = _Source;
          this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
          // 找到当前活动并重新赋值
          const _ID = this.Activity.ID;
          const _curActivity = _activities.filter(
            (activity: any) => activity.ID === _ID,
          )[0];
          const changedActivities: Array<any> = [];
          changedActivities.push(this.Activity);
          this.Redo = () => {
            _curActivity.x = this.TargetState.x;
            _curActivity.y = this.TargetState.y;
            _curActivity.top = this.TargetState.top;
            _curActivity.left = this.TargetState.left;
            _curActivity.bottom = this.TargetState.bottom;
            _curActivity.center = this.TargetState.center;
            _curActivity.middle = this.TargetState.middle;
            _curActivity.right = this.TargetState.right;

            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            redrawOnActivityChange(changedActivities, _lines);
          };
          this.Undo = () => {
            _curActivity.x = this.SourceState.x;
            _curActivity.y = this.SourceState.y;
            _curActivity.top = this.SourceState.top;
            _curActivity.left = this.SourceState.left;
            _curActivity.bottom = this.SourceState.bottom;
            _curActivity.center = this.SourceState.center;
            _curActivity.middle = this.SourceState.middle;
            _curActivity.right = this.SourceState.right;

            Store.commit(`${this.StorePath}/updateActivityProps`, _curActivity);
            redrawOnActivityChange(changedActivities, _lines);
          };
        }
        break;

      default:
        break;
    }
  }

  Activity: any = '';

  Line: any = '';

  SourceState: any = ''; // 原始状态

  TargetState: any = ''; // 改变后状态

  Redo = () => {};

  Undo = () => {};

  StorePath: string = 'Apps/Workflow'; // vuex workflow模块层级
}
