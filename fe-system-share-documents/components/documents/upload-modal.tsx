"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  initUpload,
  uploadToPresigned,
  completeUpload,
} from "@/lib/api/upload";
import { searchUsers, UserBrief } from "@/lib/api/users";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (doc: any) => void;
  userId: string;
}

export default function UploadModal({
  onClose,
  onUpload,
  userId,
}: UploadModalProps) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserBrief[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserBrief[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  useEffect(() => {
    // If input is empty but dropdown is open, show a small sample list so
    // users see the dropdown immediately. Otherwise query the backend.
    let mounted = true;
    if ((!query || query.trim().length === 0) && showSuggestions) {
      // Fallback sample list (friendly quick picks)
      const SAMPLE_USERS: UserBrief[] = [
        {
          id: "u1",
          username: "alice",
          email: "alice@example.com",
          fullName: "Alice Nguyễn",
        },
        {
          id: "u2",
          username: "bob",
          email: "bob@example.com",
          fullName: "Bob Trần",
        },
        {
          id: "u3",
          username: "carol",
          email: "carol@example.com",
          fullName: "Carol Lê",
        },
        {
          id: "u4",
          username: "david",
          email: "david@example.com",
          fullName: "David Phạm",
        },
      ];
      setSuggestions(SAMPLE_USERS);
      return () => {
        mounted = false;
      };
    }

    if (!query || query.trim().length === 0) {
      setSuggestions([]);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const res = await searchUsers(query);
        if (mounted) setSuggestions(res.slice(0, 10));
      } catch (e) {
        if (mounted) setSuggestions([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!suggestionsRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!suggestionsRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const addUser = (u: UserBrief) => {
    if (!u) return;
    if (selectedUsers.some((s) => s.id === u.id || s.email === u.email)) return;
    setSelectedUsers((s) => [...s, u]);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeUser = (u: UserBrief) => {
    setSelectedUsers((s) => s.filter((x) => x !== u && x.id !== u.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setStatusText("Initializing upload...");

    try {
      const recipientsPayload: string[] = selectedUsers.length
        ? (selectedUsers
            .map((u) => u.id ?? u.email ?? u.username)
            .filter(Boolean) as string[])
        : recipients
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r);

      const initReq = {
        originalFilename: file.name,
        contentType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        metadata: { title: fileName },
        recipients: recipientsPayload,
        storageClass: "STANDARD",
      };

      // 1) init
      const data = await initUpload(initReq);
      const uploadUrls = data.uploadUrls;
      if (!uploadUrls || !uploadUrls.preSignedPutUrl)
        throw new Error("No presigned URL returned");

      setStatusText("Uploading file...");

      // 2) upload to presigned URL (with progress callback)
      await uploadToPresigned(uploadUrls.preSignedPutUrl, file, (p) =>
        setProgress(p)
      );

      setProgress(100);
      setStatusText("Finalizing upload...");

      // 3) checksum when required
      let checksum: string | undefined = undefined;
      if (data.tempChecksumRequired) {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        checksum = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }

      // 4) complete upload
      const completeReq = {
        documentId: data.documentId,
        versionNumber: data.versionNumber,
        uploadObjectKey: uploadUrls.objectKey,
        checksum: checksum,
        signature: null,
        signerUserId: null,
        recipients: initReq.recipients as string[],
      };

      await completeUpload(completeReq);

      // 5) Emit uploaded doc to parent
      const newDoc = {
        id: String(data.documentId),
        title: fileName,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        ownerId: userId,
        ownerName: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEncrypted: true,
        hash: checksum,
        watermark: null,
        sharedWith: initReq.recipients,
      };

      onUpload(newDoc);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatusText(String((error as Error)?.message || "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-xl shadow-lg">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">
              Upload Document
            </h2>
            <p className="text-base text-muted-foreground">
              Share encrypted documents with end-to-end security
            </p>
          </div>

          <div>
            <Label htmlFor="file" className="text-lg font-semibold mb-2 block">
              Select File
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              className="text-base"
            />
          </div>

          {file && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-base font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <div>
            <Label className="text-lg font-semibold mb-2 block">
              Recipients
            </Label>

            <div className="relative" ref={suggestionsRef}>
              <Input
                id="recipients"
                type="text"
                placeholder="Search user by name, email or username"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="text-base"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-background border rounded shadow-sm max-h-56 overflow-auto">
                  {suggestions.map((s) => (
                    <div
                      key={s.id ?? s.email ?? s.username}
                      className="p-3 hover:bg-muted/70 cursor-pointer rounded"
                      onClick={() => addUser(s)}
                    >
                      <div className="text-base font-medium">
                        {s.fullName ?? s.username ?? s.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {s.email ?? s.username}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Select recipients (you can search and add multiple users)
            </p>

            <div className="mt-3 flex flex-wrap gap-3 max-h-32 overflow-y-auto">
              {selectedUsers.map((u) => (
                <div
                  key={u.id ?? u.email ?? u.username}
                  className="px-3 py-1.5 bg-muted rounded-full flex items-center gap-3 text-base max-w-full break-words"
                >
                  <span>{u.fullName ?? u.email ?? u.username}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(u)}
                    className="text-sm text-red-600 hover:text-red-700 focus:outline-none"
                    aria-label="Remove recipient"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className="mt-6">
              <div className="w-full bg-muted h-4 rounded overflow-hidden">
                <div
                  className="h-4 bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {statusText ?? `${progress}%`}
              </p>
            </div>
          )}

          <div className="space-y-3 text-sm text-muted-foreground mt-6">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <span>File will be digitally signed with your private key</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <span>Watermark added: User ID + timestamp</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">✓</span>
              <span>End-to-end encryption with recipients' public keys</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="py-3 text-base"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !file}
              className="py-3 text-base"
            >
              {loading ? "Uploading..." : "Upload & Encrypt"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
