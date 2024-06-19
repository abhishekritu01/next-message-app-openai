
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { User } from "next-auth";


//query schema
const AcceptMessageQuerySchema = z.object({
    username: z.string(),
    message: z.string(),
});

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user
    // console.log("session", session);

    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }


    const userId = user._id;
    const { acceptingMessage } = await request.json();


    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $push: { acceptingMessage } }, { new: true });

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status in accept-message route"
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "Message accepted successfully",
            updatedUser //return updated user
        }, { status: 200 });






    } catch (error) {
        console.log("Error in check-username-unique route", error);
        return Response.json({
            sussess: false,
            message: "Failed to update user status in accept-message route"
        }, { status: 500 });
    }







}




export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user
    // console.log("session", session);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessages,
            message: "User found",
            user: foundUser
        }, { status: 200 });

    } catch (error) {
        console.log("Error in check-username-unique route", error);
        return Response.json({
            sussess: false,
            message: "Failed to get user status in accept-message route"
        }, { status: 500 });

    }



}



