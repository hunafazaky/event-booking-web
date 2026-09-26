import { api } from "../lib/api";
import type { Tag } from "../types/tag";

export const tagsApi = {
  list: () => api.get<Tag[]>("/tags", false),
};
