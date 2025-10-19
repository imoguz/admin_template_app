'use client';
import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { getImageUrl } from '@/utils/helpers';

export default function ImageUpload({ value, onChange, maxCount = 1 }) {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: '-1',
          name: 'current-image',
          status: 'done',
          url: getImageUrl(value),
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const firstFile = newFileList[0];

    if (firstFile?.originFileObj) {
      onChange?.(firstFile.originFileObj);
    } else if (newFileList.length === 0) {
      onChange?.(null);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    onChange?.(null);
    return true;
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      beforeUpload={() => false}
      maxCount={maxCount}
      accept="image/*"
      className="hide-tooltips"
    >
      {fileList.length < maxCount && '+ Upload'}
    </Upload>
  );
}
