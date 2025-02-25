import { Router } from "express";
import {
  validateClient,
  validateClientCredentials,
  generateTokens,
} from "../oauth";

const router = Router();

interface AuthorizeQuery {
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
}

interface TokenRequest {
  code: string;
  client_id: string;
  client_secret: string;
}

const authorizeHandler = async (req: any, res: any) => {
  const query = req.query as Partial<AuthorizeQuery>;
  const { client_id, redirect_uri, scope, state } = query;

  if (!client_id) {
    return res.status(400).json({ error: "Missing client_id" });
  }

  try {
    const isValid = await validateClient(client_id);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid client" });
    }

    const authState = {
      client_id,
      redirect_uri,
      scope,
      state,
      timestamp: Date.now(),
    };

    return res.redirect(
      `/auth/consent?state=${encodeURIComponent(JSON.stringify(authState))}`,
    );
  } catch (error) {
    return res.status(500).json({ error: "Authorization failed" });
  }
};

const tokenHandler = async (req: any, res: any) => {
  const { code, client_id, client_secret } = req.body as Partial<TokenRequest>;

  if (!code || !client_id || !client_secret) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const isValid = await validateClientCredentials(client_id, client_secret);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid client credentials" });
    }

    const tokens = await generateTokens(code);
    return res.json({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_type: "Bearer",
      expires_in: 3600,
    });
  } catch (error) {
    return res.status(500).json({ error: "Token generation failed" });
  }
};

router.get("/authorize", authorizeHandler);
router.post("/token", tokenHandler);

export default router;
