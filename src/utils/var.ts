import { InputVarType } from '@/components/workflow/types';

export const zhRegex = /^[\u4E00-\u9FA5]$/m;
const MAX_ZN_VAR_NAME_LENGTH = 8; // 中文变量名最大长度
const MAX_EN_VAR_VALUE_LENGTH = 30; // 英文变量名最大长度

const MAX_VAR_KEY_LENGTH = 30;
const otherAllowedRegex = /^[a-zA-Z0-9_]+$/;

export const VAR_ITEM_TEMPLATE_IN_WORKFLOW = {
  variable: '',
  label: '',
  type: InputVarType.textInput,
  max_length: 48,
  required: true,
  options: [],
};

export const getMaxVarNameLength = (value: string) => {
  if (zhRegex.test(value)) return MAX_ZN_VAR_NAME_LENGTH;

  return MAX_EN_VAR_VALUE_LENGTH;
};

export const getNewVarInWorkflow = (
  key: string,
  type = InputVarType.textInput,
) => {
  const { max_length, ...rest } = VAR_ITEM_TEMPLATE_IN_WORKFLOW;
  if (type !== InputVarType.textInput) {
    return {
      ...rest,
      type,
      variable: key,
      label: key.slice(0, getMaxVarNameLength(key)),
    };
  }
  return {
    ...VAR_ITEM_TEMPLATE_IN_WORKFLOW,
    type,
    variable: key,
    label: key.slice(0, getMaxVarNameLength(key)),
  };
};

export const checkKey = (key: string, canBeEmpty?: boolean) => {
  if (key.length === 0 && !canBeEmpty) return 'canNoBeEmpty';

  if (canBeEmpty && key === '') return true;

  if (key.length > MAX_VAR_KEY_LENGTH) return 'tooLong';

  if (otherAllowedRegex.test(key)) {
    if (/[0-9]/.test(key[0])) return 'notStartWithNumber';

    return true;
  }
  return 'notValid';
};
export const checkKeys = (keys: string[], canBeEmpty?: boolean) => {
  let isValid = true;
  let errorKey = '';
  let errorMessageKey = '';
  keys.forEach((key) => {
    if (!isValid) return;

    const res = checkKey(key, canBeEmpty);
    if (res !== true) {
      isValid = false;
      errorKey = key;
      errorMessageKey = res;
    }
  });
  return { isValid, errorKey, errorMessageKey };
};
