import { IsString, IsNotEmpty, IsMongoId, IsBoolean } from "class-validator";
import { Types } from "mongoose";

export class ApprovedDto {

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    festivalId: string;


    @IsBoolean()
    @IsNotEmpty()
    isApproved: boolean;
}