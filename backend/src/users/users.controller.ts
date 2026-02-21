import { Controller, Get, Query } from "@nestjs/common";
import { DemoUserQueryDto } from "./dto/demo-user-query.dto";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("demo")
  async demo(@Query() query: DemoUserQueryDto) {
    const role = query.role === "owner" ? "owner" : "customer";
    return this.usersService.getOrCreateDemoUser(role);
  }
}
