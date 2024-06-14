import { Injectable } from '@nestjs/common';
import { CastSchema } from './models/cast.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CastService {
  constructor(
    @InjectModel('casts')
    private readonly castSchema: Model<typeof CastSchema>,
  ) {}
  async createCast(castData) {
    // Validate that images array doesn't contain empty strings
    let images;
    if (!castData.images[0]) {
      images = [];
    } else {
      images = castData.images.map((image) => Types.ObjectId(image));
    }

    const payload = {
      ...castData,
      projectId: Types.ObjectId(castData.projectId),
      createdBy: Types.ObjectId(castData.createdBy),
      images: images,
    };
    const toSave = new this.castSchema(payload);

    await toSave.save();
  }

  async updateCharacter(castId, newCharacter) {
    await this.castSchema.updateOne(
      { _id: Types.ObjectId(castId) },
      { character: newCharacter },
    );
  }
}
