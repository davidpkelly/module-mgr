import { env } from '$amplify/env/list-users-handler';
import type { Schema } from '../resource';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListGroupsCommand,
  ListUsersInGroupCommand,
  ListUsersInGroupResponse,
  ListUsersResponse,
  ListGroupsResponse,
  GroupType,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler: Schema['usersList']['functionHandler'] = async () => {
  const listGroupsCommand = new ListGroupsCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  });

  const listGroupsCommandResponse: ListGroupsResponse = await client.send(listGroupsCommand);
  const groupNames: string[] = listGroupsCommandResponse.Groups?.map((group: GroupType) => (group.GroupName || '')) || [];
  const usersGroups: ListUsersInGroupResponse[] = await Promise.all((groupNames || []).map(async (name) => {
    const listUsersInGroupCommand = new ListUsersInGroupCommand({
      UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
      GroupName: name,
    });
    return await client.send(listUsersInGroupCommand);
  }));

  const Users: Schema['UsersResponse']['type'] = {
    users: usersGroups[groupNames.indexOf('USER')].Users?.map(transformUserResponse()) || [],
    admins: usersGroups[groupNames.indexOf('ADMIN')].Users?.map(transformUserResponse()) || [],
    superadmins: usersGroups[groupNames.indexOf('SUPERADMIN')].Users?.map(transformUserResponse()) || [],
  };
  return Users;

  function transformUserResponse(): (value: UserType, index: number, array: UserType[]) => { Username: string; UserStatus: string; UserCreateDate: string; UserLastModifiedDate: string; Enabled: boolean; Attributes: { Name: any; Value: any; }[]; } {
    return (user: UserType) => {
      return {
        Username: user.Username || '',
        UserStatus: user.UserStatus || '',
        UserCreateDate: user.UserCreateDate?.toISOString() || '',
        UserLastModifiedDate: user.UserLastModifiedDate?.toISOString() || '',
        Enabled: user.Enabled || false,
        Attributes: user.Attributes?.map((attribute: any) => {
          return {
            Name: attribute.Name || '',
            Value: attribute.Value || '',
          };
        }) || [],
      };
    };
  }
};