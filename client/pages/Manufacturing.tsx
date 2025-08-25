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
import { 
  Factory, 
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  Upload,
  Play,
  Pause,
  MapPin,
  User,
  Building,
  Wrench,
  ClipboardList,
  Target,
  Settings,
  Star,
  Zap
} from "lucide-react";

export default function Manufacturing() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const manufacturingStats = [
    { 
  label: t('manufacturing.stats.activeOrders'), 
      value: "67", 
      change: "+8", 
      icon: ClipboardList,
      color: "text-blue-600"
    },
    { 
  label: t('manufacturing.stats.totalInventory'), 
      value: "2,341", 
      change: "+127", 
      icon: Package,
      color: "text-green-600"
    },
    { 
  label: t('manufacturing.stats.qualityRate'), 
      value: "99.1%", 
      change: "+0.3%", 
      icon: CheckCircle,
      color: "text-purple-600"
    },
    { 
  label: t('manufacturing.stats.onTimeDelivery'), 
      value: "94.5%", 
      change: "+2.1%", 
      icon: Truck,
      color: "text-orange-600"
    }
  ];

  const inventoryItems = [
    {
      id: "INV001",
      name: "Steel Plates - Grade A",
      sku: "SP-A-001",
      category: "Raw Materials",
      quantity: 450,
      unit: "pieces",
      reorderLevel: 100,
      location: "Warehouse A-1",
      supplier: {
        name: "MetalCorp Industries",
        contact: "John Smith",
        email: "john@metalcorp.com"
      },
      pricing: {
        cost: 125.50,
        price: 189.00,
        currency: "USD"
      },
      status: "in_stock",
      lastUpdated: "2024-01-15",
      description: "High-grade steel plates for manufacturing"
    },
    {
      id: "INV002", 
      name: "Aluminum Rods",
      sku: "AR-002",
      category: "Raw Materials", 
      quantity: 25,
      unit: "kg",
      reorderLevel: 50,
      location: "Warehouse B-2",
      supplier: {
        name: "AlumTech Solutions",
        contact: "Sarah Johnson",
        email: "sarah@alumtech.com"
      },
      pricing: {
        cost: 8.75,
        price: 15.50,
        currency: "USD"
      },
      status: "low_stock",
      lastUpdated: "2024-01-14",
      description: "Premium aluminum rods for precision components"
    },
    {
      id: "INV003",
      name: "Circuit Boards - Model X1",
      sku: "CB-X1-003",
      category: "Components",
      quantity: 0,
      unit: "pieces",
      reorderLevel: 20,
      location: "Electronics Bay",
      supplier: {
        name: "TechComponents Ltd",
        contact: "Mike Chen",
        email: "mike@techcomp.com"
      },
      pricing: {
        cost: 45.00,
        price: 78.50,
        currency: "USD"
      },
      status: "out_of_stock",
      lastUpdated: "2024-01-12",
      description: "Advanced circuit boards for electronic assemblies"
    }
  ];

  const workOrders = [
    {
      id: "WO001",
      orderNumber: "WO-2024-001",
      title: "Production Run - Model Alpha",
      description: "Manufacturing 500 units of Model Alpha product line",
      type: "production",
      priority: "high",
      status: "in_progress",
      assignedTo: ["John Doe", "Sarah Wilson"],
      estimatedHours: 120,
      actualHours: 85,
      progress: 71,
      materials: [
        { name: "Steel Plates", quantity: 150, allocated: true },
        { name: "Circuit Boards", quantity: 500, allocated: false }
      ],
      startDate: "2024-01-10",
      dueDate: "2024-01-25",
      createdAt: "2024-01-08",
      notes: "Priority order for major client. Quality checks required at each stage."
    },
    {
      id: "WO002",
      orderNumber: "WO-2024-002", 
      title: "Equipment Maintenance - Line 3",
      description: "Scheduled maintenance for production line 3 equipment",
      type: "maintenance",
      priority: "medium",
      status: "pending",
      assignedTo: ["Mike Davis"],
      estimatedHours: 16,
      actualHours: 0,
      progress: 0,
      materials: [
        { name: "Lubricants", quantity: 5, allocated: true },
        { name: "Filters", quantity: 12, allocated: true }
      ],
      startDate: "2024-01-20",
      dueDate: "2024-01-21",
      createdAt: "2024-01-15",
      notes: "Monthly preventive maintenance schedule"
    },
    {
      id: "WO003",
      orderNumber: "WO-2024-003",
      title: "Quality Control - Batch 45",
      description: "Quality inspection and testing for completed batch 45",
      type: "quality_check",
      priority: "urgent",
      status: "completed",
      assignedTo: ["Lisa Chen", "David Park"],
      estimatedHours: 8,
      actualHours: 6,
      progress: 100,
      materials: [],
      startDate: "2024-01-12",
      dueDate: "2024-01-13",
      completedDate: "2024-01-13",
      createdAt: "2024-01-11",
      notes: "All tests passed. Ready for shipping."
    }
  ];

  const boms = [
    {
      id: "BOM001",
      productName: "Model Alpha - Premium",
      version: "v2.1",
      status: "active",
      totalCost: 234.50,
      components: [
        { name: "Steel Frame", quantity: 1, unit: "piece", cost: 125.50 },
        { name: "Circuit Board X1", quantity: 2, unit: "pieces", cost: 45.00 },
        { name: "Aluminum Housing", quantity: 1, unit: "piece", cost: 18.50 },
        { name: "Screws & Fasteners", quantity: 12, unit: "pieces", cost: 0.25 }
      ],
      createdDate: "2024-01-01",
      lastModified: "2024-01-10"
    },
    {
      id: "BOM002",
      productName: "Model Beta - Standard", 
      version: "v1.5",
      status: "active",
      totalCost: 156.75,
      components: [
        { name: "Aluminum Frame", quantity: 1, unit: "piece", cost: 89.00 },
        { name: "Basic Circuit Board", quantity: 1, unit: "piece", cost: 32.50 },
        { name: "Plastic Housing", quantity: 1, unit: "piece", cost: 12.25 },
        { name: "Assembly Kit", quantity: 1, unit: "set", cost: 23.00 }
      ],
      createdDate: "2023-12-15",
      lastModified: "2024-01-05"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      in_stock: "bg-green-100 text-green-800 border-green-300",
      low_stock: "bg-yellow-100 text-yellow-800 border-yellow-300",
      out_of_stock: "bg-red-100 text-red-800 border-red-300",
      discontinued: "bg-gray-100 text-gray-800 border-gray-300",
      pending: "bg-blue-100 text-blue-800 border-blue-300",
      in_progress: "bg-orange-100 text-orange-800 border-orange-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      on_hold: "bg-yellow-100 text-yellow-800 border-yellow-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      active: "bg-green-100 text-green-800 border-green-300",
      inactive: "bg-gray-100 text-gray-800 border-gray-300"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      production: Factory,
      maintenance: Wrench,
      repair: Settings,
      quality_check: CheckCircle
    };
    const Icon = icons[type as keyof typeof icons] || ClipboardList;
    return <Icon className="h-3 w-3" />;
  };

  const AddInventoryDialog = () => (
    <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('manufacturing.dialogs.addInventoryTitle')}</DialogTitle>
          <DialogDescription>
            {t('manufacturing.dialogs.addInventoryDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.basicInformation')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-name">{t('manufacturing.dialogs.itemName')}</Label>
                <Input id="item-name" placeholder={t('manufacturing.placeholders.itemName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">{t('manufacturing.dialogs.sku')}</Label>
                <Input id="sku" placeholder={t('manufacturing.placeholders.sku')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('manufacturing.dialogs.category')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('manufacturing.dialogs.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw-materials">{t('manufacturing.filters.rawMaterials')}</SelectItem>
                    <SelectItem value="components">{t('manufacturing.filters.components')}</SelectItem>
                    <SelectItem value="finished-goods">{t('manufacturing.filters.finishedGoods')}</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                    <SelectItem value="tools">Tools & Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">{t('manufacturing.dialogs.unit')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('manufacturing.dialogs.selectUnit')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('manufacturing.dialogs.description')}</Label>
              <Textarea id="description" placeholder={t('manufacturing.placeholders.description')} />
            </div>
          </div>

          {/* Inventory Details */}
          <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.inventoryDetails')}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
        <Label htmlFor="quantity">{t('manufacturing.dialogs.currentQuantity')}</Label>
                <Input id="quantity" type="number" placeholder={t('manufacturing.placeholders.quantity')} />
              </div>
              <div className="space-y-2">
        <Label htmlFor="reorder-level">{t('manufacturing.dialogs.reorderLevel')}</Label>
                <Input id="reorder-level" type="number" placeholder={t('manufacturing.placeholders.reorderLevel')} />
              </div>
              <div className="space-y-2">
        <Label htmlFor="location">{t('manufacturing.dialogs.storageLocation')}</Label>
                <Input id="location" placeholder={t('manufacturing.placeholders.location')} />
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.supplierInformation')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
        <Label htmlFor="supplier-name">{t('manufacturing.dialogs.supplierName')}</Label>
                <Input id="supplier-name" placeholder={t('manufacturing.placeholders.supplierName')} />
              </div>
              <div className="space-y-2">
        <Label htmlFor="supplier-contact">{t('manufacturing.dialogs.contactPerson')}</Label>
                <Input id="supplier-contact" placeholder={t('manufacturing.placeholders.supplierContact')} />
              </div>
              <div className="space-y-2 md:col-span-2">
        <Label htmlFor="supplier-email">{t('manufacturing.dialogs.supplierEmail')}</Label>
                <Input id="supplier-email" type="email" placeholder="john@metalcorp.com" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.pricing')}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cost-price">{t('manufacturing.dialogs.costPrice')}</Label>
                <Input id="cost-price" type="number" step="0.01" placeholder="125.50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">{t('manufacturing.dialogs.sellingPrice')}</Label>
                <Input id="selling-price" type="number" step="0.01" placeholder="189.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t('manufacturing.dialogs.currency')}</Label>
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
            {t('manufacturing.dialogs.cancel')}
          </Button>
          <Button onClick={() => setIsAddItemOpen(false)}>
            {t('manufacturing.actions.addItem')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const CreateWorkOrderDialog = () => (
    <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('manufacturing.dialogs.createWorkOrderTitle')}</DialogTitle>
          <DialogDescription>
            {t('manufacturing.dialogs.createWorkOrderDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.workOrderDetails')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-title">{t('manufacturing.dialogs.titleField')}</Label>
                <Input id="order-title" placeholder="Production Run - Model Alpha" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-type">{t('manufacturing.dialogs.typeField')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('manufacturing.dialogs.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">{t('manufacturing.enums.production')}</SelectItem>
                    <SelectItem value="maintenance">{t('manufacturing.enums.maintenance')}</SelectItem>
                    <SelectItem value="repair">{t('manufacturing.enums.repair')}</SelectItem>
                    <SelectItem value="quality_check">{t('manufacturing.enums.quality_check')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">{t('manufacturing.dialogs.priorityField')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('manufacturing.dialogs.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('manufacturing.enums.low')}</SelectItem>
                    <SelectItem value="medium">{t('manufacturing.enums.medium')}</SelectItem>
                    <SelectItem value="high">{t('manufacturing.enums.high')}</SelectItem>
                    <SelectItem value="urgent">{t('manufacturing.enums.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated-hours">{t('manufacturing.dialogs.estimatedHours')}</Label>
                <Input id="estimated-hours" type="number" placeholder="120" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-description">{t('manufacturing.dialogs.orderDescription')}</Label>
              <Textarea id="order-description" placeholder="Detailed description of the work to be performed..." />
            </div>
          </div>

          {/* Assignment & Schedule */}
          <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.assignmentSchedule')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
        <Label htmlFor="assigned-to">{t('manufacturing.dialogs.assignedTo')}</Label>
                <Select>
                  <SelectTrigger>
          <SelectValue placeholder={t('manufacturing.dialogs.selectTeamMembers')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="mike-davis">Mike Davis</SelectItem>
                    <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
        <Label htmlFor="start-date">{t('manufacturing.dialogs.startDate')}</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
        <Label htmlFor="due-date">{t('manufacturing.dialogs.dueDate')}</Label>
                <Input id="due-date" type="date" />
              </div>
            </div>
          </div>

          {/* Materials Required */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.materialsRequired')}</h3>
            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="material-item">{t('manufacturing.dialogs.materialItem')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('manufacturing.dialogs.selectItem')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steel-plates">Steel Plates - Grade A</SelectItem>
                      <SelectItem value="aluminum-rods">Aluminum Rods</SelectItem>
                      <SelectItem value="circuit-boards">Circuit Boards - Model X1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-quantity">{t('manufacturing.dialogs.quantity')}</Label>
                  <Input id="material-quantity" type="number" placeholder="150" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-unit">{t('manufacturing.dialogs.unitField')}</Label>
                  <Input id="material-unit" placeholder="pieces" disabled />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t('manufacturing.dialogs.addAnotherMaterial')}
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('manufacturing.dialogs.additionalNotes')}</h3>
            <Textarea placeholder="Special instructions, requirements, or notes..." />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
            {t('manufacturing.dialogs.saveDraft')}
          </Button>
            <Button onClick={() => setIsCreateOrderOpen(false)}>
            {t('manufacturing.dialogs.createWorkOrder')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('manufacturing.title')}</h1>
          <p className="text-muted-foreground">{t('manufacturing.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('manufacturing.actions.reports')}
          </Button>
          <Button onClick={() => setIsAddItemOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('manufacturing.actions.addItem')}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {manufacturingStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> {t('common.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">{t('manufacturing.tabs.inventory')}</TabsTrigger>
          <TabsTrigger value="work-orders">{t('manufacturing.tabs.workOrders')}</TabsTrigger>
          <TabsTrigger value="bom">{t('manufacturing.tabs.bom')}</TabsTrigger>
          <TabsTrigger value="production">{t('manufacturing.tabs.production')}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('manufacturing.filters.searchInventory')} className="pl-8" />
                  </div>
                </div>
                <Select defaultValue="all-categories">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">{t('manufacturing.filters.allCategories')}</SelectItem>
                    <SelectItem value="raw-materials">{t('manufacturing.filters.rawMaterials')}</SelectItem>
                    <SelectItem value="components">{t('manufacturing.filters.components')}</SelectItem>
                    <SelectItem value="finished-goods">{t('manufacturing.filters.finishedGoods')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">{t('manufacturing.filters.allStatus')}</SelectItem>
                    <SelectItem value="in_stock">{t('manufacturing.filters.inStock')}</SelectItem>
                    <SelectItem value="low_stock">{t('manufacturing.filters.lowStock')}</SelectItem>
                    <SelectItem value="out_of_stock">{t('manufacturing.filters.outOfStock')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Items */}
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">
                              {item.sku}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
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

                    {/* Item Details */}
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.inventory.category')} </span>
                        <span className="font-semibold">{item.category}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.inventory.quantity')} </span>
                        <span className="font-semibold">{item.quantity} {item.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.inventory.location')} </span>
                        <span className="font-semibold">{item.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.inventory.reorderLevel')} </span>
                        <span className="font-semibold">{item.reorderLevel} {item.unit}</span>
                      </div>
                    </div>

                    {/* Supplier & Pricing */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-medium">{t('manufacturing.inventory.supplierInfo')}</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {item.supplier.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.supplier.contact}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📧</span>
                            {item.supplier.email}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
            <h4 className="font-medium">{t('manufacturing.inventory.pricingInfo')}</h4>
                        <div className="text-sm space-y-1">
                          <div>
              <span className="text-muted-foreground">{t('manufacturing.inventory.cost')} </span>
                            <span className="font-semibold">${item.pricing.cost}</span>
                          </div>
                          <div>
              <span className="text-muted-foreground">{t('manufacturing.inventory.price')} </span>
                            <span className="font-semibold">${item.pricing.price}</span>
                          </div>
                          <div>
              <span className="text-muted-foreground">{t('manufacturing.inventory.margin')} </span>
                            <span className="font-semibold text-success">
                              {(((item.pricing.price - item.pricing.cost) / item.pricing.cost) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{t('manufacturing.inventory.stockLevel')}</span>
                        <span>{item.quantity}/{item.reorderLevel + 100} {item.unit}</span>
                      </div>
                      <Progress 
                        value={Math.min((item.quantity / (item.reorderLevel + 100)) * 100, 100)} 
                        className={`h-2 ${item.quantity <= item.reorderLevel ? 'bg-red-100' : 'bg-green-100'}`}
                      />
                      {item.quantity <= item.reorderLevel && (
                        <div className="flex items-center gap-1 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {t('manufacturing.inventory.reorderRecommended')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="work-orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('manufacturing.workOrders.title')}</h3>
            <Button onClick={() => setIsCreateOrderOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('manufacturing.actions.createWorkOrder')}
            </Button>
          </div>

          <div className="space-y-4">
            {workOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getTypeIcon(order.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{order.title}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority}
                            </Badge>
                            <Badge variant="outline">
                              {order.orderNumber}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "in_progress" && (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.workOrders.details')} </span>
                        <span className="font-semibold capitalize">{order.type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.workOrders.assigned')} </span>
                        <span className="font-semibold">{order.assignedTo.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.workOrders.dueDate')} </span>
                        <span className="font-semibold">{order.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('manufacturing.workOrders.hours')} </span>
                        <span className="font-semibold">{order.actualHours || 0}/{order.estimatedHours}h</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {order.status === "in_progress" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{t('manufacturing.workOrders.progress')}</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>
                    )}

                    {/* Materials */}
                    {order.materials.length > 0 && (
                      <div className="space-y-2">
      <h4 className="font-medium">{t('manufacturing.workOrders.requiredMaterials')}</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {order.materials.map((material, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <span className="font-medium">{material.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">x{material.quantity}</span>
                              </div>
                              <Badge variant={material.allocated ? "default" : "secondary"}>
        {material.allocated ? t('manufacturing.workOrders.allocated') : t('manufacturing.workOrders.pending')}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium mb-1">{t('manufacturing.workOrders.notes')}</h4>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bom" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('manufacturing.bom.title')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('manufacturing.actions.createBOM')}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {boms.map((bom) => (
              <Card key={bom.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{bom.productName}</CardTitle>
                      <CardDescription>{t('manufacturing.bom.components')} {bom.version}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(bom.status)}>
                      {bom.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('manufacturing.bom.totalCost')}</span>
                    <span className="font-semibold text-lg">${bom.totalCost}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">{t('manufacturing.bom.components')}</h4>
                    <div className="space-y-1">
                      {bom.components.map((component, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{component.name} (x{component.quantity})</span>
                          <span>${(component.cost * component.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>{t('manufacturing.bom.created')} {bom.createdDate}</div>
                    <div>{t('manufacturing.bom.modified')} {bom.lastModified}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      {t('common.view')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      {t('common.edit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  {t('manufacturing.production.lines')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { line: "Line 1", status: "Running", output: "85%", product: "Model Alpha" },
                    { line: "Line 2", status: "Maintenance", output: "0%", product: "Model Beta" },
                    { line: "Line 3", status: "Running", output: "92%", product: "Model Gamma" },
                    { line: "Line 4", status: "Idle", output: "0%", product: "Not Assigned" }
                  ].map((line, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{line.line}</div>
                        <div className="text-sm text-muted-foreground">{line.product}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(line.status.toLowerCase())}>
                          {line.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {t('manufacturing.production.output')} {line.output}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('manufacturing.production.targets')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { product: "Model Alpha", target: 500, current: 342, percentage: 68 },
                    { product: "Model Beta", target: 300, current: 278, percentage: 93 },
                    { product: "Model Gamma", target: 200, current: 156, percentage: 78 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.product}</span>
                        <span>{item.current}/{item.target} units</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {t('manufacturing.production.completePercent', { percent: item.percentage })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t('manufacturing.production.realTimeMetrics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-muted-foreground">{t('manufacturing.production.overallEfficiency')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-muted-foreground">{t('manufacturing.production.unitsToday')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">2.3%</div>
                  <div className="text-sm text-muted-foreground">{t('manufacturing.production.defectRate')}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">94.5%</div>
                  <div className="text-sm text-muted-foreground">{t('manufacturing.production.onTimeDelivery')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddInventoryDialog />
      <CreateWorkOrderDialog />
    </div>
  );
}
