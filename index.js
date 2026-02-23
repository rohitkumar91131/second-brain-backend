import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import goalRoutes from './src/routes/goalRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import journalRoutes from './src/routes/journalRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';
import resourceRoutes from './src/routes/resourceRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes , ()=>
console.log("hd"));
app.use('/api/user', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
    res.send('API is running....'); 
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
