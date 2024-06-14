import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, IsNotEmptyObject, IsEmail, IsBoolean, ValidateIf, IsUrl, IsPhoneNumber, ValidateNested } from "class-validator";

class Address {
    @IsNotEmpty()
    @IsString()
    title: string

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

export class CreateVenueDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    website: string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsOptional()
    @IsNumber()
    // @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: number

    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    address: object;

    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    socialMediaLinks: object;

    @IsOptional()
    @IsBoolean()
    isSubmissionAddress: boolean;

    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    submissionAddresss: object

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=> Address)
    eventVenue: Address[]

    @IsNumber()
    @IsNotEmpty()
    screenId: number
    
}