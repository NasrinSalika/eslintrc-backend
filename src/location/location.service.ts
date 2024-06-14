import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LocationsSchema } from './models/location.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Locations')
    private readonly locationSchema: Model<typeof LocationsSchema>,
  ) {}
  async createLocation(locationData: any) {
    // Validate that images array doesn't contain empty strings
    let images;
    if (!locationData.images[0]) {
      images = [];
    } else {
      images = locationData.images.map((image) => Types.ObjectId(image));
    }

    const toSave = {
      locationName: locationData.locationName ? locationData.locationName : '',
      address: locationData.address ? locationData.address : '',
      latitude: locationData.latitude ? locationData.latitude : '',
      longitude: locationData.longitude ? locationData.longitude : '',
      images: images,
      pageNumber: locationData.pageNumber ? locationData.pageNumber : '',
      sceneHeading: locationData.sceneHeading ? locationData.sceneHeading : '',
      sceneName: locationData.sceneName ? locationData.sceneName : '',
      sceneNumber: locationData.sceneNumber ? locationData.sceneNumber : '',
      notes: locationData.notes ? locationData.notes : '',
      projectId: Types.ObjectId(locationData.projectId),
      createdBy: Types.ObjectId(locationData.createdBy),
    };

    const location = new this.locationSchema(toSave);
    await location.save();
  }
}
