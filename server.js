import express from 'express';
import AppRoutes from './routes/index';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use('/', AppRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
