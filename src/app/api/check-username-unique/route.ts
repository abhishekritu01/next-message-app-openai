import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";



//query schema
const UsernameQuerySchema = z.object({
    username: usernameValidation,
});


export async function GET(request: Request) {
    console.log(`Recived request with method ${request.method} and url ${request.url}`)

    //for page route
    // if (request.method !== "GET") {
    //     return Response.json({
    //         success: false,
    //         message: "we only accept GET request"
    //     }, { status: 405 });
    // }

    await dbConnect();
    try {
        // get data from url  https://example.com/api/check-username-unique?username=abc
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        //validate query with zod schema
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const errorUserName = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: errorUserName
            }, { status: 400 });
        }


        const { username } = result.data;
        console.log("username", username);

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 });

    } catch (error) {
        console.log("Error in check-username-unique route", error);
        return Response.json({
            sussess: false,
            message: "Error in check-username-unique route"
        }, { status: 500 });
    }
}

