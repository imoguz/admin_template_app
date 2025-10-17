'use client';
import React, { useState } from 'react';
import { Upload } from 'antd';

export default function ImageUpload({ value, onChange, maxCount = 1 }) {
  const [fileList, setFileList] = useState(
    value
      ? [
          {
            uid: '-1',
            name: 'image',
            status: 'done',
            url: value,
          },
        ]
      : []
  );

  const handleChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    if (file.originFileObj) {
      onChange?.(file.originFileObj);
    } else if (newFileList.length === 0) {
      onChange?.(null);
    }
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      onPreview={handlePreview}
      maxCount={maxCount}
      className="hide-tooltips"
    >
      {fileList.length < maxCount && '+ Upload'}
    </Upload>
  );
}
