export type TypeWithI18N<T = string> = {
  en_US: T;
  zh_Hans: T;
  [key: string]: T;
};

export enum FormTypeEnum {
  textInput = 'text-input',
  textNumber = 'number-input',
  secretInput = 'secret-input',
  select = 'select',
  radio = 'radio',
  boolean = 'boolean',
  files = 'files',
  file = 'file',
  modelSelector = 'model-selector',
  toolSelector = 'tool-selector',
  multiToolSelector = 'array[tools]',
  appSelector = 'app-selector',
}

export type FormShowOnObject = {
  variable: string;
  value: string;
};

export type CredentialFormSchemaBase = {
  variable: string;
  label: TypeWithI18N;
  type: FormTypeEnum;
  required: boolean;
  default?: string;
  tooltip?: TypeWithI18N;
  show_on: FormShowOnObject[];
  url?: string;
  scope?: string;
};

export type CredentialFormSchemaTextInput = CredentialFormSchemaBase & {
  max_length?: number;
  placeholder?: TypeWithI18N;
  template?: {
    enabled: boolean;
  };
  auto_generate?: {
    type: string;
  };
};

export type FormOption = {
  label: TypeWithI18N;
  value: string;
  show_on: FormShowOnObject[];
};

export type CredentialFormSchemaNumberInput = CredentialFormSchemaBase & {
  min?: number;
  max?: number;
  placeholder?: TypeWithI18N;
};
export type CredentialFormSchemaSelect = CredentialFormSchemaBase & {
  options: FormOption[];
  placeholder?: TypeWithI18N;
};
export type CredentialFormSchemaRadio = CredentialFormSchemaBase & {
  options: FormOption[];
};
export type CredentialFormSchemaSecretInput = CredentialFormSchemaBase & {
  placeholder?: TypeWithI18N;
};
export type CredentialFormSchema =
  | CredentialFormSchemaTextInput
  | CredentialFormSchemaSelect
  | CredentialFormSchemaRadio
  | CredentialFormSchemaSecretInput;
