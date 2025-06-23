import React from 'react';
import { BarChart3, TrendingUp, Clock, Target, CheckCircle, AlertTriangle } from 'lucide-react';

const Performance: React.FC = () => {
  // Mock performance data - in a real app, this would come from your backend
  const performanceMetrics = {
    accuracy: 94.2,
    precision: 91.8,
    recall: 96.5,
    f1Score: 94.1,
    avgProcessingTime: 2.3,
    totalDetections: 1247,
    successfulDetections: 1174,
    modelVersion: '1.2.0',
    lastUpdated: '2025-01-15'
  };

  const recentActivity = [
    { id: 1, type: 'image', status: 'success', confidence: 95.2, timestamp: '2 minutes ago' },
    { id: 2, type: 'video', status: 'success', confidence: 89.7, timestamp: '15 minutes ago' },
    { id: 3, type: 'image', status: 'success', confidence: 92.4, timestamp: '1 hour ago' },
    { id: 4, type: 'live', status: 'warning', confidence: 76.3, timestamp: '2 hours ago' },
    { id: 5, type: 'image', status: 'success', confidence: 88.9, timestamp: '3 hours ago' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600">
          Monitor system performance, accuracy metrics, and detection statistics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-green-600">{performanceMetrics.accuracy}%</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${performanceMetrics.accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precision</p>
              <p className="text-2xl font-bold text-blue-600">{performanceMetrics.precision}%</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${performanceMetrics.precision}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recall</p>
              <p className="text-2xl font-bold text-purple-600">{performanceMetrics.recall}%</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${performanceMetrics.recall}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-orange-600">{performanceMetrics.avgProcessingTime}s</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Per image analysis</p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Detections</span>
              <span className="font-semibold">{performanceMetrics.totalDetections.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Successful Detections</span>
              <span className="font-semibold text-green-600">{performanceMetrics.successfulDetections.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold">
                {((performanceMetrics.successfulDetections / performanceMetrics.totalDetections) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">F1 Score</span>
              <span className="font-semibold">{performanceMetrics.f1Score}%</span>
            </div>
          </div>
        </div>

        {/* Model Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Model Version</span>
              <span className="font-semibold">v{performanceMetrics.modelVersion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Architecture</span>
              <span className="font-semibold">YOLOv8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Training Dataset</span>
              <span className="font-semibold">Custom Vehicle Damage</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-semibold">{performanceMetrics.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Detection Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(activity.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{activity.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.confidence}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Performance Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          <li>Use high-quality, well-lit images for better detection accuracy</li>
          <li>Ensure the vehicle damage is clearly visible in the frame</li>
          <li>Avoid blurry or low-resolution images that may affect model performance</li>
          <li>For video analysis, use stable footage without excessive camera movement</li>
          <li>Check that the damage area occupies a reasonable portion of the image</li>
        </ul>
      </div>
    </div>
  );
};

export default Performance;
