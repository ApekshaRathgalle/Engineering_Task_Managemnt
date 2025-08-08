import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Users, CheckSquare } from 'lucide-react';
import { useAdmin } from '../../context/Admin.Context';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { stats, setStats, loading, setLoading } = useAdmin();
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
      
      // Mock additional report data - in real app, this would come from APIs
      setReportData({
        weeklyStats: [
          { week: 'Week 1', completed: 12, created: 15 },
          { week: 'Week 2', completed: 18, created: 20 },
          { week: 'Week 3', completed: 15, created: 18 },
          { week: 'Week 4', completed: 22, created: 25 },
        ],
        userActivity: [
          { user: 'John Doe', tasksCompleted: 8, tasksCreated: 12 },
          { user: 'Jane Smith', tasksCompleted: 6, tasksCreated: 8 },
          { user: 'Mike Johnson', tasksCompleted: 10, tasksCreated: 15 },
          { user: 'Sarah Wilson', tasksCompleted: 4, tasksCreated: 6 },
        ],
        priorityDistribution: {
          high: 25,
          medium: 45,
          low: 30,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch report data');
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success('Report export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            View system performance and user activity reports.
          </p>
        </div>
        <button
          onClick={exportReport}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+12% this month</span>
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+8% this month</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <CheckSquare className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">+5% this month</span>
                </div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time to Complete</p>
                <p className="text-3xl font-bold text-purple-600">3.2</p>
                <p className="text-xs text-gray-500">days</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                  <span className="text-xs text-red-600">-2% this month</span>
                </div>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Weekly Progress</h2>
          </div>
          
          {reportData && (
            <div className="space-y-4">
              {reportData.weeklyStats.map((week: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {week.week}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <div className="bg-green-200 rounded-full overflow-hidden flex-1">
                      <div 
                        className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(week.completed / week.created) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{week.completed}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {week.completed}/{week.created}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Task Priority Distribution</h2>
          </div>
          
          {reportData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">High Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-red-200 rounded-full overflow-hidden w-32">
                    <div 
                      className="bg-red-500 h-4 rounded-full"
                      style={{ width: `${reportData.priorityDistribution.high}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{reportData.priorityDistribution.high}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-600">Medium Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-200 rounded-full overflow-hidden w-32">
                    <div 
                      className="bg-yellow-500 h-4 rounded-full"
                      style={{ width: `${reportData.priorityDistribution.medium}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{reportData.priorityDistribution.medium}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">Low Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-200 rounded-full overflow-hidden w-32">
                    <div 
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${reportData.priorityDistribution.low}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{reportData.priorityDistribution.low}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Activity Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top User Activity</h2>
        
        {reportData && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.userActivity.map((user: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.tasksCompleted}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.tasksCreated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round((user.tasksCompleted / user.tasksCreated) * 100)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;