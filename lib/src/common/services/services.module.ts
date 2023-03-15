import { Module } from "@nestjs/common";
import { LiveService } from "./live.service";

@Module({
  imports: [],
  providers: [LiveService]
})
export class ServicesModule {}
