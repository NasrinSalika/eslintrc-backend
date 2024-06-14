import { IsString, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";

export class CapturePaymentDto {
    @IsString()
    @IsNotEmpty({ message: "Please provide a valid payment Id" })
    @IsMongoId()
    paymentId: string;

    @IsString()
    @IsNotEmpty({ message: "Please provide a valid payment Id" })
    stripePaymentId: string;
}