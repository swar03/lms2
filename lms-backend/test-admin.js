// Simple test to check if AdminJS works
const express = require('express')
const app = express()

try {
  console.log('Testing AdminJS...')
  const AdminJS = require('adminjs')
  console.log('✅ AdminJS imported successfully')
  
  const AdminJSExpress = require('@adminjs/express')
  console.log('✅ AdminJS Express imported successfully')
  
  const { Database, Resource } = require('@adminjs/prisma')
  console.log('✅ AdminJS Prisma imported successfully')
  
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  console.log('✅ Prisma client created successfully')
  
  AdminJS.registerAdapter({ Database, Resource })
  console.log('✅ AdminJS adapter registered successfully')
  
  const admin = new AdminJS({
    resources: [
      { resource: { model: prisma.user, client: prisma } }
    ],
    rootPath: '/admin'
  })
  console.log('✅ AdminJS instance created successfully')
  
  const adminRouter = AdminJSExpress.buildRouter(admin)
  console.log('✅ AdminJS router created successfully')
  
  app.use('/admin', adminRouter)
  console.log('✅ AdminJS router mounted successfully')
  
  app.listen(3001, () => {
    console.log('🚀 Test server running on http://localhost:3001')
    console.log('🛠️ AdminJS available at http://localhost:3001/admin')
  })
  
} catch (error) {
  console.error('❌ AdminJS setup failed:', error.message)
  console.error('Stack:', error.stack)
}