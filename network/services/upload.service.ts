import { UploadEndpoint } from "../apis/upload.api";
import request from "../config/request";

interface UploadResponse {
  imageUrl: string;
}

const UploadService = {
  post: (image: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("image", image);
    return request({
      url: UploadEndpoint.upload(),
      method: "POST",
      data: formData,
    });
  },
};

export { UploadService };
export type { UploadResponse };
