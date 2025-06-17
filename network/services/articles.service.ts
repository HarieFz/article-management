import { ArticlesEndpoint } from "../apis/articles.api";
import request from "../config/request";

interface BaseResponse {
  limit: number;
  page: number;
  total: number;
}

interface ArticleParams {
  limit?: number;
  page?: number;
  category?: string;
  title?: string;
}

interface ArticleResponse {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    username: string;
  };
}

interface ArticlesResponse extends BaseResponse {
  data: ArticleResponse[];
}

interface ArticlesPostRequest {
  title: string;
  content: string;
  categoryId: string;
  imageUrl: string | undefined;
}

interface ArticlesPutRequest {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  imageUrl: string | undefined;
}

const ArticlesService = {
  get: ({ limit, page, category, title }: ArticleParams): Promise<ArticlesResponse> => {
    return request({
      url: ArticlesEndpoint.get(),
      method: "GET",
      params: {
        limit,
        page,
        category,
        title,
      },
    });
  },
  getByID: ({ id }: { id: string }): Promise<ArticleResponse> => {
    return request({
      url: ArticlesEndpoint.getByID(id),
      method: "GET",
    });
  },
  post: ({ title, content, categoryId, imageUrl }: ArticlesPostRequest): Promise<ArticlesResponse> => {
    return request({
      url: ArticlesEndpoint.post(),
      method: "POST",
      data: {
        title,
        content,
        categoryId,
        imageUrl,
      },
    });
  },
  put: ({ id, title, content, categoryId, imageUrl }: ArticlesPutRequest): Promise<ArticlesResponse> => {
    return request({
      url: ArticlesEndpoint.put(id),
      method: "PUT",
      data: {
        title,
        content,
        categoryId,
        imageUrl,
      },
    });
  },
  delete: (id: string): Promise<ArticlesResponse> => {
    return request({
      url: ArticlesEndpoint.delete(id),
      method: "DELETE",
    });
  },
};

export { ArticlesService };
export type { ArticlesResponse, ArticlesPostRequest };
