import { Message } from "../app/model/User"; 

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage? : boolean;
    messages? : Array<Message>

}