import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DesignUser, DesignUserDocument } from './users/model/design-user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(DesignUser.name) private userModel: Model<DesignUserDocument>,
  ) { }

  getHello(): string {
    return 'Ovniq Studio BE';
  }

  async findOne(data: any) {
    return await this.userModel.findOne(data).exec();
  }

  async createDesignUser(data: any) {
    const user = new this.userModel(data);
    return await user.save();
  };

  async findCount(data: any) {
    return await this.userModel.countDocuments(data).exec();
  }
}
