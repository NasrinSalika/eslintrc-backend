import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsBoolean, IsNumber, IsArray } from "class-validator";
import { Types } from "mongoose";

export class SignContractDto {
    @IsString()
    @IsNotEmpty()
    contractId: string;

    @IsNotEmpty()
    @IsArray()
    formData: []

    @IsArray()
    images: []
}
