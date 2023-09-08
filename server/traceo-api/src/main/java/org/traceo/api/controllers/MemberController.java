package org.traceo.api.controllers;

import org.springframework.web.bind.annotation.*;
import org.traceo.common.transport.dto.api.MemberDto;
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
    private ApiResponse create(@RequestBody MemberDto dto) {
        return memberService.create(dto);
    }

    @PatchMapping
    private ApiResponse update(@RequestBody MemberDto dto) {
        return memberService.update(dto);
    }

    @DeleteMapping
    private ApiResponse remove(@RequestParam String id) {
        return memberService.remove(id);
    }

    @DeleteMapping("/leave")
    private ApiResponse leaveProject(@RequestParam String id) {
        return memberService.leave(id);
    }
}
