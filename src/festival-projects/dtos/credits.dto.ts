import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsNumber, IsArray, IsDefined, ValidateNested, ArrayNotEmpty } from "class-validator";
import { Type } from 'class-transformer';

class Structure {
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsOptional()
    @IsString()
    middleName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsOptional()
    @IsString()
    credits: string

}

export class AddCreditsDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsOptional()
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> Structure)
    directors: Structure[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> Structure)
    writers: Structure[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> Structure)
    producers: Structure[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> Structure)
    keyCasts: Structure[]

    @IsNumber()
    @IsNotEmpty()
    screenId: number
}