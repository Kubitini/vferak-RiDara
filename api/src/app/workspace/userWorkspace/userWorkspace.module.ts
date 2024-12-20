import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserWorkspaceService } from './userWorkspace.service';
import { UserWorkspace } from './userWorkspace.entity';

@Module({
    imports: [MikroOrmModule.forFeature([UserWorkspace])],
    providers: [UserWorkspaceService],
    exports: [UserWorkspaceService, MikroOrmModule],
})
export class UserWorkspaceModule {}
