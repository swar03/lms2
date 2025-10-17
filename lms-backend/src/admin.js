const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const { Database, Resource } = require('@adminjs/prisma')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

const adminOptions = {
  resources: [
    {
      resource: { model: prisma.user, client: prisma },
      options: {
        properties: {
          password: { isVisible: false }
        }
      }
    },
    { resource: { model: prisma.course, client: prisma } },
    { resource: { model: prisma.module, client: prisma } },
    { resource: { model: prisma.lecture, client: prisma } },
    { resource: { model: prisma.assignment, client: prisma } },
    { resource: { model: prisma.quiz, client: prisma } },
    { resource: { model: prisma.submission, client: prisma } },
    { resource: { model: prisma.userProgress, client: prisma } },
    { resource: { model: prisma.certificate, client: prisma } },
    { resource: { model: prisma.notification, client: prisma } }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'LMS Admin Panel'
  }
}

const admin = new AdminJS(adminOptions)
const adminRouter = AdminJSExpress.buildRouter(admin)

module.exports = { admin, adminRouter }