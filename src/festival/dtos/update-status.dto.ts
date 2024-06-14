import { IsNotEmpty, IsBoolean, IsString, IsMongoId } from "class-validator";

export class UpdateStatusDto {
    @IsBoolean()
    @IsNotEmpty()
    isOpen: boolean;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    festivalId: string;
}