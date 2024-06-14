import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsMongoId, IsArray, IsObject, ValidateNested, ArrayMinSize } from "class-validator";

class CartItems {
    @IsString()
    @IsNotEmpty({ message: 'ProjectId is required' })
    @IsMongoId()
    projectId: string;

    @IsString()
    @IsNotEmpty({ message: 'Pricing category is required' })
    categoryName: string;

    @IsString()
    @IsNotEmpty({ message: 'Pricing Name is required' })
    pricingName: string;

    @IsString()
    @IsNotEmpty({ message: 'Amount is required' })
    pricingAmt: string;

    @IsString()
    @IsNotEmpty({ message: 'FestivalId is required' })
    @IsMongoId()
    festivalId: string;
};

export class AddCheckoutDto {

    @IsArray()
    @IsNotEmpty({ message: 'Items is required' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CartItems)
    items: CartItems[];
}