package org.traceo.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.traceo.api.models.response.CreateResponse;
import org.traceo.common.transport.dto.api.MemberDto;
import org.traceo.api.models.query.MembersQueryDto;
import org.traceo.api.services.commands.MemberService;
import org.traceo.api.services.queries.MemberQueryService;
import org.traceo.common.transport.response.ApiResponse;

import java.util.List;

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
    private ResponseEntity<ApiResponse> getMembers(MembersQueryDto query) {
        List<MemberDto> response = memberQueryService.getMembers(query);
        return new ResponseEntity<>(ApiResponse.ofSuccess(response), HttpStatus.OK);
    }

    @PostMapping("/project/add")
    private ResponseEntity<ApiResponse> create(@RequestBody MemberDto dto) {
        String id = memberService.create(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(new CreateResponse(id)), HttpStatus.CREATED);

    }

    @PatchMapping
    private ResponseEntity<ApiResponse> update(@RequestBody MemberDto dto) {
        memberService.update(dto);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @DeleteMapping
    private ResponseEntity<ApiResponse> remove(@RequestParam String id) {
        memberService.remove(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/leave")
    private ResponseEntity<ApiResponse> leaveProject(@RequestParam String id) {
        memberService.leave(id);
        return new ResponseEntity<>(ApiResponse.ofSuccess(), HttpStatus.NO_CONTENT);
    }
}
