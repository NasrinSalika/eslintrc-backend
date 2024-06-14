import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsMongoId, IsObject, ValidateNested } from "class-validator";

class CategoryObj {
    @IsString()
    @IsNotEmpty({ message: 'ProjectId is required' })
    @IsMongoId()
    projectId: string;

    @IsString()
    @IsNotEmpty({ message: 'Pricing category is required' })
    category: string;

    @IsString()
    @IsNotEmpty({ message: 'Deadline is required' })
    deadline: string;

    @IsString()
    @IsNotEmpty({ message: 'Project Name is required' })
    projectName: string;

    @IsString()
    @IsNotEmpty({ message: 'Amount is required' })
    price: string;

    @IsString()
    @IsNotEmpty({ message: 'FestivalId is required' })
    @IsMongoId()
    festivalId: string;
};

export class CreateSubmissionDto {

    @IsString()
    @IsNotEmpty({ message: 'ProjectId is required' })
    @IsMongoId()
    projectId: string;

    @IsString()
    @IsNotEmpty({ message: 'FestivalId is required' })
    @IsMongoId()
    festivalId: string;

    @IsObject()
    @IsNotEmpty({ message: 'Category-obj is required' })
    @ValidateNested({ each: true })
    @Type(() => CategoryObj)
    category: CategoryObj

    @IsString()
    @IsNotEmpty()
    amount_paid: string;

    @IsString()
    @IsNotEmpty({ message: 'userId is required' })
    @IsMongoId()
    userId: string;

    @IsString()
    @IsNotEmpty({ message: 'submissionPaymentId is required' })
    @IsMongoId()
    submissionPaymentId: string;
};