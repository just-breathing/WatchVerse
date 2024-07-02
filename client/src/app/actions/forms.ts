"use server"
import { PrismaClient } from '@prisma/client';


import {createSession, deleteSession} from "../utils/session";
import { redirect } from "next/navigation";

const bcrypt = require('bcrypt');
const saltRounds = 10;

const prisma = new PrismaClient();



export async function handleSignUp(formData: FormData) {
    const { email, password } = Object.fromEntries(formData.entries());
    console.log(email, password);
    console.log(email, password);
    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
    const userExists = await prisma.user.findFirst({
        where: {
            email: email.toString(),
        },
    });
    console.log(`userExists : ${userExists}`);
    
    if (userExists) {
        return {msg:`User already exists`}
    }
    else
    {

    const user = await prisma.user.create({
        data: {
            email: email.toString(),
            password: hashedPassword.toString(),
        },
    });
    const userId = user.id.toString();
    await createSession(userId);  
    redirect('/upload')
    }
}

export async function handleSignIn(formData: FormData)
{
    const { email, password } = Object.fromEntries(formData.entries());
    const userExists = await prisma.user.findFirst({
        where: {
            email: email.toString(),
        },
    });

    if (!userExists) {
        return { msg: 'User not found' }
    }
    const passwordMatch = await bcrypt.compare(password.toString(), userExists.password);
    if (!passwordMatch) {
        return { msg: 'Password incorrect' }
    }
        const userId = userExists.id.toString();
        await createSession(userId);  
        redirect('/upload')


}

export async function handlelogout() {
   await deleteSession();
  }
