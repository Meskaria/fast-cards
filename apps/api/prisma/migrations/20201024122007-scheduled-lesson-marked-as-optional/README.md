# Migration `20201024122007-scheduled-lesson-marked-as-optional`

This migration has been generated by Adriana Olszak at 10/24/2020, 2:20:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."TimeSlot" ALTER COLUMN "scheduledLessonId" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201012213816-change-field-name-in-time-slot-model..20201024122007-scheduled-lesson-marked-as-optional
--- datamodel.dml
+++ datamodel.dml
@@ -2,15 +2,16 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
   password = env("DATABASE_PASS")
   user     = "postgres"
 }
 generator client {
   provider = "prisma-client-js"
+  previewFeatures = ["transactionApi"]
 }
 model Profile {
   id      String      @default(uuid()) @id
@@ -46,10 +47,10 @@
   mentor             Mentor               @relation(fields: [mentorId], references: [id])
   mentorId           String
   start              DateTime
   end                DateTime
-  scheduledLesson    ScheduledLesson      @relation(fields: [scheduledLessonId], references: [id])
-  scheduledLessonId           String
+  scheduledLesson    ScheduledLesson?      @relation(fields: [scheduledLessonId], references: [id])
+  scheduledLessonId           String?
 }
 model ScheduledLesson {
   id         String      @default(uuid()) @id
```


