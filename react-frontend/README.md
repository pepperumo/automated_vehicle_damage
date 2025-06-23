# Vehicle Damage Detection - React Frontend

A modern React TypeScript frontend for the Automated Vehicle Damage Detection System using Deep Learning.

## Features

- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Image Detection**: Upload and analyze vehicle images for damage detection
- **Video Processing**: Upload video files for frame-by-frame damage analysis
- **Live Detection**: Real-time damage detection using camera feed
- **Performance Analytics**: View system metrics and detection statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Upload**: Drag & drop file uploads with validation
- **Real-time Updates**: Live status updates and progress indicators

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **HTTP Client**: Axios for API communication
- **File Upload**: React Dropzone for enhanced file upload experience
- **Routing**: React Router DOM for navigation
- **Build Tool**: Create React App with TypeScript template

## Project Structure

```
react-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── FileUpload.tsx      # File upload component
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── ImageDetection.tsx  # Image upload and detection
│   │   ├── VideoDetection.tsx  # Video upload and processing
│   │   ├── LiveDetection.tsx   # Real-time camera detection
│   │   ├── Performance.tsx     # Analytics and metrics
│   │   └── Login.tsx           # User authentication
│   ├── hooks/
│   │   └── useDetection.ts     # Custom hooks for API calls
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── types/
│   │   └── api.ts              # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # App entry point
│   └── index.css               # Global styles with Tailwind
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. **Navigate to the React frontend directory:**
   ```bash
   cd react-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Configuration

The frontend is configured to proxy API requests to the Flask backend running on `http://localhost:5000`. You can modify this in the `package.json` file:

```json
{
  "proxy": "http://localhost:5000"
}
```

For production deployments, set the `REACT_APP_API_URL` environment variable:

```bash
REACT_APP_API_URL=http://your-backend-server.com npm run build
```

## Backend Integration

The React frontend communicates with the Flask backend through the following API endpoints:

- `POST /predict` - Image damage detection
- `POST /predict_img` - Video damage detection
- `GET /video_feed` - Live video stream
- `POST /stop` - Stop live video stream

## Components Overview

### Layout Component
- Responsive navigation header
- Mobile-friendly hamburger menu
- Footer with system information
- Consistent layout across all pages

### FileUpload Component
- Drag & drop file upload interface
- File type and size validation
- Upload progress indicators
- Error handling and user feedback

### Page Components
- **Home**: Landing page with feature overview
- **ImageDetection**: Image upload and AI-powered damage detection
- **VideoDetection**: Video file processing with frame-by-frame analysis
- **LiveDetection**: Real-time camera feed with live damage detection
- **Performance**: System analytics and performance metrics
- **Login**: User authentication interface

## Styling

The application uses Tailwind CSS for styling with a custom configuration:

- **Primary Colors**: Blue color palette for main UI elements
- **Success/Error States**: Green and red color schemes for feedback
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Ready for dark mode implementation
- **Animations**: Smooth transitions and loading states

## Development

### Running in Development Mode

1. Ensure the Flask backend is running on port 5000
2. Start the React development server:
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (not recommended)

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Vehicle Damage Detection
```

## Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. The `build` folder contains the production-ready files

3. Serve the build folder using a web server like Nginx or serve it from your Flask backend

### Docker Deployment

Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Performance Considerations

- **Code Splitting**: Implement route-based code splitting for better performance
- **Lazy Loading**: Use React.lazy() for component lazy loading
- **Image Optimization**: Optimize uploaded images before sending to backend
- **Caching**: Implement service worker for caching static assets
- **Bundle Analysis**: Use webpack-bundle-analyzer to optimize bundle size

## Security

- **Input Validation**: Client-side validation for file uploads
- **CORS Configuration**: Proper CORS setup for backend communication
- **Content Security Policy**: Implement CSP headers for production
- **File Type Validation**: Strict file type and size validation

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure Flask backend is running on the correct port
   - Check CORS configuration in the backend
   - Verify API endpoints are accessible

2. **File Upload Problems**
   - Check file size limits (default 10MB)
   - Verify file type restrictions
   - Ensure backend accepts multipart/form-data

3. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify TypeScript configuration

## License

This project is part of the Automated Vehicle Damage Detection System.
