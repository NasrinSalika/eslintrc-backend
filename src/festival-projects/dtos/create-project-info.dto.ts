import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateIf, IsUrl, IsMongoId, IsNumber, IsArray } from "class-validator";
import { ProjectTypes } from "../models/project-type.schema";

export class CreateProjectInfoDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsString()
    @IsNotEmpty()
    projectTitle: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    projectType: ProjectTypes

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    isAnotherLanguageTitle: boolean;

    @ValidateIf(value => value.isAnotherLanguageTitle == true)
    @IsString()
    @IsNotEmpty()
    aTitle: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    aDescription: string;

    @IsUrl()
    @IsOptional()
    @IsNotEmpty()
    website: string;

    @IsUrl()
    @IsOptional()
    @IsNotEmpty()
    twitter: string;

    @IsUrl()
    @IsOptional()
    @IsNotEmpty()
    facebook: string;

    @IsUrl()
    @IsOptional()
    @IsNotEmpty()
    instagram: string;

    @IsNumber()
    @IsNotEmpty()
    screenId: number
}