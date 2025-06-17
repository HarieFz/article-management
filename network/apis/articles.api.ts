export const ArticlesEndpoint = {
  post: () => "/articles",
  get: () => "/articles",
  getByID: (id: string) => `/articles/${id}`,
  put: (id: string) => `/articles/${id}`,
  delete: (id: string) => `/articles/${id}`,
};
