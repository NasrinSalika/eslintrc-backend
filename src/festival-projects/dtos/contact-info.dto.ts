import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateIf, IsUrl, IsMongoId, IsNumber, IsArray, IsEmail, IsObject, IsNotEmptyObject, IsDateString, IsDefined, ValidateNested } from "class-validator";
import { Transform, Type } from 'class-transformer';
import * as moment from "moment";

class Address {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    street: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    state: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    postalCode: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    country: string

}

export class AddContactInfoDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    phoneNumber: number

    @IsDefined()
    @IsOptional()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Address)
    address: Address

    @IsNotEmpty()
    @Transform(({ value }) => moment(new Date(value)).format())
    @IsDateString()
    birthDate: Date;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsNumber()
    @IsNotEmpty()
    screenId: number
}