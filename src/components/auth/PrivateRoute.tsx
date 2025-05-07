import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MFAMethod } from "@/lib/auth/mfa";
import { Smartphone, Mail, QrCode, AlertCircle, Shield } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  mfaRequired?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole,
  mfaRequired = false,
}) => {
  const auth = useAuth();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [activeMethod, setActiveMethod] = useState<MFAMethod | "backup">(
    "authenticator",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if the session is valid
  const isSessionValid = auth.checkSession();

  // Determine if MFA verification is needed
  const needsMfaVerification =
    isSessionValid &&
    auth.mfaRequired &&
    !auth.mfaVerified &&
    (mfaRequired || auth.mfaRequired);

  // Handle MFA verification
  const handleVerifyMfa = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await auth.verifyMfa(activeMethod, verificationCode);
      if (!success) {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setVerificationCode("");
    }
  };

  // If not authenticated, redirect to login
  if (!isSessionValid) {
    return (
      <Navigate to="/CAPTIVITE-X/login" state={{ from: location }} replace />
    );
  }

  // If role is required, check if user has the role
  if (requiredRole && auth.user?.role !== requiredRole) {
    return <Navigate to="/CAPTIVITE-X/unauthorized" replace />;
  }

  // If MFA verification is needed, show the verification form
  if (needsMfaVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Verification Required</h2>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <p className="text-muted-foreground mb-6">
            For your security, this page requires additional verification.
          </p>

          <Tabs
            value={activeMethod}
            onValueChange={(value) =>
              setActiveMethod(value as MFAMethod | "backup")
            }
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="authenticator" disabled={loading}>
                <QrCode className="mr-2 h-4 w-4" />
                App
              </TabsTrigger>
              <TabsTrigger value="email" disabled={loading}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" disabled={loading}>
                <Smartphone className="mr-2 h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="backup" disabled={loading}>
                Backup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="authenticator" className="space-y-4 pt-4">
              <p className="text-sm">
                Enter the code from your authenticator app
              </p>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 pt-4">
              <p className="text-sm">We've sent a code to your email address</p>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 pt-4">
              <p className="text-sm">We've sent a code to your phone</p>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4 pt-4">
              <p className="text-sm">Enter one of your backup codes</p>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4">
            <Label htmlFor="verification-code">
              {activeMethod === "backup" ? "Backup Code" : "Verification Code"}
            </Label>
            <Input
              id="verification-code"
              placeholder={
                activeMethod === "backup"
                  ? "Enter backup code"
                  : "Enter 6-digit code"
              }
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleVerifyMfa}
            disabled={loading || !verificationCode}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => auth.logout()}
          >
            Cancel and Sign Out
          </Button>
        </Card>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;
