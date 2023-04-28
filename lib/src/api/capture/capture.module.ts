import { Module } from "@nestjs/common";
import { KafkaModule } from "../../common/services/kafka/kafka.module";
import { CaptureController } from "./capture.controller";
import { CaptureService } from "./capture.service";

@Module({
    imports: [KafkaModule],
    providers: [CaptureService],
    controllers: [CaptureController],
    exports: [CaptureService]
})
export class CaptureModule { }
