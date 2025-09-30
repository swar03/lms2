const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password', 10);

  // Upsert users
  const [admin, manager, student, student2] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@lms.com' },
      update: { fullName: 'Jane Admin', password: hash, role: 'ADMIN' },
      create: { email: 'admin@lms.com', fullName: 'Jane Admin', password: hash, role: 'ADMIN' }
    }),
    prisma.user.upsert({
      where: { email: 'manager@lms.com' },
      update: { fullName: 'Mark Manager', password: hash, role: 'MANAGER' },
      create: { email: 'manager@lms.com', fullName: 'Mark Manager', password: hash, role: 'MANAGER' }
    }),
    prisma.user.upsert({
      where: { email: 'student1@lms.com' },
      update: { fullName: 'Sara Student', password: hash, role: 'STUDENT' },
      create: { email: 'student1@lms.com', fullName: 'Sara Student', password: hash, role: 'STUDENT' }
    }),
    prisma.user.upsert({
      where: { email: 'student2@lms.com' },
      update: { fullName: 'Sam Learner', password: hash, role: 'STUDENT' },
      create: { email: 'student2@lms.com', fullName: 'Sam Learner', password: hash, role: 'STUDENT' }
    }),
  ]);

  // Upsert a course (assume title is unique)
  const course = await prisma.course.upsert({
    where: { title: "Cybersecurity Foundations" },
    update: { description: "Learn the basics of cybersec!", managerId: manager.id },
    create: { title: "Cybersecurity Foundations", description: "Learn the basics of cybersec!", managerId: manager.id }
  });

  // Upsert modules
// Upsert modules (compound unique: title + courseId)
const [mod1, mod2] = await Promise.all([
  prisma.module.upsert({
    where: { title_courseId: { title: "Intro to Cybersecurity", courseId: course.id } },
    update: { order: 1, courseId: course.id },
    create: { title: "Intro to Cybersecurity", order: 1, courseId: course.id }
  }),
  prisma.module.upsert({
    where: { title_courseId: { title: "Network Security", courseId: course.id } },
    update: { order: 2, courseId: course.id },
    create: { title: "Network Security", order: 2, courseId: course.id }
  }),
]);

  // Upsert lectures
// Upsert lectures (compound unique: title + moduleId)
await Promise.all([
  prisma.lecture.upsert({
    where: { title_moduleId: { title: "What is Cybersecurity?", moduleId: mod1.id } },
    update: { videoUrl: "https://youtube.com/demo1", order: 1, moduleId: mod1.id },
    create: { title: "What is Cybersecurity?", videoUrl: "https://youtube.com/demo1", order: 1, moduleId: mod1.id }
  }),
  prisma.lecture.upsert({
    where: { title_moduleId: { title: "Threats & Vulnerabilities", moduleId: mod1.id } },
    update: { videoUrl: "https://youtube.com/demo2", order: 2, moduleId: mod1.id },
    create: { title: "Threats & Vulnerabilities", videoUrl: "https://youtube.com/demo2", order: 2, moduleId: mod1.id }
  }),
  prisma.lecture.upsert({
    where: { title_moduleId: { title: "Firewall Concepts", moduleId: mod2.id } },
    update: { videoUrl: "https://youtube.com/demo3", order: 1, moduleId: mod2.id },
    create: { title: "Firewall Concepts", videoUrl: "https://youtube.com/demo3", order: 1, moduleId: mod2.id }
  })
]);

  // Upsert assignments
// Upsert assignments (compound unique: title + moduleId)
const [assignment1, assignment2] = await Promise.all([
  prisma.assignment.upsert({
    where: { title_moduleId: { title: "Research Cyber Threats", moduleId: mod1.id } },
    update: { moduleId: mod1.id, description: "Google 3 recent threats and summarize.", taskUrl: "https://tryhackme.com/jr/threats" },
    create: { title: "Research Cyber Threats", moduleId: mod1.id, description: "Google 3 recent threats and summarize.", taskUrl: "https://tryhackme.com/jr/threats" }
  }),
  prisma.assignment.upsert({
    where: { title_moduleId: { title: "Network Analysis", moduleId: mod2.id } },
    update: { moduleId: mod2.id, description: "Analyze the provided pcap file.", taskUrl: "https://drive.google.com/network-assignment" },
    create: { title: "Network Analysis", moduleId: mod2.id, description: "Analyze the provided pcap file.", taskUrl: "https://drive.google.com/network-assignment" }
  }),
]);

  // Upsert quiz (assume title is unique)
// Upsert quiz (compound unique: title + moduleId)
const quiz1 = await prisma.quiz.upsert({
  where: { title_moduleId: { title: "Cyber Basics Quiz", moduleId: mod1.id } },
  update: {
    moduleId: mod1.id,
    questions: [
      { id: 1, text: "What does CIA stand for in cybersecurity?", options: ["Confidentiality, Integrity, Availability", "Central Intelligence Agency", "Confidential, Internal, Authenticated"], correct: 0 },
      { id: 2, text: "What is phishing?", options: ["Type of malware", "Social engineering attack", "Firewall protocol"], correct: 1 }
    ]
  },
  create: {
    title: "Cyber Basics Quiz",
    moduleId: mod1.id,
    questions: [
      { id: 1, text: "What does CIA stand for in cybersecurity?", options: ["Confidentiality, Integrity, Availability", "Central Intelligence Agency", "Confidential, Internal, Authenticated"], correct: 0 },
      { id: 2, text: "What is phishing?", options: ["Type of malware", "Social engineering attack", "Firewall protocol"], correct: 1 }
    ]
  }
});

  // Upsert enrollments (unique by student and course)
// Upsert enrollments (unique by student and course)
await Promise.all([
  prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: { status: "APPROVED" },
    create: { studentId: student.id, courseId: course.id, status: "APPROVED" }
  }),
  prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: course.id } },
    update: { status: "PENDING" },
    create: { studentId: student2.id, courseId: course.id, status: "PENDING" }
  }),
]);

  // Upsert submission (unique by assignment+student)
// Upsert submission (unique by assignmentId + studentId)
await prisma.submission.upsert({
  where: { assignmentId_studentId: { assignmentId: assignment1.id, studentId: student.id } },
  update: { gdriveLink: "https://drive.google.com/file/d/EXAMPLE" },
  create: {
    assignmentId: assignment1.id,
    studentId: student.id,
    gdriveLink: "https://drive.google.com/file/d/EXAMPLE",
  }
});

// Example for quiz submission uniqueness (optional extra)
await prisma.submission.upsert({
  where: { quizId_studentId: { quizId: quiz1.id, studentId: student.id } },
  update: { answers: { 1: 0, 2: 1 }, score: 2, feedback: "Well done" },
  create: {
    quizId: quiz1.id,
    studentId: student.id,
    answers: { 1: 0, 2: 1 },
    score: 2,
    feedback: "Well done"
  }
});

  // Upsert notifications (if needed, can use custom where)
// Helper to avoid duplicate notifications in seed
async function ensureNotification(where, data) {
  const found = await prisma.notification.findFirst({ where });
  if (!found) {
    return prisma.notification.create({ data });
  }
  return found;
}

// Seed notifications idempotently
// Seed notifications idempotently
await Promise.all([
  ensureNotification(
    { userId: student.id, type: "APPROVAL", message: "Your enrollment was approved!" },
    { userId: student.id, type: "APPROVAL", message: "Your enrollment was approved!", read: false }
  ),
  ensureNotification(
    { userId: manager.id, type: "REGISTRATION", message: "New student registered: Sam Learner (student2@lms.com)." },
    { userId: manager.id, type: "REGISTRATION", message: "New student registered: Sam Learner (student2@lms.com).", read: false }
  ),
]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
