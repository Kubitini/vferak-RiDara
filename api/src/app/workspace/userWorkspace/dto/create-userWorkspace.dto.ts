export class AddUserToWorkspaceDto {
    public constructor(public workspaceUuid: string, public userUuid: string) {}
}
