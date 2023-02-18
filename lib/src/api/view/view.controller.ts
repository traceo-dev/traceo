import { Controller, Get, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ViewConfigData } from "@traceo/types";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { ViewService } from "./view.service";
import { Request } from "express";

@Controller("view")
@ApiTags("view")
export class ViewController {
    constructor(
        private readonly viewService: ViewService
    ) { }

    @Get("/config")
    public async getViewConfigData(
        @Req() req: Request
    ): Promise<ApiResponse<ViewConfigData>> {
        return this.viewService.getViewConfigData(req);
    }
}