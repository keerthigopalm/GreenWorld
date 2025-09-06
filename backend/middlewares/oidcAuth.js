import { createRemoteJWKSet, jwtVerify } from "jose";

const ISSUER = process.env.OIDC_ISSUER;
const AUDIENCE = process.env.OIDC_AUDIENCE;
const JWKS = createRemoteJWKSet(new URL(process.env.OIDC_JWKS_URI));

export const requireAuth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing Bearer token" });

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    // Attach safe identity to request (use standard OIDC claims)
    req.user = {
      sub: payload.sub,                        // stable IdP subject
      username: payload.preferred_username || payload.nickname || payload.email,
      email: payload.email,
      name: payload.name,
      roles: payload.roles || payload["https://roles"] || [], // depends on IdP mapping
      country: payload.country || payload["https://country"],
    };

    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

// Optional admin check if you issue a “roles” claim in IdP
export const requireAdmin = (req, res, next) => {
  const roles = req.user?.roles || [];
  if (roles.includes("admin")) return next();
  return res.status(403).json({ message: "Admin only" });
};
