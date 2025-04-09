'use client';
import type { FC } from 'react';
import React from 'react';
import Icon, { AlignLeftOutlined, NumberOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { InputVarType } from '../../../types';

type Props = {
  className?: string;
  type: InputVarType;
};

const CheckboxMulitpleSvg = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3142"
      width="16"
      height="16"
    >
      <path
        d="M853.333333 768V170.666667H256a85.333333 85.333333 0 0 1 85.333333-85.333334h512a85.333333 85.333333 0 0 1 85.333334 85.333334v512a85.333333 85.333333 0 0 1-85.333334 85.333333zM170.666667 256h512a85.333333 85.333333 0 0 1 85.333333 85.333333v512a85.333333 85.333333 0 0 1-85.333333 85.333334H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z m0 85.333333v512h512V341.333333H170.666667z m395.093333 99.285334l63.146667 57.429333-221.44 243.328-158.890667-146.688 57.898667-62.72 95.744 88.405333 163.541333-179.754666z"
        fill="#3E4449"
        p-id="3143"
      ></path>
    </svg>
  );
};
const CheckboxMultipleLine = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CheckboxMulitpleSvg} {...props} />;
};

const TextSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="4157"
    width="16"
    height="16"
  >
    <path
      d="M853.333333 170.666667H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v128a42.666667 42.666667 0 0 0 85.333333 0V256h256v554.666667H384a42.666667 42.666667 0 0 0 0 85.333333h256a42.666667 42.666667 0 0 0 0-85.333333h-85.333333V256h256v85.333333a42.666667 42.666667 0 0 0 85.333333 0V213.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z"
      fill="#231F20"
      p-id="4158"
    ></path>
  </svg>
);
const TextSnippet = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={TextSvg} {...props} />;
};
const getIcon = (type: InputVarType) => {
  return (
    (
      {
        [InputVarType.textInput]: TextSnippet,
        [InputVarType.paragraph]: AlignLeftOutlined,
        [InputVarType.select]: CheckboxMultipleLine,
        [InputVarType.number]: NumberOutlined,
        // [InputVarType.singleFile]: RiFileList2Line,
        // [InputVarType.multiFiles]: RiFileCopy2Line,
      } as any
    )[type] || TextSnippet
  );
};

const InputVarTypeIcon: FC<Props> = ({ className, type }) => {
  const Icon = getIcon(type);
  return <Icon className={className} />;
};
export default React.memo(InputVarTypeIcon);
