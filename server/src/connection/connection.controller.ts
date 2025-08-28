import {
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}
  @Post('send/:userId')
  @UseGuards(LocalAuthGuard)
  async createConnection(@Req() request: any, @Param('userId') userId: string) {
    const user = request.user;
    return this.connectionService.sendConnectionRequest(
      user.userId,
      user.role,
      userId,
    );
  }
  @Post('respond')
  @UseGuards(LocalAuthGuard)
  async respondToConnection(
    @Query('connectionId') connectionId: Types.ObjectId,
    @Query('status') status: string,
  ) {
    return this.connectionService.respondToConnectionRequest(
      connectionId,
      status,
    );
  }
  @Delete('disconnect/:connectionId')
  @UseGuards(LocalAuthGuard)
  async deleteConnection(@Param('connectionId') connectionId: Types.ObjectId) {
    return this.connectionService.deleteConnectionRequest(connectionId);
  }
}
