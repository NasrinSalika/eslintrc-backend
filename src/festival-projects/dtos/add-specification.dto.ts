import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateIf, IsUrl, IsMongoId, IsNumber, IsArray, IsObject, ValidateNested, IsDateString, isNotEmpty, IsNotEmptyObject, ArrayNotEmpty } from "class-validator";
import { FestivalProjectCategory } from "../models/project-category.schema";
import { Transform, Type } from 'class-transformer';
import * as moment from "moment";

class Runtime {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    hours: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    min: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    sec: string
};

class Budget {
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    currency: string
};

class Screening {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    country: string

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    screeningDate: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    premiere: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    awards: string
};

class CountryList {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    country: string

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    mediaRights: []
};

class Distribution {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    type: string

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> CountryList)
    countryList: CountryList[]
}

export class AddSpecificationDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsMongoId({ each: true })
    projectCategory: FestivalProjectCategory[]

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    genres: []

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Runtime)
    runtime: Runtime

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    completionDate: Date;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Budget)
    budget: Budget

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    countryOfOrigin: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    countryOfFilming: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    languages: []

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    shootingFormat: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    aspectRatio: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    filmColour: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    studentProject: boolean;

    @ValidateIf(value => value.studentProject == true)
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    schoolName: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    firstTimeFilmMaker: boolean;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    numberOfPages: number

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    firstTimeScreenWriter: boolean;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Runtime)
    musicLength: Runtime

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    dateTaken: Date;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    camera: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    Lens: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    foucsLength: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    shutterSpeed: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    aperture: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    isoFilm: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> Screening)
    screeningAndAwards: Screening[]
    
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Distribution)
    distributionInfo: Distribution
    

    @IsNumber()
    @IsNotEmpty()
    screenId: number
}