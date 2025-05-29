import { Call } from "@/model/Call";
import { Message } from "@/model/Message";

export interface APIResponse {
  success: boolean;
  message: string;
  messages?: Array<Message>;
  call?: Call;
}
