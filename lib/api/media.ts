import { http } from "./http";

export type MediaUploadResult = {
  url: string;
  path: string;
};

/**
 * POST /media/upload — multipart `file` field; returns public image URL.
 */
export async function uploadMealImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await http.post<MediaUploadResult>("/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
}
