import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { MemberQueryService } from "./member-query/member-query.service";
import { PassportModule } from "@nestjs/passport";
import { ApplicationQueryService } from "../application/application-query/application-query.service";
import { UserQueryService } from "../user/user-query/user-query.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [MemberService, MemberQueryService, ApplicationQueryService, UserQueryService],
  controllers: [MemberController],
  exports: [MemberService, MemberQueryService]
})
export class MemberModule {}
