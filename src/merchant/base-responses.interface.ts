import { ApiResponseProperty } from "@nestjs/swagger";

export class NotFoundResponse {
    @ApiResponseProperty({
      example:404
    })
    statusCode: number
}

export class CreatedBaseResponse {
    @ApiResponseProperty({
      example:201
    })
    statusCode: number
}
  
export class OKBaseResponse {
    @ApiResponseProperty({
      example:200
    })
    statusCode: number
}