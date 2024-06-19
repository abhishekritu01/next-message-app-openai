
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import UserModel from "@/model/User";
import { z } from "zod";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {

        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        //is user accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User not accepting messages"
            }, { status: 403 });
        }

        //create message
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });

    } catch (error) {
        console.log("Error in send-message route", error);
        return Response.json({
            success: false,
            message: "Failed to send message"
        }, { status: 500 });

    }


}


