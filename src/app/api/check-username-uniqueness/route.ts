import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema";
import { messageSchema } from "@/schemas/messageSchema";

//We are validating username using zod
const usernameQueryScehma = z.object({
    username: userNameValidation
})


export async function GET(req: Request) {
    await dbConnect()

    try {
        //getting the username from query parameters
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        //validate username using zod
        const result = usernameQueryScehma.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(",") : "Invalid query params"
                },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status: 200
            }
        )
    }
    catch (err) {
        return Response.json(
            {
                success: false,
                message: "Error while checking username"
            },
            {
                status: 500
            }
        )
    }
}