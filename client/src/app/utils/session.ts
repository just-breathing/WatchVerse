"use server";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "./token";
import { redirect } from "next/navigation";

const time=60*60*1000;
const expire = new Date(+Date.now() + (time));

export const getCookie = async() => {
    const cookieName = process.env.COOKIE_NAME;
    if (!cookieName) {
        console.error("COOKIE_NAME environment variable is not set");
        return null;
    }
    const cookie = cookies().get(cookieName);
    if (!cookie) {
        console.error("Cookie not found");
        return null;
    }
    return cookie.value;
}


export  async function createSession(userId: string) {
    const token = await encrypt({userId, expires:expire});             
    if (process.env.COOKIE_NAME) {
        cookies().set(process.env.COOKIE_NAME, token, {
            expires: expire,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
    } else {
        console.error("COOKIE_NAME is undefined");
    }
}

export async function deleteSession() {
    if (process.env.COOKIE_NAME) {
        cookies().delete(process.env.COOKIE_NAME);
    } else {
        console.error("COOKIE_NAME is undefined");
    }
    redirect('/signin');
}

export async function getSession() {
    if (process.env.COOKIE_NAME) {
        const cookie = cookies().get(process.env.COOKIE_NAME);
        if (cookie) {
            return await decrypt(cookie.value);
        }
    } else {
        console.error("COOKIE_NAME is undefined");
    }
}


// export async function verifySession() {
//   const cookie = cookies().get('session')?.value;
//   const session = await decrypt(cookie);

//   if (!session?.userId) {
//     redirect('/login');
//   }

//   return { isAuth: true, userId: Number(session.userId) };
// }

// export async function updateSession() {
//   const session = cookies().get('session')?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) {
//     return null;
//   }

//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   cookies().set('session', session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: 'lax',
//     path: '/',
//   });
// }

