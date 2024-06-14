import { IsString, IsNotEmpty, IsArray, IsMongoId } from "class-validator";
import { Type  } from 'class-transformer'

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsMongoId()
    events: string
}