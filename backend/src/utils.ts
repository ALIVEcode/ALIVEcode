import { HttpException, HttpStatus } from "@nestjs/common";

type isValidFieldsType = (prototype: any, fields: any) => boolean;

export const hasValidFields: isValidFieldsType = (prototype, fields) => {
  return Object.keys(fields).every(field => field in prototype);
};

type isValidFieldOrThrow = (prototype: any, fields: any, error: HttpException) => boolean;

export const hasValidFieldsOrThrow: isValidFieldOrThrow = (
  prototype,
  fields,
  error = new HttpException('Invalid request', HttpStatus.BAD_REQUEST),
) => {
  if (!Object.keys(fields).every(field => field in prototype)) throw error;
  return true;
};