export const getFirstLetter = (name: string | undefined): string => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};
