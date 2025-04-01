import { memo, useEffect, useRef } from "react";
import { useClickAway } from "ahooks";
import { Divider } from "antd";
import ShortcutsName from "./shortcuts-name";
import { useStore } from "./store";
import {
  // useDSL,
  useNodesInteractions,
  usePanelInteractions,
  // useWorkflowStartRun,
} from "./hooks";
import AddBlock from "./operator/add-block";
import { useOperator } from "./operator/hooks";
import cn from "@/utils/classnames";

const PanelContextmenu = () => {
  const ref = useRef(null);
  const panelMenu = useStore((s) => s.panelMenu);
  const clipboardElements = useStore((s) => s.clipboardElements);
  const setShowImportDSLModal = useStore((s) => s.setShowImportDSLModal);
  const { handleNodesPaste } = useNodesInteractions();
  const { handlePaneContextmenuCancel, handleNodeContextmenuCancel } =
    usePanelInteractions();
  // const { handleStartWorkflowRun } = useWorkflowStartRun();
  const { handleAddNote } = useOperator();
  // const { exportCheck } = useDSL()
  const exportCheck = () => {};

  useEffect(() => {
    if (panelMenu) handleNodeContextmenuCancel();
  }, [panelMenu, handleNodeContextmenuCancel]);

  useClickAway(() => {
    handlePaneContextmenuCancel();
  }, ref);

  const renderTrigger = () => {
    return (
      <div className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover">
        添加节点
      </div>
    );
  };

  if (!panelMenu) return null;

  return (
    <div
      className="absolute z-[9] w-[200px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg"
      style={{
        left: panelMenu.left,
        top: panelMenu.top,
      }}
      ref={ref}
    >
      <div className="p-1">
        <AddBlock
          renderTrigger={renderTrigger}
          offset={{
            mainAxis: -36,
            crossAxis: -4,
          }}
        />
        <div
          className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
          onClick={(e) => {
            e.stopPropagation();
            handleAddNote();
            handlePaneContextmenuCancel();
          }}
        >
          添加注释
        </div>
        {/* <div
          className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
          onClick={() => {
            handleStartWorkflowRun();
            handlePaneContextmenuCancel();
          }}
        >
          {t('workflow.common.run')}
          <ShortcutsName keys={['alt', 'r']} />
        </div> */}
      </div>
      <Divider className="m-0" />
      <div className="p-1">
        <div
          className={cn(
            "flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary",
            !clipboardElements.length
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-state-base-hover",
          )}
          onClick={() => {
            if (clipboardElements.length) {
              handleNodesPaste();
              handlePaneContextmenuCancel();
            }
          }}
        >
          粘贴到这里
          <ShortcutsName keys={["ctrl", "v"]} />
        </div>
      </div>
      <Divider className="m-0" />
      <div className="p-1">
        <div
          className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
          onClick={() => exportCheck()}
        >
          导出 DSL
        </div>
        <div
          className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
          onClick={() => setShowImportDSLModal(true)}
        >
          导入 DSL
        </div>
      </div>
    </div>
  );
};

/** @name 工作流右键菜单 */
export default memo(PanelContextmenu);
