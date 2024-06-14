import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, IsNotEmptyObject, ValidateNested } from "class-validator";
import { EventTypes } from "../models/eventType.schema";
import { FestivalFiles } from "../models/files.schema";
class EventOrganizer {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    name: string
}
export class CreateEventDetailsDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsString()
    @IsNotEmpty()
    eventName: string;
    
    @IsArray()
    @IsNotEmpty()
    @IsMongoId({ each: true})
    eventType: EventTypes[]

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    logo: FestivalFiles

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    yearsOfRunning: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    awardsAndPrices: string;

    @IsString()
    @IsNotEmpty()
    rulesAndTerms: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> EventOrganizer)
    eventOrganiser: EventOrganizer[]

    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    keyStats: object;

    @IsNumber()
    @IsNotEmpty()
    screenId: number
    
}