import { IsString, IsNotEmpty } from "class-validator";

export class CreateFocusDto {
    @IsString()
    @IsNotEmpty()
    focusName: string;
}