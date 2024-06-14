import { IsString, IsNotEmpty } from "class-validator";

export class CreateEventtDto {
    @IsString()
    @IsNotEmpty()
    eventName: string;
}