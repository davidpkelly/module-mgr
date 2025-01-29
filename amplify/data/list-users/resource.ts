import { defineFunction } from "@aws-amplify/backend"

export const listUsers = defineFunction({
 name: "list-users",
 entry: "list-users/handler.ts",
})