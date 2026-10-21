import React, { useEffect, useState } from 'react';
import { Image, Modal, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { profileApi } from '../../features/profiles/services/profile.api';

interface AppUploadProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  maxCount?: number;
  accept?: string;
  maxSizeMb?: number;
  type?: 'profile' | 'avatar' | 'cover' | 'post' | 'story';
  showPreview?: boolean;
  showUploadList?: boolean;
  listType?: 'text' | 'picture' | 'picture-card' | 'picture-circle';
}

const getFileUrl = (response: Awaited<ReturnType<typeof profileApi.uploadFile>>['data']) =>
  response?.url || response?.fileUrl || response?.location || response?.data?.url || response?.data?.fileUrl || response?.data?.location;

export const AppUpload: React.FC<AppUploadProps> = ({
  value,
  onChange,
  multiple = false,
  maxCount,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMb = 5,
  type = 'profile',
  showPreview = true,
  showUploadList = true,
  listType = 'picture-card',
}) => {
  const [preview, setPreview] = useState<UploadFile | null>(null);
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const createFileList = (urls: string[]): UploadFile[] => urls.map((url, index) => ({
    uid: `existing-${index}-${url}`,
    name: `image-${index + 1}`,
    status: 'done',
    url,
    thumbUrl: url,
  }));
  const [fileList, setFileList] = useState<UploadFile[]>(() => createFileList(values));

  // Sync externally-managed URLs without interrupting an in-progress upload.
  useEffect(() => {
    if (!fileList.some(file => file.status === 'uploading')) {
      setFileList(createFileList(values));
    }
  }, [value]);

  const updateValue = (urls: string[]) => onChange?.(multiple ? urls : (urls[0] || ''));

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const allowedTypes = accept.split(',').map(type => type.trim()).filter(Boolean);
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      message.error(`Only ${allowedTypes.map(type => type.split('/')[1]).join(', ')} files are allowed.`);
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > maxSizeMb) {
      message.error(`File must be smaller than ${maxSizeMb} MB.`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest: UploadProps['customRequest'] = async ({ file, onError, onProgress, onSuccess }) => {
    try {
      const result = await profileApi.uploadFile(file as File, type, event => {
        if (event.total) onProgress?.({ percent: Math.round((event.loaded / event.total) * 100) });
      });
      const url = getFileUrl(result.data);
      if (!result.status || !url) throw new Error(result.error?.message || 'The uploaded file did not return a URL.');
      onSuccess?.({ url });
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'File upload failed.');
      onError?.(error instanceof Error ? error : new Error('File upload failed.'));
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: nextFileList }) => {
    setFileList(nextFileList);

    const urls = nextFileList
      .filter(file => file.status === 'done')
      .map(file => file.response?.url || file.url)
      .filter((url): url is string => Boolean(url));

    // Keep the uploading item in Ant Design's list. Updating the parent only
    // after completion prevents the controlled value from removing the file.
    if (nextFileList.some(file => file.status === 'done')) {
      updateValue(urls);
    }
  };

  return (
    <>
      <Upload
        accept={accept}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        fileList={fileList}
        listType={listType}
        multiple={multiple}
        maxCount={maxCount}
        showUploadList={showUploadList}
        onChange={handleChange}
        onPreview={showPreview ? file => setPreview(file) : undefined}
        previewFile={undefined}
        onRemove={file => {
          const urls = fileList
            .filter(item => item.uid !== file.uid && item.status === 'done')
            .map(item => item.response?.url || item.url)
            .filter((url): url is string => Boolean(url));
          setFileList(fileList.filter(item => item.uid !== file.uid));
          updateValue(urls);
          return true;
        }}
      >
        {(!maxCount || values.length < maxCount) && (
          <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
        )}
      </Upload>
      {showPreview && (
        <Modal open={Boolean(preview)} footer={null} onCancel={() => setPreview(null)}>
          {preview?.url && <Image src={preview.url} alt={preview.name} preview={false} style={{ width: '100%' }} />}
        </Modal>
      )}
    </>
  );
};
