import { IsString, IsNotEmpty, IsMongoId } from "class-validator";

export class CreateProjectCategoryDto {
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsMongoId()
    types: string
}