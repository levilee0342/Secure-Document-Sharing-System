export interface InitUploadRequest {
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  metadata?: Record<string, any>;
  recipients?: string[];
  storageClass?: string;
}

export interface InitUploadResponseData {
  documentId: string;
  versionNumber: number;
  uploadUrls: {
    objectKey: string;
    preSignedPutUrl: string;
    uploadId?: string;
  };
  tempChecksumRequired?: boolean;
}

export async function initUpload(
  req: InitUploadRequest
): Promise<InitUploadResponseData> {
  const res = await fetch("/api/documents/upload/init-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`init-upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  // backend wraps response in ApiResponse -> { data: ... }
  return json.data as InitUploadResponseData;
}

export function uploadToPresigned(
  url: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && onProgress) {
        const percent = Math.round((ev.loaded / ev.total) * 100);
        onProgress(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error during file upload"));
    xhr.send(file);
  });
}

export interface CompleteUploadRequest {
  documentId: string;
  versionNumber: number;
  uploadObjectKey: string;
  checksum?: string | null;
  signature?: string | null;
  signerUserId?: string | null;
  recipients?: string[];
}

export async function completeUpload(req: CompleteUploadRequest): Promise<any> {
  const res = await fetch("/api/documents/upload/complete-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`complete-upload failed: ${res.status} ${text}`);
  }
  return res.json();
}
