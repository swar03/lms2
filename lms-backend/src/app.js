// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('LMS Backend Running!'));

app.listen(3000, () => console.log('Server started on port 3000'));

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

const moduleRoutes = require('./routes/moduleRoutes');
app.use('/api/modules', moduleRoutes);

const lectureRoutes = require('./routes/lectureRoutes');
app.use('/api/lectures', lectureRoutes);

const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/quizzes', quizRoutes);

// auth + new enrollments
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/workflow'));
app.use('/api', require('./routes/notifications'));
app.use('/api', require('./routes/enrollmentRoutes'));

const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));