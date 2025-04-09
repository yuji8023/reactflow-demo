export const varKeyError = (key: string, name: string) => {
  const keyMap: Record<string, string> = {
    canNoBeEmpty: '{{key}} 必填',
    tooLong: '{{key}} 长度太长。不能超过 30 个字符',
    notValid: '{{key}} 非法。只能包含英文字符，数字和下划线',
    notStartWithNumber: '{{key}} 不能以数字开头',
    keyAlreadyExists: '{{key}} 已存在',
  };
  return keyMap[key]?.replace('{{key}}', name) || key;
};
