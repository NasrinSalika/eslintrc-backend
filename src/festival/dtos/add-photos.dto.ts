import { IsString, IsNotEmpty, IsMongoId } from "class-validator";
import { FestivalFiles } from "../models/files.schema";
import { Festivals } from "../models/festival.schema";
import { Types } from "mongoose";

export class AddPhotoDto {

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    photo: Types.ObjectId;


    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    festivalId: string;
}