import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, IsNotEmptyObject, IsDefined, ValidateNested, IsBoolean } from "class-validator";
import { Category } from "../models/category.schema"; 
import { FestivalFiles } from "../models/files.schema";

class RunTime {
    @IsNotEmpty()
    @IsNumber()
    minMin: number;
    
    @IsNotEmpty()
    @IsNumber()
    maxMin: number
}

class Track {
    @IsString()
    @IsNotEmpty()
    prefix: string

    @IsString()
    @IsNotEmpty()
    startingNo: string
}

export class CreateEventSettingsDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string
    
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsMongoId({ each: true})
    categorySearch: Category[]

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsMongoId({ each: true})
    festivalFocus: Category[]

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    searchTerms: []

    @IsOptional()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => RunTime)
    runtime: RunTime;

    @IsOptional()
    @IsBoolean()
    allLengthAccepted: boolean;

    @IsString()
    @IsNotEmpty()
    listingUrl: string;

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    listingVisibility: boolean;

    @IsOptional()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Track)
    trackingSequence: Track

    @IsNumber()
    @IsNotEmpty()
    screenId: number
    
}