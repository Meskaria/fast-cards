# Migration `20201018181003-add-is-deleted-to-offer`

This migration has been generated by Katarzyna Marciniszyn at 10/18/2020, 8:10:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Offer" ADD COLUMN "isDeleted" boolean   NOT NULL DEFAULT false
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201018171928-remove-unique-from-offer-mentor-id..20201018181003-add-is-deleted-to-offer
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
   password = env("DATABASE_PASS")
   user     = "postgres"
 }
@@ -69,8 +69,9 @@
   mentorId        String
   mentor          Mentor      @relation(fields: [mentorId], references: [id])
   timeSlotsCount  Int
   price           Int
+  isDeleted       Boolean     @default(false)
 }
 model User {
   id                String      @default(uuid()) @id
```


