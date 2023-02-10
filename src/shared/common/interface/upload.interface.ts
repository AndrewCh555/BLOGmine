export interface StorageFileType {
  id: string;
  imageName: string;
  url: string;
  mediaLink: string;
  size: number;
  fileId: string;
}

export interface RawFileDataType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
