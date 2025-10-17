const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  // Upsert users
  const [admin, manager, student, student2] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@lms.com' },
      update: { fullName: 'Jane Admin', passwordHash: hash, roles: ['ADMIN'], status: 'APPROVED' },
      create: { email: 'admin@lms.com', fullName: 'Jane Admin', passwordHash: hash, roles: ['ADMIN'], status: 'APPROVED' }
    }),
    prisma.user.upsert({
      where: { email: 'manager@lms.com' },
      update: { fullName: 'Mark Manager', passwordHash: hash, roles: ['MANAGER'], status: 'APPROVED' },
      create: { email: 'manager@lms.com', fullName: 'Mark Manager', passwordHash: hash, roles: ['MANAGER'], status: 'APPROVED' }
    }),
    prisma.user.upsert({
      where: { email: 'student@test.com' },
      update: { fullName: 'Sara Student', passwordHash: hash, roles: ['STUDENT'], status: 'APPROVED' },
      create: { email: 'student@test.com', fullName: 'Sara Student', passwordHash: hash, roles: ['STUDENT'], status: 'APPROVED' }
    }),
    prisma.user.upsert({
      where: { email: 'student2@lms.com' },
      update: { fullName: 'Sam Learner', passwordHash: hash, roles: ['STUDENT'], status: 'PENDING' },
      create: { email: 'student2@lms.com', fullName: 'Sam Learner', passwordHash: hash, roles: ['STUDENT'], status: 'PENDING' }
    }),
  ]);

  // Upsert a course
  const course = await prisma.course.upsert({
    where: { title: "Cybersecurity Foundations" },
    update: { description: "Learn the basics of cybersecurity!" },
    create: { title: "Cybersecurity Foundations", description: "Learn the basics of cybersecurity!" }
  });

  // Upsert modules
  const [mod1, mod2] = await Promise.all([
    prisma.module.upsert({
      where: { courseId_title: { title: "Intro to Cybersecurity", courseId: course.id } },
      update: { order: 1 },
      create: { title: "Intro to Cybersecurity", order: 1, courseId: course.id }
    }),
    prisma.module.upsert({
      where: { courseId_title: { title: "Network Security", courseId: course.id } },
      update: { order: 2 },
      create: { title: "Network Security", order: 2, courseId: course.id }
    }),
  ]);

  // Upsert lectures
  await Promise.all([
    prisma.lecture.upsert({
      where: { moduleId_title: { title: "What is Cybersecurity?", moduleId: mod1.id } },
      update: { videoUrl: "https://youtube.com/demo1", order: 1 },
      create: { title: "What is Cybersecurity?", videoUrl: "https://youtube.com/demo1", order: 1, moduleId: mod1.id }
    }),
    prisma.lecture.upsert({
      where: { moduleId_title: { title: "Threats & Vulnerabilities", moduleId: mod1.id } },
      update: { videoUrl: "https://youtube.com/demo2", order: 2 },
      create: { title: "Threats & Vulnerabilities", videoUrl: "https://youtube.com/demo2", order: 2, moduleId: mod1.id }
    }),
    prisma.lecture.upsert({
      where: { moduleId_title: { title: "Firewall Concepts", moduleId: mod2.id } },
      update: { videoUrl: "https://youtube.com/demo3", order: 1 },
      create: { title: "Firewall Concepts", videoUrl: "https://youtube.com/demo3", order: 1, moduleId: mod2.id }
    })
  ]);

  // Create lectures with assignments
  const lecture1 = await prisma.lecture.findFirst({ where: { title: "What is Cybersecurity?" } });
  const lecture2 = await prisma.lecture.findFirst({ where: { title: "Firewall Concepts" } });
  
  const [assignment1, assignment2] = await Promise.all([
    prisma.assignment.upsert({
      where: { lectureId: lecture1.id },
      update: { title: "Research Cyber Threats", instructions: "Google 3 recent threats and summarize." },
      create: { title: "Research Cyber Threats", lectureId: lecture1.id, instructions: "Google 3 recent threats and summarize." }
    }),
    prisma.assignment.upsert({
      where: { lectureId: lecture2.id },
      update: { title: "Network Analysis", instructions: "Analyze the provided pcap file." },
      create: { title: "Network Analysis", lectureId: lecture2.id, instructions: "Analyze the provided pcap file." }
    }),
  ]);

  // Create quiz for lecture
  const lecture3 = await prisma.lecture.findFirst({ where: { title: "Threats & Vulnerabilities" } });
  
  const quiz1 = await prisma.quiz.upsert({
    where: { lectureId: lecture3.id },
    update: { title: "Cyber Basics Quiz" },
    create: { title: "Cyber Basics Quiz", lectureId: lecture3.id }
  });
  
  // Create quiz questions
  await Promise.all([
    prisma.question.upsert({
      where: { id: quiz1.id + '-q1' },
      update: { text: "What does CIA stand for in cybersecurity?", order: 1 },
      create: { id: quiz1.id + '-q1', quizId: quiz1.id, text: "What does CIA stand for in cybersecurity?", order: 1 }
    }),
    prisma.question.upsert({
      where: { id: quiz1.id + '-q2' },
      update: { text: "What is phishing?", order: 2 },
      create: { id: quiz1.id + '-q2', quizId: quiz1.id, text: "What is phishing?", order: 2 }
    })
  ]);
  
  const questions = await prisma.question.findMany({ where: { quizId: quiz1.id } });
  
  // Create choices for questions
  await Promise.all([
    // Question 1 choices
    prisma.choice.create({ data: { questionId: questions[0].id, text: "Confidentiality, Integrity, Availability", isCorrect: true } }),
    prisma.choice.create({ data: { questionId: questions[0].id, text: "Central Intelligence Agency", isCorrect: false } }),
    prisma.choice.create({ data: { questionId: questions[0].id, text: "Confidential, Internal, Authenticated", isCorrect: false } }),
    // Question 2 choices
    prisma.choice.create({ data: { questionId: questions[1].id, text: "Type of malware", isCorrect: false } }),
    prisma.choice.create({ data: { questionId: questions[1].id, text: "Social engineering attack", isCorrect: true } }),
    prisma.choice.create({ data: { questionId: questions[1].id, text: "Firewall protocol", isCorrect: false } })
  ]).catch(() => {}); // Ignore if already exists

  // Create submissions
  await Promise.all([
    prisma.submission.upsert({
      where: { user_assignment_unique: { userId: student.id, assignmentId: assignment1.id } },
      update: { assignmentLink: "https://drive.google.com/file/d/EXAMPLE" },
      create: { userId: student.id, assignmentId: assignment1.id, assignmentLink: "https://drive.google.com/file/d/EXAMPLE" }
    }),
    prisma.submission.upsert({
      where: { user_quiz_unique: { userId: student.id, quizId: quiz1.id } },
      update: { quizAnswers: { "1": 0, "2": 1 }, score: 100 },
      create: { userId: student.id, quizId: quiz1.id, quizAnswers: { "1": 0, "2": 1 }, score: 100 }
    })
  ]).catch(() => {}); // Ignore if already exists

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        recipientId: student.id,
        type: "SYSTEM",
        message: "Welcome to the LMS! Your account has been approved."
      }
    }).catch(() => {}),
    prisma.notification.create({
      data: {
        recipientId: manager.id,
        type: "NEW_USER",
        message: "New student registered: Sam Learner (student2@lms.com)."
      }
    }).catch(() => {})
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@lms.com / password123');
  console.log('👤 Manager: manager@lms.com / password123');
  console.log('👤 Student: student@test.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
