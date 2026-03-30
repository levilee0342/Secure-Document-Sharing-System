"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Document } from "@/types/document";

interface DocumentsListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function DocumentsList({
  documents,
  onDelete,
  onView,
  onShare,
}: DocumentsListProps): React.ReactElement {
  const formatDate = (date?: Date | string): string => {
    if (!date) return "-"; // Hoặc giá trị mặc định khác
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes: string[] = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = Math.round((bytes / Math.pow(k, i)) * 100) / 100;
    return `${size} ${sizes[i]}`;
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No documents yet
            </h3>
            <p className="text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
          uploaded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl">📄</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{doc.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                    <span>{formatSize(doc.fileSize)}</span>
                    <span>Uploaded: {formatDate(doc.createdAt)}</span>
                    <span>
                      Shared with {doc.sharedWith?.length ?? 0} user
                      {doc.sharedWith?.length !== 1 ? "s" : ""}
                    </span>

                    {doc.isEncrypted && (
                      <span className="text-accent">🔒 Encrypted</span>
                    )}
                    {doc.signature && (
                      <span className="text-accent">✓ Signed</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(doc.id)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(doc.id)}
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
