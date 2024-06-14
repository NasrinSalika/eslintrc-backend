import { IsString, IsNotEmpty } from "class-validator";

export class AddStatusTypeDto {
    @IsString()
    @IsNotEmpty()
    statusName: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    color: string;
}