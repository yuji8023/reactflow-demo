import { Tag, Tooltip } from 'antd';
import React from 'react';
import { concat } from 'lodash-es';
import useNodeExistTag from '../use-node-tag';
import { TAG_TEXT_MAX_LENGTH } from '../../constants';

type Props = {
  nodeId: string;
  tagList?: string[];
  onChange?: (tagList: string[]) => void;
};
const TagExist: React.FC<Props> = ({ tagList = [], onChange }) => {
  const { tags: existList } = useNodeExistTag();
  // const [tags, setTags] = useState<string[]>(['Tag 1', 'Tag 2']);

  const handleChange = (tag: string, isExist: boolean) => {
    const arr = concat(tagList, []);
    if (isExist) {
      arr.splice(arr.indexOf(tag), 1);
    } else {
      arr.push(tag);
    }
    onChange?.(arr);
  };

  return (
    <>
      {existList.map((tag) => {
        const isLongTag = tag.length > TAG_TEXT_MAX_LENGTH;
        const tagElem = (
          <Tag
            onClick={() => handleChange(tag, tagList.includes(tag))}
            className="my-0.5 cursor-pointer select-none"
            key={tag}
            color={tagList.includes(tag) ? 'blue' : 'default'}
          >
            {isLongTag ? `${tag.slice(0, TAG_TEXT_MAX_LENGTH)}...` : tag}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
    </>
  );
};

export default TagExist;
