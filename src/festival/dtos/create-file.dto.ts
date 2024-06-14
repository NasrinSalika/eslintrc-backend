import { IsString, IsNotEmpty, IsMongoId } from "class-validator";

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsMongoId()
    userId: string;
}