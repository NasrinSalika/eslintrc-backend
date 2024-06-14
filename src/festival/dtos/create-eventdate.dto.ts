import { IsString, IsNotEmpty, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, IsNotEmptyObject, IsEmail, IsBoolean, ValidateIf, IsUrl, IsPhoneNumber, IsDate, MinDate, MaxDate, ValidateNested, IsDateString, IsDefined, isNotEmpty, ArrayNotEmpty } from "class-validator";
import { Transform, Type } from 'class-transformer';
import * as moment from "moment";

class Deadline {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    date: Date;
}

class EventDate {
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    fromDate: Date;
    
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    toDate: Date
}

export class CreateEventDateDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    openingDate: Date;
    
    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    notificationDate: Date;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => EventDate)
    eventDate: EventDate

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> Deadline)
    deadlines: Deadline[]

    @IsNumber()
    @IsNotEmpty()
    screenId: number
    
}