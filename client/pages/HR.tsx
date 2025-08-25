import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { 
  Users, 
  UserPlus, 
  Calendar as CalendarIcon,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  Plus,
  Download,
  Upload
} from "lucide-react";

export default function HR() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("employees");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Static translation maps to eliminate dynamic template literal keys
  const hrAttendanceStatusLabel: Record<string, string> = {
    present: t('hr.attendance.status.present'),
    absent: t('hr.attendance.status.absent'),
    late: t('hr.attendance.status.late'),
    half_day: t('hr.attendance.status.half_day')
  };

  const hrLeaveStatusLabel: Record<string, string> = {
    pending: t('hr.leaves.status.pending'),
    approved: t('hr.leaves.status.approved'),
    rejected: t('hr.leaves.status.rejected')
  };

  const hrLeaveTypeLabel: Record<string, string> = {
    vacation: t('hr.leaves.types.vacation'),
    sick: t('hr.leaves.types.sick'),
    personal: t('hr.leaves.types.personal'),
    maternity: t('hr.leaves.types.maternity'),
    paternity: t('hr.leaves.types.paternity')
  };

  const hrStats = [
    { 
      label: t('hr.stats.totalEmployees'), 
      value: "156", 
      change: "+3", 
      icon: Users,
      color: "text-blue-600"
    },
    { 
      label: t('hr.stats.attendanceRate'), 
      value: "94.2%", 
      change: "+1.2%", 
      icon: CheckCircle,
      color: "text-green-600"
    },
    { 
      label: t('hr.stats.pendingReviews'), 
      value: "12", 
      change: "-4", 
      icon: FileText,
      color: "text-orange-600"
    },
    { 
      label: t('hr.stats.openPositions'), 
      value: "8", 
      change: "+2", 
      icon: UserPlus,
      color: "text-purple-600"
    }
  ];

  const employees = [
    {
      id: "EMP001",
      employeeId: "E2024001",
      nameKey: 'hr.employeeData.names.sarahJohnson',
      positionKey: 'hr.employeeData.positions.seniorSalesManager',
      locationKey: 'hr.employeeData.locations.sanFrancisco',
      managerKey: 'hr.employeeData.names.mikeDavis',
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      department: "sales",
      startDate: "2022-03-15",
      status: "active",
      salary: 85000,
      avatar: null,
      lastReview: "2024-01-15",
      nextReview: "2024-07-15",
      attendanceRate: 96.5,
      performanceRating: 4.5,
      totalLeaves: 12,
      usedLeaves: 8
    },
    {
      id: "EMP002",
      employeeId: "E2024002", 
      nameKey: 'hr.employeeData.names.mikeDavis',
      positionKey: 'hr.employeeData.positions.salesDirector',
      locationKey: 'hr.employeeData.locations.sanFrancisco',
      manager: "John Smith",
      email: "mike.davis@company.com",
      phone: "+1 (555) 987-6543",
      department: "sales",
      startDate: "2021-01-10",
      status: "active",
      salary: 95000,
      avatar: null,
      lastReview: "2024-01-10",
      nextReview: "2024-07-10",
      attendanceRate: 98.2,
      performanceRating: 4.8,
      totalLeaves: 15,
      usedLeaves: 6
    },
    {
      id: "EMP003",
      employeeId: "E2024003",
      nameKey: 'hr.employeeData.names.lisaChen',
      positionKey: 'hr.employeeData.positions.hrSpecialist',
      locationKey: 'hr.employeeData.locations.austin',
      manager: "Sarah Wilson",
      email: "lisa.chen@company.com", 
      phone: "+1 (555) 456-7890",
      department: "hr",
      startDate: "2023-06-01",
      status: "active",
      salary: 65000,
      avatar: null,
      lastReview: "2023-12-01",
      nextReview: "2024-06-01",
      attendanceRate: 92.8,
      performanceRating: 4.2,
      totalLeaves: 10,
      usedLeaves: 7
    }
  ];

  const leaveRequests = [
    {
      id: "LEAVE001",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      department: "Sales",
      type: "vacation",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      days: 5,
      reason: "Family vacation",
      status: "pending",
      appliedDate: "2024-01-15",
      approver: "Mike Davis"
    },
    {
      id: "LEAVE002",
      employeeId: "EMP003",
      employeeName: "Lisa Chen", 
      department: "HR",
      type: "sick",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 3,
      reason: "Medical appointment",
      status: "approved",
      appliedDate: "2024-01-18",
      approver: "Sarah Wilson",
      approvedDate: "2024-01-19"
    }
  ];

  const attendanceData = [
    {
      id: "ATT001",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      date: "2024-01-15",
      checkIn: "09:00 AM",
      checkOut: "06:30 PM",
      totalHours: 8.5,
      breakTime: 60,
      status: "present",
      overtime: 0.5
    },
    {
      id: "ATT002", 
      employeeId: "EMP002",
      employeeName: "Mike Davis",
      date: "2024-01-15",
      checkIn: "08:45 AM",
      checkOut: "06:00 PM",
      totalHours: 8.25,
      breakTime: 45,
      status: "present",
      overtime: 0
    },
    {
      id: "ATT003",
      employeeId: "EMP003",
      employeeName: "Lisa Chen",
      date: "2024-01-15",
      checkIn: "09:15 AM",
      checkOut: "05:45 PM", 
      totalHours: 7.5,
      breakTime: 60,
      status: "late",
      overtime: 0
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-300",
      inactive: "bg-gray-100 text-gray-800 border-gray-300",
      terminated: "bg-red-100 text-red-800 border-red-300",
      on_leave: "bg-yellow-100 text-yellow-800 border-yellow-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      present: "bg-green-100 text-green-800 border-green-300",
      absent: "bg-red-100 text-red-800 border-red-300",
      late: "bg-orange-100 text-orange-800 border-orange-300",
      half_day: "bg-blue-100 text-blue-800 border-blue-300"
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getLeaveTypeColor = (type: string) => {
  // Static translation maps to eliminate dynamic template literals in t() calls
  const hrAttendanceStatusLabel: Record<string, string> = {
    present: t('hr.attendance.status.present'),
    absent: t('hr.attendance.status.absent'),
    late: t('hr.attendance.status.late'),
    half_day: t('hr.attendance.status.half_day')
  };

  const hrLeaveStatusLabel: Record<string, string> = {
    pending: t('hr.leaves.status.pending'),
    approved: t('hr.leaves.status.approved'),
    rejected: t('hr.leaves.status.rejected')
  };

  const hrLeaveTypeLabel: Record<string, string> = {
    vacation: t('hr.leaves.types.vacation'),
    sick: t('hr.leaves.types.sick'),
    personal: t('hr.leaves.types.personal'),
    maternity: t('hr.leaves.types.maternity'),
    paternity: t('hr.leaves.types.paternity')
  };
    const colors = {
      vacation: "bg-blue-100 text-blue-800",
      sick: "bg-red-100 text-red-800", 
      personal: "bg-purple-100 text-purple-800",
      maternity: "bg-pink-100 text-pink-800",
      paternity: "bg-indigo-100 text-indigo-800"
    };
    return colors[type as keyof typeof colors] || colors.vacation;
  };

  const AddEmployeeDialog = () => (
    <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('hr.addEmployee.title')}</DialogTitle>
          <DialogDescription>
            {t('hr.addEmployee.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('hr.addEmployee.personalInfo')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('hr.addEmployee.firstName')}</Label>
                <Input id="firstName" placeholder={t('hr.addEmployee.placeholders.firstName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('hr.addEmployee.lastName')}</Label>
                <Input id="lastName" placeholder={t('hr.addEmployee.placeholders.lastName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('hr.addEmployee.email')}</Label>
                <Input id="email" type="email" placeholder="john.doe@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('hr.addEmployee.phone')}</Label>
                <Input id="phone" placeholder={t('hr.addEmployee.placeholders.phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{t('hr.addEmployee.dob')}</Label>
                <Input id="dateOfBirth" type="date" />
              </div>
              <div className="space-y-2">
        <Label htmlFor="gender">{t('hr.addEmployee.gender')}</Label>
                <Select>
                  <SelectTrigger>
          <SelectValue placeholder={t('hr.addEmployee.selectGender')} />
                  </SelectTrigger>
                  <SelectContent>
          <SelectItem value="male">{t('hr.addEmployee.genders.male')}</SelectItem>
          <SelectItem value="female">{t('hr.addEmployee.genders.female')}</SelectItem>
          <SelectItem value="other">{t('hr.addEmployee.genders.other')}</SelectItem>
          <SelectItem value="prefer-not-to-say">{t('hr.addEmployee.genders.preferNot')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('hr.addEmployee.employmentDetails')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeId">{t('hr.addEmployee.employeeId')}</Label>
                <Input id="employeeId" placeholder="E2024004" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('hr.addEmployee.startDate')}</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
        <Label htmlFor="department">{t('hr.addEmployee.department')}</Label>
                <Select>
                  <SelectTrigger>
          <SelectValue placeholder={t('hr.addEmployee.selectDepartment')} />
                  </SelectTrigger>
                  <SelectContent>
          <SelectItem value="sales">{t('departments.sales')}</SelectItem>
          <SelectItem value="hr">{t('departments.hr')}</SelectItem>
          <SelectItem value="marketing">{t('departments.marketing')}</SelectItem>
          <SelectItem value="manufacturing">{t('departments.manufacturing')}</SelectItem>
          <SelectItem value="support">{t('departments.support')}</SelectItem>
          <SelectItem value="it">{t('departments.it')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">{t('hr.addEmployee.position')}</Label>
                <Input id="position" placeholder={t('hr.addEmployee.placeholders.position')} />
              </div>
              <div className="space-y-2">
        <Label htmlFor="manager">{t('hr.addEmployee.manager')}</Label>
                <Select>
                  <SelectTrigger>
          <SelectValue placeholder={t('hr.addEmployee.selectManager')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mike-davis">Mike Davis</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">{t('hr.addEmployee.salary')}</Label>
                <Input id="salary" type="number" placeholder="65000" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('hr.addEmployee.address')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">{t('hr.addEmployee.street')}</Label>
                <Input id="street" placeholder={t('hr.addEmployee.placeholders.street')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('hr.addEmployee.city')}</Label>
                <Input id="city" placeholder={t('hr.addEmployee.placeholders.city')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t('hr.addEmployee.state')}</Label>
                <Input id="state" placeholder={t('hr.addEmployee.placeholders.state')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">{t('hr.addEmployee.zip')}</Label>
                <Input id="zipCode" placeholder={t('hr.addEmployee.placeholders.zip')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('hr.addEmployee.country')}</Label>
                <Input id="country" placeholder={t('hr.addEmployee.placeholders.country')} defaultValue="United States" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => setIsAddEmployeeOpen(false)}>
            {t('hr.addEmployee.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 transform rotate-12 translate-y-1"></div>
              <Users className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">
                {t('hr.title') || 'HR Management'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('hr.subtitle') || 'Manage employees, attendance, leave requests, and performance'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              {t('hr.actions.exportReport') || 'Export Report'}
            </Button>
            <Button 
              onClick={() => setIsAddEmployeeOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {t('hr.actions.addEmployee') || 'Add Employee'}
            </Button>
          </div>
        </div>
      </div>

      {/* Elite Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hrStats.map((stat, index) => (
          <Card key={index} className="bg-white/80 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.label}</CardTitle>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2">
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <p className="text-xs text-blue-600/70">
                <span className="text-blue-600">{stat.change}</span> {t('common.fromLastMonth') || 'from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="employees"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('hr.tabs.employees') || 'Employees'}
          </TabsTrigger>
          <TabsTrigger 
            value="attendance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('hr.tabs.attendance') || 'Attendance'}
          </TabsTrigger>
          <TabsTrigger 
            value="leaves"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('hr.tabs.leaves') || 'Leave Requests'}
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('hr.tabs.performance') || 'Performance'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('hr.filters.searchPlaceholder')} className="pl-8" />
                  </div>
                </div>
                <Select defaultValue="all-departments">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-departments">{t('hr.filters.allDepartments')}</SelectItem>
                    <SelectItem value="sales">{t('departments.sales')}</SelectItem>
                    <SelectItem value="hr">{t('departments.hr')}</SelectItem>
                    <SelectItem value="marketing">{t('departments.marketing')}</SelectItem>
                    <SelectItem value="manufacturing">{t('departments.manufacturing')}</SelectItem>
                    <SelectItem value="support">{t('departments.support')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">{t('hr.filters.allStatus')}</SelectItem>
                    <SelectItem value="active">{t('common.active')}</SelectItem>
                    <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                    <SelectItem value="on_leave">{t('hr.status.onLeave')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employees List */}
          <div className="space-y-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{t(employee.nameKey)}</h3>
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {employee.employeeId}
                          </Badge>
                        </div>
                        
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {t('departments.' + employee.department)} - {t(employee.positionKey)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {employee.locationKey ? t(employee.locationKey) : ''}
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.manager')} </span>
                            <span className="font-semibold">{employee.managerKey ? t(employee.managerKey) : employee.manager}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.startDate')} </span>
                            <span className="font-semibold">{employee.startDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.attendance')} </span>
                            <span className="font-semibold">{employee.attendanceRate}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.performance')} </span>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{employee.performanceRating}/5.0</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.floor(employee.performanceRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.leaveBalance')} </span>
                            <span className="font-semibold">{employee.totalLeaves - employee.usedLeaves}/{employee.totalLeaves} {t('hr.employeeCard.days')}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('hr.employeeCard.nextReview')} </span>
                            <span className="font-semibold">{employee.nextReview}</span>
                          </div>
                        </div>

                        <Progress 
                          value={((employee.totalLeaves - employee.usedLeaves) / employee.totalLeaves) * 100} 
                          className="w-full h-2" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>{t('hr.attendance.calendarTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Attendance Records */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('hr.attendance.today')}</h3>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  {t('hr.attendance.import')}
                </Button>
              </div>

              {attendanceData.map((record) => (
                <Card key={record.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{record.employeeName}</h4>
                          <p className="text-sm text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {hrAttendanceStatusLabel[record.status] || record.status}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('hr.attendance.checkIn')} </span>
                        <span className="font-semibold">{record.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('hr.attendance.checkOut')} </span>
                        <span className="font-semibold">{record.checkOut}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('hr.attendance.totalHours')} </span>
                        <span className="font-semibold">{record.totalHours}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('hr.attendance.breakTime')} </span>
                        <span className="font-semibold">{record.breakTime}min</span>
                      </div>
                    </div>

                    {record.overtime > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">{t('hr.attendance.overtime')} </span>
                        <span className="font-semibold text-orange-600">{record.overtime}h</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('hr.leaves.title')}</h3>
            <Button onClick={() => setIsAddLeaveOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('hr.leaves.newRequest')}
            </Button>
          </div>

          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <Card key={leave.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{leave.employeeName}</h4>
                          <Badge className={getLeaveTypeColor(leave.type)}>
                            {hrLeaveTypeLabel[leave.type] || leave.type}
                          </Badge>
                          <Badge className={getStatusColor(leave.status)}>
                            {hrLeaveStatusLabel[leave.status] || leave.status}
                          </Badge>
                        </div>
                        
                        <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                          <div>
                            <span>{t('hr.leaves.department')}: </span>
                            <span className="font-semibold">{t('departments.' + leave.department.toLowerCase())}</span>
                          </div>
                          <div>
                            <span>{t('hr.leaves.duration')}: </span>
                            <span className="font-semibold">{leave.days} {t('hr.leaves.days')}</span>
                          </div>
                          <div>
                            <span>{t('hr.leaves.applied')}: </span>
                            <span className="font-semibold">{leave.appliedDate}</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('hr.leaves.period')} </span>
                          <span className="font-semibold">{leave.startDate} {t('hr.leaves.to')} {leave.endDate}</span>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('hr.leaves.reason')} </span>
                          <span>{leave.reason}</span>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('hr.leaves.approver')} </span>
                          <span className="font-semibold">{leave.approver}</span>
                          {leave.approvedDate && (
                            <span className="text-muted-foreground"> ({t('hr.leaves.approvedOn')} {leave.approvedDate})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {leave.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {t('hr.leaves.actions.approve')}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="h-4 w-4" />
                          {t('hr.leaves.actions.reject')}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('hr.performance.overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('hr.performance.averageRating')}</span>
                    <span className="font-semibold">4.3/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('hr.performance.reviewsCompleted')}</span>
                    <span className="font-semibold">144/156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('hr.performance.pendingReviews')}</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('hr.performance.topPerformers')}</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('hr.performance.upcomingReviews')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.slice(0, 3).map((employee) => (
          <div key={employee.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
            <div className="font-medium">{t(employee.nameKey)}</div>
            <div className="text-sm text-muted-foreground">{t('departments.' + employee.department)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {employee.nextReview}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddEmployeeDialog />
    </div>
  );
}
