import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        console.log(username, email, password, "username, email, password---------------");

        // Logic to check if user already exists
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username: username,
            isVerified: true,
        });

        if (existingUserVerifiedByUserName) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username is already taken',
            }), {
                status: 400,
            });
        }

        const existingUserByEmail = await UserModel.findOne({
            email: email,
            // isVerified: true,
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            //todo
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'Email is already taken',
                }, {
                    status: 400,
                });
            } else {

                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpirey = new Date(Date.now() + 3600000); // 1 hour   
                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpirey: expiryDate,
                isAcceptingMessages: true,
                isVerified: false,
                messages: [],     // empty array of messages
            });
            await newUser.save();

            // send verification email
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message,
                }, {
                    status: 500,
                });
            }
        }
        return Response.json({
            success: true,
            message: 'User created successfully, please verify your email',
        }, { status: 201 });

    } catch (error) {
        console.error("Error in sign-up route", error)
        return new Response(JSON.stringify({
            status: 'error',
            message: 'error in sign-up route while creating user',
        }), {
            status: 500,
        });
    }
}



