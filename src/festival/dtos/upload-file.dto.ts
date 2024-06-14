import { IsString, IsNotEmpty } from "class-validator";

export class UploadFileDto {
    // @IsNotEmpty()
    file: any;

    @IsString()
    @IsNotEmpty()
    fileType: string;
}