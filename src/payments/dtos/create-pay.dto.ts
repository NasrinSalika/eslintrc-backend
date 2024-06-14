import { IsString, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";

export class CreatePayDto {
    @IsString()
    @IsNotEmpty({ message: "Please provide a cartId" })
    @IsMongoId()
    cartId: string;

    @IsNumber()
    @IsNotEmpty({ message: "Please provide a valid price" })
    total: number;

    @IsString()
    @IsNotEmpty({ message: "Please provide a valid card" })
    payment_source: number;      

    // @IsString()
    // @IsNotEmpty({ message: "Please provide a valid cvv" })
    // cvc: string
}