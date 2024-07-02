"use server"
import { SignJWT, jwtVerify } from 'jose';



const pvkey=process.env.JWT_SECRET_KEY
const key = new TextEncoder().encode(pvkey);

type SessionData= {
    userId: string;
    expires: Date;

  }
  

export async function encrypt(payload: SessionData) {
  try {
    const token = new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(payload.expires)
      .sign(key);
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error encrypting the session token");
  }
}

export async function decrypt(session: string) {
    const {payload} = await  jwtVerify(session, key,{
        algorithms: ['HS256']});
    return payload;
}
