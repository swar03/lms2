const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
            _count: {
              select: {
                lectures: true,
                assignments: true,
                quizzes: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        _count: {
          select: {
            modules: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lectures: {
              select: {
                id: true,
                title: true,
                videoUrl: true,
                order: true
              },
              orderBy: { order: 'asc' }
            },
            assignments: {
              select: {
                id: true,
                title: true,
                description: true,
                taskUrl: true
              }
            },
            quizzes: {
              select: {
                id: true,
                title: true,
                questions: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, managerId } = req.body;
    
    if (!title || !managerId) {
      return res.status(400).json({ message: 'Title and managerId are required' });
    }
    
    const course = await prisma.course.create({
      data: {
        title,
        description,
        managerId
      },
      include: {
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};
