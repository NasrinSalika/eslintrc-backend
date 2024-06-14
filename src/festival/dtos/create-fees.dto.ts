import { IsString, IsNotEmpty, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, IsNotEmptyObject, IsEmail, IsBoolean, ValidateIf, IsUrl, IsPhoneNumber, IsDate, MinDate, MaxDate, ValidateNested, IsDateString, IsDefined, isNotEmpty, ArrayNotEmpty } from "class-validator";
import { Type } from 'class-transformer';

class Price {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    standard_fee: string

    @IsNotEmpty()
    @IsString()
    student_fee: string
}

class Category {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> Price)
    prices: Price[];
}

export class CreateEventFeesDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsString()
    @IsNotEmpty()
    currency: string

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> Category)
    pricingCategory: Category[];

    @IsNumber()
    @IsNotEmpty()
    screenId: number
    
}