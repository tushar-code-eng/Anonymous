import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean,
    message: string,
    isAccpetingMessages?: boolean,
    messages?: Array<Message>
    status?: number
}