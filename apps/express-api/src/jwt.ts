import {jwtVerify, KeyLike, SignJWT} from 'jose';
import type {JWTVerifyResult} from "jose/dist/types/types";
import {AccessTokenPayload, IDTokenPayload, JWTPayloadType, RefreshTokenPayload} from "@hsb-dbweb/shared";


export class JwtManager {
  private readonly secret: Uint8Array | KeyLike;
  private issuer: string;
  private audience: string;

  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret)
    this.issuer = 'hsb-dbweb-api'
    this.audience = 'hsb-dbweb-app'
  }

  async createRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const jwt = new SignJWT(payload)
    return jwt.setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime('7d')
      .sign(this.secret)
  }

  async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    const jwt = new SignJWT(payload)
    return jwt.setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime('15m')
      .sign(this.secret)
  }

  async createIdToken(payload: IDTokenPayload): Promise<string> {
    const jwt = new SignJWT(payload)
    return jwt.setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime('15m')
      .sign(this.secret)
  }

  async verifyToken<T extends JWTPayloadType = JWTPayloadType>(token: string): Promise<JWTVerifyResult & {
    payload: T
  }> {
    return jwtVerify(token, this.secret) as Promise<JWTVerifyResult & { payload: T }>;
  }

  async getUserIdFromToken(token: string): Promise<string> {
    const {payload} = await this.verifyToken<AccessTokenPayload>(token)
    return payload.uid
  }

}
