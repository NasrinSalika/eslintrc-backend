import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class AddCardDto {
    @IsString()
    @IsNotEmpty({ message: "Please provide a valid card number" })
    number: string;

    @IsNumber()
    @IsNotEmpty({ message: "Please provide a valid expiry month" })
    exp_month: number;

    @IsNumber()
    @IsNotEmpty({ message: "Please provide a valid expiry year" })
    exp_year: number;      

    @IsString()
    @IsNotEmpty({ message: "Please provide a valid cvv" })
    cvc: string

    @IsString()
    @IsNotEmpty({ message: "Please provide a valid name" })
    name: string
}