import { IsString, IsNotEmpty } from "class-validator";

export class CreateProjectTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}