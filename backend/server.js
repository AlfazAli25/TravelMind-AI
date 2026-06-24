import app from './src/app.js';
import env from './src/config/env.js';

// Only start Express listener if not running in a Vercel Serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 TravelMind AI server running on port ${env.PORT}`);
    console.log(`📍 Environment: ${env.NODE_ENV}`);
  });
}

export default app;
