import { File } from '@google-cloud/storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { RawFileDataType, StorageFileType } from 'src/shared/common';
import { getGoogleStorage, getBucketName } from 'src/shared/configs';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { CommonErrorTypes } from '@shared/common/errormessages-common/commonerrors';

@Injectable()
export class StorageService {
  async saveFile(file: RawFileDataType): Promise<StorageFileType> {
    if (!file) {
      return;
    }
    try {
      const bucket = this.getBucket();
      const { buffer, originalname } = file;
      const date = dayjs().format('YYYY-MM-DD');
      const id = uuidv4();
      const newFile = bucket.file(
        `images/${date}/${id}${extname(originalname)}`,
      );
      await newFile.save(buffer, {
        public: true,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        },
      });
      const url = newFile.publicUrl();
      const {
        metadata: { name, mediaLink, size },
      } = newFile;
      return {
        id,
        imageName: originalname,
        url,
        mediaLink,
        size,
        fileId: name,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;
      const file = await this.findFile(fileUrl);

      await file.delete();
    } catch (err) {
      if (err.message === CommonErrorTypes.RESOURCE_NOT_FOUND) return;
      throw new Error(err.message);
    }
  }

  async getFile(fileUrl: string) {
    try {
      const file = await this.findFile(fileUrl);

      return await file.getMetadata();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findFile(fileUrl: string): Promise<File> {
    let imagePath = fileUrl.split('/').pop();
    imagePath = imagePath.replace(/%2F/gi, '/');
    try {
      const bucket = this.getBucket();
      const file = bucket.file(imagePath);

      const [fileExists] = await file.exists();
      if (!fileExists)
        throw new NotFoundException(CommonErrorTypes.RESOURCE_NOT_FOUND);

      return file;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private getBucket() {
    return getGoogleStorage().bucket(getBucketName());
  }
}
