import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mfaService, MFAMethod } from "@/lib/auth/mfa";
import {
  Smartphone,
  Mail,
  QrCode,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

interface MFASetupProps {
  userId: string;
  onComplete?: (success: boolean) => void;
  onCancel?: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({
  userId,
  onComplete,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<MFAMethod>("authenticator");
  const [verificationCode, setVerificationCode] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [mfaConfig, setMfaConfig] = useState<any>(null);

  useEffect(() => {
    // Initialize MFA setup when component mounts or method changes
    const initSetup = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = await mfaService.setupMFA(userId, activeTab);
        setMfaConfig(config);
      } catch (err) {
        setError("Failed to initialize MFA setup. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initSetup();
  }, [userId, activeTab]);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await mfaService.verifySetup(
        userId,
        activeTab,
        verificationCode,
      );

      if (success) {
        // Get updated config to retrieve backup codes
        const updatedConfig = mfaService.getConfig(userId);
        if (updatedConfig?.backupCodes) {
          setBackupCodes(updatedConfig.backupCodes);
        }

        setSetupComplete(true);
        if (onComplete) {
          onComplete(true);
        }
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        setError("Failed to copy to clipboard");
      },
    );
  };

  const renderAuthenticatorSetup = () => {
    const secret = mfaConfig?.methods?.authenticator?.secret || "";

    return (
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
          <div className="mb-4 bg-white p-4 rounded-lg">
            <QrCode className="h-32 w-32 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code with your authenticator app
          </p>
        </div>

        <div className="space-y-2">
          <Label>Or enter this setup key manually:</Label>
          <div className="flex items-center gap-2">
            <Input value={secret} readOnly className="font-mono" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(secret)}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailSetup = () => {
    const email = mfaConfig?.methods?.email?.email || "";

    return (
      <div className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertTitle>Email Verification</AlertTitle>
          <AlertDescription>
            We've sent a verification code to {email}. Please check your inbox.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          If you don't receive the code within a few minutes, please check your
          spam folder or try another method.
        </p>
      </div>
    );
  };

  const renderSmsSetup = () => {
    const phoneNumber = mfaConfig?.methods?.sms?.phoneNumber || "";

    return (
      <div className="space-y-4">
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertTitle>SMS Verification</AlertTitle>
          <AlertDescription>
            We've sent a verification code to {phoneNumber}. Please check your
            phone.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground">
          Standard message and data rates may apply. If you don't receive the
          code within a few minutes, please try another method.
        </p>
      </div>
    );
  };

  const renderBackupCodes = () => {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Save your backup codes</AlertTitle>
          <AlertDescription>
            Store these codes in a safe place. Each code can only be used once.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="bg-muted p-2 rounded font-mono text-center"
            >
              {code}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => copyToClipboard(backupCodes.join("\n"))}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy all codes
        </Button>

        <p className="text-sm text-muted-foreground">
          You can use these codes to sign in if you lose access to your
          authentication device.
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {setupComplete
          ? "MFA Setup Complete"
          : "Set Up Multi-Factor Authentication"}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {setupComplete ? (
        <div className="space-y-6">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Setup Successful</AlertTitle>
            <AlertDescription>
              Multi-factor authentication has been enabled for your account.
            </AlertDescription>
          </Alert>

          {backupCodes.length > 0 && renderBackupCodes()}

          <Button
            className="w-full"
            onClick={() => onComplete && onComplete(true)}
          >
            Continue
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as MFAMethod)}
          >
            <TabsList className="grid grid-cols-3 w-full">
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
            </TabsList>

            <TabsContent value="authenticator" className="space-y-4 pt-4">
              {renderAuthenticatorSetup()}
            </TabsContent>

            <TabsContent value="email" className="space-y-4 pt-4">
              {renderEmailSetup()}
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 pt-4">
              {renderSmsSetup()}
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="Enter the 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleVerify}
              disabled={loading || !verificationCode}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MFASetup;
