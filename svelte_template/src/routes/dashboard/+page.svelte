<script lang="ts">
  import { Users, Activity, TrendingUp, CheckCircle } from 'lucide-svelte'
  import Card from '$lib/components/Card.svelte'
  import { user } from '$lib/stores/auth'

  /**
   * Dashboard Page
   *
   * Example dashboard with mock statistics and data.
   * TODO: Replace with your own dashboard content and real data.
   */

  // Mock statistics - TODO: Replace with real data from API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Now',
      value: '567',
      change: '+5%',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Growth',
      value: '89%',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Completed',
      value: '432',
      change: '+8%',
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  // Mock recent activity - TODO: Replace with real data
  const recentActivity = [
    { id: 1, action: 'User registered', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Item created', user: 'Jane Smith', time: '15 minutes ago' },
    { id: 3, action: 'Profile updated', user: 'Bob Johnson', time: '1 hour ago' },
    { id: 4, action: 'Settings changed', user: 'Alice Brown', time: '2 hours ago' },
  ]
</script>

<div class="page-container">
  <div class="page-content">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Welcome back, {$user?.name}! Here's what's happening today.
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each stats as stat}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-1">
                {stat.change} from last month
              </p>
            </div>
            <div class="p-3 rounded-lg {stat.bgColor}">
              <svelte:component this={stat.icon} class="w-6 h-6 {stat.color}" />
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <Card title="Recent Activity" description="Latest updates from your team">
        <div class="space-y-4">
          {#each recentActivity as activity}
            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{activity.user}</p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Quick Actions -->
      <Card title="Quick Actions" description="Common tasks and shortcuts">
        <div class="grid grid-cols-2 gap-4">
          <button class="btn-primary text-left justify-start">
            <Users class="w-4 h-4 mr-2" />
            Add User
          </button>
          <button class="btn-secondary text-left justify-start">
            <Activity class="w-4 h-4 mr-2" />
            View Reports
          </button>
          <button class="btn-secondary text-left justify-start">
            <TrendingUp class="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button class="btn-secondary text-left justify-start">
            <CheckCircle class="w-4 h-4 mr-2" />
            Tasks
          </button>
        </div>

        <div
          class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">Getting Started</p>
          <p class="text-xs text-blue-700 dark:text-blue-400">
            This is a starter template. Replace this dashboard with your own content, connect to
            your API, and build amazing features!
          </p>
        </div>
      </Card>
    </div>
  </div>
</div>
