'use client';
import type { FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import produce from 'immer';
import ModalFoot from '../modal-foot';
import ConfigSelect from '../config-select';
import ConfigString from '../config-string';
import SelectTypeItem from '../select-type-item';
import Field from './field';
// import Toast from '@/app/components/base/toast';
import { checkKeys, getNewVarInWorkflow } from '@/utils/var';
import type {
  InputVar,
  MoreInfo,
  // UploadFileSetting,
} from '../../../types';
// import Modal from '@/app/components/base/modal';
import {
  ChangeType,
  InputVarType,
  // SupportUploadFileTypes,
} from '@/components/workflow/types';
// import FileUploadSetting from '../../../nodes/_base/components/file-upload-setting';
// import Checkbox from '@/app/components/base/checkbox';
import { Checkbox, message, Modal } from 'antd';
import Input from '@/components/base/input';
import { varKeyError } from './config';
// import { DEFAULT_FILE_UPLOAD_SETTING } from '@/app/components/workflow/constants';

const TEXT_MAX_LENGTH = 256;
const DEFAULT_VALUE_MAX_LEN = 48;

export type IConfigModalProps = {
  isCreate?: boolean;
  payload?: InputVar;
  isShow: boolean;
  varKeys?: string[];
  onClose: () => void;
  onConfirm: (newValue: InputVar, moreInfo?: MoreInfo) => void;
  supportFile?: boolean;
};

const ConfigModal: FC<IConfigModalProps> = ({
  isCreate,
  payload,
  isShow,
  onClose,
  onConfirm,
  supportFile,
}) => {
  const [tempPayload, setTempPayload] = useState<InputVar>(
    payload || (getNewVarInWorkflow('') as any),
  );
  const { type, label, variable, options, max_length } = tempPayload;
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // To fix the first input element auto focus, then directly close modal will raise error
    if (isShow) modalRef.current?.focus();
  }, [isShow]);

  const isStringInput =
    type === InputVarType.textInput || type === InputVarType.paragraph;
  const checkVariableName = useCallback(
    (value: string, canBeEmpty?: boolean) => {
      const { isValid, errorMessageKey } = checkKeys([value], canBeEmpty);
      if (!isValid) {
        message.error(varKeyError(errorMessageKey, '变量名称'));
        return false;
      }
      return true;
    },
    [],
  );
  const handlePayloadChange = useCallback((key: string) => {
    return (value: any) => {
      setTempPayload((prev: any) => {
        const newPayload = {
          ...prev,
          [key]: value,
        };

        return newPayload;
      });
    };
  }, []);

  const handleTypeChange = useCallback(
    (type: InputVarType) => {
      return () => {
        const newPayload = produce(tempPayload, (draft: any) => {
          draft.type = type;
          /* if (
            [InputVarType.singleFile, InputVarType.multiFiles].includes(type)
          ) {
            Object.keys(DEFAULT_FILE_UPLOAD_SETTING).forEach((key) => {
              if (key !== 'max_length')
                (draft as any)[key] = (DEFAULT_FILE_UPLOAD_SETTING as any)[key];
            });
            if (type === InputVarType.multiFiles)
              draft.max_length = DEFAULT_FILE_UPLOAD_SETTING.max_length;
          } */
          if (type === InputVarType.paragraph)
            draft.max_length = DEFAULT_VALUE_MAX_LEN;
        });
        setTempPayload(newPayload);
      };
    },
    [tempPayload],
  );

  const handleVarKeyBlur = useCallback(
    (e: any) => {
      const varName = e.target.value;
      if (!checkVariableName(varName, true) || tempPayload.label) return;

      setTempPayload((prev: any) => {
        return {
          ...prev,
          label: varName,
        };
      });
    },
    [checkVariableName, tempPayload.label],
  );

  const handleConfirm = () => {
    const moreInfo =
      tempPayload.variable === payload?.variable
        ? undefined
        : {
            type: ChangeType.changeVarName,
            payload: {
              beforeKey: payload?.variable || '',
              afterKey: tempPayload.variable,
            },
          };

    const isVariableNameValid = checkVariableName(tempPayload.variable);
    if (!isVariableNameValid) return;

    // TODO: check if key already exists. should the consider the edit case
    // if (varKeys.map(key => key?.trim()).includes(tempPayload.variable.trim())) {
    //   Toast.notify({
    //     type: 'error',
    //     message: t('appDebug.varKeyError.keyAlreadyExists', { key: tempPayload.variable }),
    //   })
    //   return
    // }

    if (!tempPayload.label) {
      message.error('显示名称必填');
      return;
    }
    if (isStringInput || type === InputVarType.number) {
      onConfirm(tempPayload, moreInfo);
    } else if (type === InputVarType.select) {
      if (options?.length === 0) {
        message.error('至少需要一个选项');
        return;
      }
      const obj: Record<string, boolean> = {};
      let hasRepeatedItem = false;
      options?.forEach((o: any) => {
        if (obj[o]) {
          hasRepeatedItem = true;
          return;
        }
        obj[o] = true;
      });
      if (hasRepeatedItem) {
        message.error('选项不能重复');
        return;
      }
      onConfirm(tempPayload, moreInfo);
    } else if (
      [InputVarType.singleFile, InputVarType.multiFiles].includes(type)
    ) {
      /* if (tempPayload.allowed_file_types?.length === 0) {
        const errorMessages = t('workflow.errorMsg.fieldRequired', {
          field: t('appDebug.variableConfig.file.supportFileTypes'),
        });
        Toast.notify({ type: 'error', message: errorMessages });
        return;
      }
      if (
        tempPayload.allowed_file_types?.includes(
          SupportUploadFileTypes.custom,
        ) &&
        !tempPayload.allowed_file_extensions?.length
      ) {
        const errorMessages = t('workflow.errorMsg.fieldRequired', {
          field: t('appDebug.variableConfig.file.custom.name'),
        });
        Toast.notify({ type: 'error', message: errorMessages });
        return;
      } */
      onConfirm(tempPayload, moreInfo);
    } else {
      onConfirm(tempPayload, moreInfo);
    }
  };

  return (
    <Modal
      title={isCreate ? '添加变量' : '编辑变量'}
      open={isShow}
      onClose={onClose}
      footer={<ModalFoot onConfirm={handleConfirm} onCancel={onClose} />}
    >
      <div className="mb-8" ref={modalRef} tabIndex={-1}>
        <div className="space-y-2">
          <Field title="字段类型">
            <div className="grid grid-cols-3 gap-2">
              <SelectTypeItem
                type={InputVarType.textInput}
                selected={type === InputVarType.textInput}
                onClick={handleTypeChange(InputVarType.textInput)}
              />
              <SelectTypeItem
                type={InputVarType.paragraph}
                selected={type === InputVarType.paragraph}
                onClick={handleTypeChange(InputVarType.paragraph)}
              />
              <SelectTypeItem
                type={InputVarType.select}
                selected={type === InputVarType.select}
                onClick={handleTypeChange(InputVarType.select)}
              />
              <SelectTypeItem
                type={InputVarType.number}
                selected={type === InputVarType.number}
                onClick={handleTypeChange(InputVarType.number)}
              />
              {supportFile && (
                <>
                  <SelectTypeItem
                    type={InputVarType.singleFile}
                    selected={type === InputVarType.singleFile}
                    onClick={handleTypeChange(InputVarType.singleFile)}
                  />
                  <SelectTypeItem
                    type={InputVarType.multiFiles}
                    selected={type === InputVarType.multiFiles}
                    onClick={handleTypeChange(InputVarType.multiFiles)}
                  />
                </>
              )}
            </div>
          </Field>

          <Field title="变量名称">
            <Input
              value={variable}
              onChange={(e: any) =>
                handlePayloadChange('variable')(e.target.value)
              }
              onBlur={handleVarKeyBlur}
              placeholder={'请输入'}
            />
          </Field>
          <Field title="显示名称">
            <Input
              value={label as string}
              onChange={(e: any) =>
                handlePayloadChange('label')(e.target.value)
              }
              placeholder="请输入"
            />
          </Field>

          {isStringInput && (
            <Field title="最大长度">
              <ConfigString
                maxLength={
                  type === InputVarType.textInput ? TEXT_MAX_LENGTH : Infinity
                }
                value={max_length}
                onChange={handlePayloadChange('max_length')}
              />
            </Field>
          )}
          {type === InputVarType.select && (
            <Field title="选项">
              <ConfigSelect
                options={options || []}
                onChange={handlePayloadChange('options')}
              />
            </Field>
          )}

          {/* {[InputVarType.singleFile, InputVarType.multiFiles].includes(type) && (
            <FileUploadSetting
              payload={tempPayload as UploadFileSetting}
              onChange={(p: UploadFileSetting) => setTempPayload(p as InputVar)}
              isMultiple={type === InputVarType.multiFiles}
            />
          )} */}

          <div className="!mt-5 flex h-6 items-center space-x-2">
            <Checkbox
              checked={tempPayload.required}
              onChange={() =>
                handlePayloadChange('required')(!tempPayload.required)
              }
            />
            <span className="system-sm-semibold text-text-secondary">必填</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default React.memo(ConfigModal);
