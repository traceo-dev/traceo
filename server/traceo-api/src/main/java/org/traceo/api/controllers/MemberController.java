package org.traceo.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.dto.CreateMemberDto;
import org.traceo.api.models.dto.UpdateMemberDto;
import org.traceo.api.models.query.MembersQueryDto;
import org.traceo.api.services.commands.MemberService;
import org.traceo.api.services.queries.MemberQueryService;
import org.traceo.common.transport.response.ApiResponse;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    private final MemberService memberService;
    private final MemberQueryService memberQueryService;


    public MemberController(MemberService memberService, MemberQueryService memberQueryService) {
        this.memberService = memberService;
        this.memberQueryService = memberQueryService;
    }

    @GetMapping("/search")
    private ApiResponse getMembers(MembersQueryDto query) {
        return memberQueryService.getMembers(query);
    }

    @PostMapping("/project/add")
    private ApiResponse create(@RequestBody CreateMemberDto dto) {
        return memberService.create(dto);
    }

    @PatchMapping
    private ApiResponse update(@RequestBody UpdateMemberDto dto) {
        return memberService.update(dto);
    }

    @DeleteMapping
    private ApiResponse remove(@RequestParam String id) {
        return memberService.remove(id);
    }

    @DeleteMapping
    private ApiResponse leaveProject(@RequestParam String id) {
        return memberService.leave(id);
    }
}
