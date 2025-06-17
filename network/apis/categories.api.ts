export const CategoriesEndpoint = {
  post: () => "/categories",
  get: () => "/categories",
  put: (id: string) => `/categories/${id}`,
  delete: (id: string) => `/categories/${id}`,
};
