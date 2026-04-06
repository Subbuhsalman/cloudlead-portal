import cors from 'cors';
import { Express } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

// Define the allowed origins
const corsOpts = {
  origin: true,
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS'
  ],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With','Refresh-Token'],
  credentials: true,
};



const securitySetup = (app: Express, express: any) =>
  app
    .use(cors(corsOpts))
    // Serve static files from uploads directory - BEFORE other middleware
    .use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
      // Set proper headers for static files
      setHeaders: (res, path, stat) => {
        // Allow cross-origin access for static files
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        // Set cache headers for better performance
        res.set('Cache-Control', 'public, max-age=31536000');
      }
    }))
    .use(express.json())
    .use(cookieParser());


export default securitySetup;
