import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Video, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {  const features = [
    {
      icon: Camera,
      title: 'Image Detection',
      description: 'Upload vehicle images to detect and analyze damage with high precision.',
      link: '/image',
      color: 'primary'
    },
    {
      icon: Video,
      title: 'Video Detection',
      description: 'Process video files for comprehensive damage assessment over time.',
      link: '/video',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Performance Metrics',
      description: 'View detailed analytics and model performance statistics.',
      link: '/performance',
      color: 'orange'
    }
  ];
  return (
    <div className="space-y-12">      {/* Hero Section */}
      <div className="text-center space-y-8 py-12 px-6 sm:px-8 lg:px-12 bg-white/95 backdrop-blur-md rounded-xl">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Automated Vehicle
            <span className="text-primary-600 block">Damage Detection</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A System for Automated Vehicle Damage Localization and Severity Estimation Using Deep Learning
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/image"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Detection
          </Link>
          <Link
            to="/performance"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            View Performance
          </Link>
        </div>
      </div>        {/* Detection Examples */}
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-12 bg-white/95 backdrop-blur-md rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detection Examples</h2>
            <p className="text-lg text-gray-600">
              See our AI-powered damage detection in action with real examples
            </p>
          </div>

          {/* Image Detection Examples */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center">
              <Camera className="mr-2 h-5 w-5 text-primary-600" />
              Image Detection Examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src="/image_example.png"
                  alt="Vehicle damage detection example 1"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src="/image_example_2.png"
                  alt="Vehicle damage detection example 2"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/image"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Try Image Detection
              </Link>
            </div>
          </div>

          {/* Video Detection Example */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center">
              <Video className="mr-2 h-5 w-5 text-purple-600" />
              Video Detection Example
            </h3>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/j6N7z12TT-A"
                  title="Vehicle Damage Detection Video Example"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-96"
                ></iframe>
                <div className="p-4">
                  <div className="text-center">
                    <Link
                      to="/video"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      Try Video Detection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 py-12 bg-white/95 backdrop-blur-md rounded-xl">
          {features.map(({ icon: Icon, title, description, link, color }) => (
            <Link
              key={title}
              to={link}
              className="group p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
};

export default Home;
