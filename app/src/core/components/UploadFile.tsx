import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import { FC, useState } from "react";
import api from "src/core/lib/api";
import ImgCrop from "antd-img-crop";
import { notify } from "src/core/utils/notify";

export enum ATTACHMENT_TYPE {
  ACCOUNT_AVATAR = "ACCOUNT_AVATAR",
  APPLICATION_AVATAR = "APPLICATION_AVATAR"
}

interface Props {
  onChange?: (value: string) => void;
  currentFileUrl?: string;
  type: ATTACHMENT_TYPE;
  disabled?: boolean;
}

export const UploadFile: FC<Props> = ({ onChange, currentFileUrl, type, disabled }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notify.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 0.2;
    if (!isLt2M) {
      notify.error("Image must smaller than 200kb!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = ({ file }) => {
    if (file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (file.status === "removed") {
      return;
    }

    if (file.status === "done") {
      setLoading(false);
      return;
    }
  };

  const handleFileUpload = async ({ file, onSuccess = null, onError = null }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response: { url: string; success: boolean } = await api.post(
        `/api/attachments/upload?type=${type}`,
        formData
      );

      onSuccess(response, file);
      onChange(response.url);

      notify.success(`${file.name} file uploaded successfully`);
    } catch (error) {
      notify.error(`${file.name} file upload failed`);
      onError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Add</div>
    </div>
  );

  return (
    <ImgCrop rotate>
      <Upload
        name="file"
        disabled={disabled}
        listType="picture-card"
        className="single-file-upload"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={(params) => handleFileUpload(params)}
      >
        {currentFileUrl ? (
          <img src={currentFileUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};
