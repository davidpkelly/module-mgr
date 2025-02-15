import { defineAuth } from '@aws-amplify/backend';
import { usersListHandler } from '../data/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    givenName: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: true,
      mutable: true,
    },
  },
  groups: ["SUPERADMIN", "ADMIN", "USER"],
  access: (allow) => [
    allow.resource(usersListHandler).to(['listUsers', 'listGroups', 'listUsersInGroup']),
  ],
});
