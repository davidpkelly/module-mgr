import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

export const usersListHandler = defineFunction({
  name: "list-users-handler",
  entry: "list-users-handler/handler.ts",
});

const schema = a.schema({
  AuditLog: a
    .model({
      user: a.string(),
      content: a.string(),
      datetime: a.datetime(),
      resource: a.string(),
    })
    .authorization((allow) => [allow.groups(["SUPERADMIN", "ADMIN"])]),

  UserAttribute: a.customType({
    Name: a.string(),
    Value: a.string(),
  }),

  User: a.customType({
    Attributes: a.ref("UserAttribute").array(),
    Enabled: a.boolean(),
    UserCreateDate: a.datetime(),
    UserLastModifiedDate: a.datetime(),
    UserStatus: a.string(),
    Username: a.string(),
  }),

  UsersResponse: a.customType({
    users: a.ref("User").array(),
    admins: a.ref("User").array(),
    superadmins: a.ref("User").array(),
  }),

  usersList: a
    .query()
    // return type of the query
    .returns(a.ref("UsersResponse"))
    // only allow users in the SUOERADMIN group to call the API
    .authorization((allow) => [allow.group("SUPERADMIN")])
    .handler(a.handler.function(usersListHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
