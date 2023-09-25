import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { User } from "@/modules/user/user.type";

export class UserEntity {
  async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFileName = `${uuidv4}_${filename}`;
    const imagePath = join(process.cwd(), 'public', uniqueFileName);
    const imageUrl = `${process.env.APP_URL}/${uniqueFileName}`;
    const readStream = createReadStream();

    readStream.pipe(createWriteStream(imagePath));

    return imageUrl;
  }
}
