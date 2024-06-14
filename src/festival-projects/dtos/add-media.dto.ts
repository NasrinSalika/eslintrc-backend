import { IsString, IsNotEmpty, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class AddMediaDto {

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    media: Types.ObjectId;


    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    projectId: string;
}