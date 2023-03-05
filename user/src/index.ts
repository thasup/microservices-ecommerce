import { connect } from 'mongoose';
import { app } from './app';

const start = async (): Promise<void> => {
  console.log('Starting...');
  if (process.env.JWT_KEY == null) {
    throw new Error('JWT_KEY must be defined');
  }
  if (process.env.MONGO_URI_USER == null) {
    throw new Error('MONGO_URI_USER must be defined');
  }

  try {
    await connect(process.env.MONGO_URI_USER);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`User server: Listening on port ${port}`);
  });
};

void start();
