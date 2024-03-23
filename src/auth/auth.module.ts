import { Module } from "@nestjs/common";
import { TranspotModule } from "src/transport/transport.module";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";

@Module({
    imports:[
      TranspotModule
    ],
    controllers:[
      AuthenticationController
    ],
    providers:[
      AuthenticationService,
    ],
    exports:[
      AuthenticationService
    ]
})
export class AuthenticationModule{}