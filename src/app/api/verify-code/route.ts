import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import { usernameValidation } from "@/schemas/signUpSchema";
// import { z } from "zod";


export async function POST(request: Request) {
    await dbConnect();


    try {
        const { username, code } = await request.json();

        const decodedUserName = decodeURIComponent(username);

        const User = await UserModel.findOne({ username: decodedUserName });

        if (!User) {
            return Response.json({
                success: false,
                message: "Username does not exist"
            }, { status: 400 });
        }
        const iscodeValid = await User.verifyCode === code;
        const isCodeNotExpired = new Date(User.verifyCodeExpirey) > new Date();

        if (iscodeValid && isCodeNotExpired) {
            User.isVerified = true;
            await User.save();
            return Response.json({
                success: true,
                message: "Account verified"
            }, { status: 200 });

        } else if (!isCodeNotExpired) {

            return Response.json({
                success: false,
                message: "Code has expired,pelase request a new code"
            }, { status: 400 });



        } else {

            return Response.json({
                success: false,
                message: "Invalid code"
            }, { status: 400 });
        }






    } catch (error) {
        console.log("Error in check-username-unique route", error);
        return Response.json({
            sussess: false,
            message: "Error in check-username-unique route"
        }, { status: 500 });
    }



}