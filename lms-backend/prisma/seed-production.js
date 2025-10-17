const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production database seeding...')

  // Create SystemConfig
  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      autoApproveDays: 3,
      paginationLimit: 50,
      rateLimitPer15Min: 20
    }
  })
  console.log('✅ System config created')

  // Create Admin user
  const adminPassword = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      roles: ['ADMIN'],
      status: 'APPROVED'
    }
  })

  // Create Admin record
  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Manager users
  const managers = [
    { email: 'manager1@lms.com', name: 'John Manager' },
    { email: 'manager2@lms.com', name: 'Sarah Manager' },
    { email: 'manager3@lms.com', name: 'Mike Manager' }
  ]

  for (const mgr of managers) {
    const managerPassword = await bcrypt.hash('password123', 10)
    const manager = await prisma.user.upsert({
      where: { email: mgr.email },
      update: {},
      create: {
        email: mgr.email,
        passwordHash: managerPassword,
        fullName: mgr.name,
        roles: ['MANAGER'],
        status: 'APPROVED'
      }
    })

    await prisma.manager.upsert({
      where: { userId: manager.id },
      update: {},
      create: { userId: manager.id }
    })
    console.log('✅ Manager created:', manager.email)
  }

  // Create Student users with various statuses
  const students = [
    { email: 'student1@lms.com', name: 'Alice Student', status: 'APPROVED' },
    { email: 'student2@lms.com', name: 'Bob Student', status: 'APPROVED' },
    { email: 'student3@lms.com', name: 'Carol Student', status: 'APPROVED' },
    { email: 'student4@lms.com', name: 'David Student', status: 'APPROVED' },
    { email: 'student5@lms.com', name: 'Eve Student', status: 'APPROVED' },
    { email: 'student6@lms.com', name: 'Frank Student', status: 'APPROVED' },
    { email: 'pending1@lms.com', name: 'Pending Student 1', status: 'PENDING' },
    { email: 'pending2@lms.com', name: 'Pending Student 2', status: 'PENDING' },
    { email: 'pending3@lms.com', name: 'Pending Student 3', status: 'PENDING' },
    { email: 'rejected@lms.com', name: 'Rejected Student', status: 'REJECTED' }
  ]

  for (const std of students) {
    const studentPassword = await bcrypt.hash('password123', 10)
    const student = await prisma.user.upsert({
      where: { email: std.email },
      update: {},
      create: {
        email: std.email,
        passwordHash: studentPassword,
        fullName: std.name,
        roles: ['STUDENT'],
        status: std.status
      }
    })

    // Create profile for students
    await prisma.profile.upsert({
      where: { userId: student.id },
      update: {},
      create: {
        userId: student.id,
        occupation: 'Student',
        country: 'USA'
      }
    })

    // Create approval record
    await prisma.approval.create({
      data: {
        userId: student.id,
        status: std.status === 'APPROVED' ? 'APPROVED' : std.status === 'REJECTED' ? 'REJECTED' : 'PENDING',
        actorId: std.status !== 'PENDING' ? admin.id : null,
        note: std.status === 'REJECTED' ? 'Does not meet requirements' : null
      }
    })
    console.log('✅ Student created:', student.email, `(${std.status})`)
  }

  // Create Course
  const course = await prisma.course.upsert({
    where: { title: 'Growth Minds - Core Course' },
    update: {},
    create: {
      title: 'Growth Minds - Core Course',
      description: 'Comprehensive cybersecurity and digital forensics course'
    }
  })
  console.log('✅ Course created:', course.title)

  // Create 6 Modules with 3 lectures each
  const moduleData = [
    { title: 'Cybersecurity Fundamentals', order: 1 },
    { title: 'Network Security', order: 2 },
    { title: 'Web Application Security', order: 3 },
    { title: 'Digital Forensics', order: 4 },
    { title: 'Incident Response', order: 5 },
    { title: 'Advanced Threats', order: 6 }
  ]

  for (const moduleInfo of moduleData) {
    const module = await prisma.module.upsert({
      where: {
        courseId_title: {
          courseId: course.id,
          title: moduleInfo.title
        }
      },
      update: {},
      create: {
        title: moduleInfo.title,
        description: `Learn ${moduleInfo.title.toLowerCase()} concepts and practices`,
        order: moduleInfo.order,
        courseId: course.id
      }
    })
    console.log('✅ Module created:', module.title)

    // Create 3 lectures per module
    const lectureData = [
      { title: `${moduleInfo.title} - Introduction`, order: 1, videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: `${moduleInfo.title} - Practical Lab`, order: 2, videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: `${moduleInfo.title} - Advanced Topics`, order: 3, videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ' }
    ]

    for (const lectureInfo of lectureData) {
      const lecture = await prisma.lecture.upsert({
        where: {
          moduleId_title: {
            moduleId: module.id,
            title: lectureInfo.title
          }
        },
        update: {},
        create: {
          title: lectureInfo.title,
          description: `Detailed content for ${lectureInfo.title}`,
          order: lectureInfo.order,
          videoUrl: lectureInfo.videoUrl,
          moduleId: module.id
        }
      })
      console.log('✅ Lecture created:', lecture.title)

      // Create Assignment for each lecture
      const assignment = await prisma.assignment.upsert({
        where: { lectureId: lecture.id },
        update: {},
        create: {
          lectureId: lecture.id,
          title: `${lectureInfo.title} - Assignment`,
          instructions: `Complete the practical exercises for ${lectureInfo.title}. Submit your Google Drive link with the completed work.`
        }
      })

      // Create Quiz for each lecture
      const quiz = await prisma.quiz.upsert({
        where: { lectureId: lecture.id },
        update: {},
        create: {
          lectureId: lecture.id,
          title: `${lectureInfo.title} - Quiz`
        }
      })

      // Create Questions for each quiz
      const questions = [
        {
          text: `What is the primary focus of ${lectureInfo.title}?`,
          choices: [
            { text: 'Security fundamentals', isCorrect: true },
            { text: 'Network protocols', isCorrect: false },
            { text: 'Database management', isCorrect: false },
            { text: 'Web development', isCorrect: false }
          ]
        },
        {
          text: `Which tool is commonly used in ${moduleInfo.title}?`,
          choices: [
            { text: 'Wireshark', isCorrect: true },
            { text: 'Photoshop', isCorrect: false },
            { text: 'Excel', isCorrect: false },
            { text: 'PowerPoint', isCorrect: false }
          ]
        }
      ]

      for (let i = 0; i < questions.length; i++) {
        const questionData = questions[i]
        const question = await prisma.question.create({
          data: {
            quizId: quiz.id,
            text: questionData.text,
            order: i + 1
          }
        })

        // Create choices for each question
        for (const choiceData of questionData.choices) {
          await prisma.choice.create({
            data: {
              questionId: question.id,
              text: choiceData.text,
              isCorrect: choiceData.isCorrect
            }
          })
        }
      }
    }
  }

  console.log('🎉 Production database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log('   - 1 Admin user')
  console.log('   - 3 Manager users')
  console.log('   - 10 Student users (6 approved, 3 pending, 1 rejected)')
  console.log('   - 1 Course with 6 modules')
  console.log('   - 18 Lectures (3 per module)')
  console.log('   - 18 Assignments and 18 Quizzes')
  console.log('   - System configuration')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })