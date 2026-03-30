"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [passphrase, setPassphrase] = useState("my-secure-passphrase-123"); // mock
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const router = useRouter();

  const publicKey = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----`;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
      return;
    }

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    setUser({ id: userId, name: userName });
    setFullName(userName || "");
    setEmail(userName ? `${userName}@example.com` : "");
  }, [router]);

  const handleSaveProfile = () => {
    if (fullName) {
      localStorage.setItem("userName", fullName);
      alert("Profile updated successfully");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!user) return null;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and security
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="fullName">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Encryption Keys */}
        <Card>
          <CardHeader>
            <CardTitle>Encryption Keys</CardTitle>
            <CardDescription>
              Manage your public/private key pair
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passphrase */}
            <div>
              <Label>🗝️ Key</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                >
                  {showPassphrase ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(passphrase)}
                >
                  <Copy size={18} />
                </Button>
              </div>
            </div>

            {/* Public Key */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">
                Public Key
              </p>

              <div className="relative">
                <pre className="text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">
                  {showPublicKey
                    ? publicKey
                    : "••••••••••••••••••••••••••••••••••"}
                </pre>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                    className="bg-transparent"
                  >
                    {showPublicKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(publicKey)}
                    className="bg-transparent"
                  >
                    <Copy size={18} />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              🔄 Regenerate Key Pair
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              🔐 Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
