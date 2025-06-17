import { CategoriesEndpoint } from "../apis/categories.api";
import request from "../config/request";

interface BaseResponse {
  totalData: number;
  currentPage: number;
  totalPages: number;
}

interface CategoryResponse {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse extends BaseResponse {
  data: CategoryResponse[];
}

interface CategoriesPostRequest {
  name: string;
}

interface CategoriesPutRequest {
  id: string;
  name: string;
}

const CategoriesService = {
  get: (): Promise<CategoriesResponse> => {
    return request({
      url: CategoriesEndpoint.get(),
      method: "GET",
      params: {
        limit: 9999,
      },
    });
  },
  post: ({ name }: CategoriesPostRequest): Promise<CategoriesResponse> => {
    return request({
      url: CategoriesEndpoint.post(),
      method: "POST",
      data: {
        name,
      },
    });
  },
  put: ({ id, name }: CategoriesPutRequest): Promise<CategoriesResponse> => {
    return request({
      url: CategoriesEndpoint.put(id),
      method: "PUT",
      data: {
        name,
      },
    });
  },
  delete: (id: string): Promise<CategoriesResponse> => {
    return request({
      url: CategoriesEndpoint.delete(id),
      method: "DELETE",
    });
  },
};

export { CategoriesService };
export type { CategoriesResponse, CategoriesPostRequest };
