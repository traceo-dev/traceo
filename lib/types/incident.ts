// import { ApiPropertyOptional } from "@nestjs/swagger";
// import { Type } from "class-transformer";
// import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
// import { BaseDtoQuery } from "../core/query/generic.model";

// export class KlepperRequest {
//   payload?: Object;
//   headers?: Object;
//   query?: Object;
//   url?: Object;
//   method?: RequestMethodType;
//   ip?: string | string[] | undefined;
// }

// export interface Incident {
//   status: IncidentStatus;
//   type: string;
//   message: string;
//   date: number;
//   stack: string;
//   traces?: Trace[];
//   appId: string;
//   requestData?: KlepperRequest;
//   catchType?: CatchType;
//   options?: {
//     priority?: ExceptionPriority;
//     tag?: string;
//   };

//   version?: string;
//   platform: Platform;

//   errorsCount?: number;
//   lastError?: number;
//   errorsDetails?: ErrorDetails[];

//   assigned: {
//     id: string;
//     name: string;
//     logo: string;
//   };

//   comments: Comment[];
//   commentsCount?: number;
// }

