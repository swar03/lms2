/*
  Warnings:

  - A unique constraint covering the columns `[title,moduleId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,moduleId]` on the table `Lecture` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,courseId]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,moduleId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId,studentId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quizId,studentId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assignment_title_moduleId_key" ON "public"."Assignment"("title", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "public"."Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_title_moduleId_key" ON "public"."Lecture"("title", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_title_courseId_key" ON "public"."Module"("title", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_title_moduleId_key" ON "public"."Quiz"("title", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignmentId_studentId_key" ON "public"."Submission"("assignmentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_quizId_studentId_key" ON "public"."Submission"("quizId", "studentId");
