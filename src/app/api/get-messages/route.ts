// we can get user from the already existing session 
import { getServerSession } from 'next-auth/next';
// the session requires authoptions to run
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnection';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false, message: 'Not authenticated'
            },
            {
                status: 401
            }
        );
    }

    //we did this because the user._id was a string and when in aggregation piplines string is not allowed thus we have to convert it to mongoose object
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]).exec()

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false, message: 'User not found'
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        );


    }
    catch (err) {
        console.log(err)
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}