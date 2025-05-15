import { HttpStatus } from "../types/http-statuses";
import { ResultStatus } from "./resultCode";


export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest;
    case ResultStatus.Success:
      return HttpStatus.Success;
    case ResultStatus.Created:
      return HttpStatus.Created;
    case ResultStatus.NoContent:
      return HttpStatus.NoContent;
    case ResultStatus.NotFound:
      return HttpStatus.NotFound;
    case ResultStatus.Unauthorized:
      return HttpStatus.Unauthorized;
    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden;
    default:
      return HttpStatus.InternalServerError;
  }
};
