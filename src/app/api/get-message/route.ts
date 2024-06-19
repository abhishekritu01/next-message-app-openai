import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { User } from "next-auth";
import mongoose from "mongoose";


//get message query 

export async function GET(request: Request) {

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]);

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "Failed to get user messages"
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "Messages fetched successfully",
            messages: user[0].messages
        }, { status: 200 });



    } catch (error) {

    }






}