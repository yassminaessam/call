import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@crm.com' },
    update: {},
    create: {
      email: 'sales@crm.com',
      name: 'Sales Manager',
      role: 'MANAGER',
    },
  });

  console.log('👤 Created users:', { adminUser, salesUser });

  // Create sample leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        company: 'شركة التطوير المصرية',
        source: 'WEBSITE',
        status: 'NEW',
        value: 50000,
        assignedTo: salesUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@techcorp.com',
        phone: '+1234567890',
        company: 'TechCorp International',
        source: 'REFERRAL',
        status: 'QUALIFIED',
        value: 75000,
        assignedTo: salesUser.id,
      },
    }),
  ]);

  console.log('🎯 Created leads:', leads);

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'مؤسسة النيل للتجارة',
        email: 'info@nile-trading.com',
        phone: '+20123456789',
        company: 'مؤسسة النيل للتجارة',
        industry: 'Trading',
        status: 'ACTIVE',
        totalValue: 120000,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Global Solutions Ltd',
        email: 'contact@globalsolutions.com',
        phone: '+44123456789',
        company: 'Global Solutions Ltd',
        industry: 'Technology',
        status: 'ACTIVE',
        totalValue: 250000,
      },
    }),
  ]);

  console.log('🏢 Created clients:', clients);

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        firstName: 'فاطمة',
        lastName: 'علي',
        email: 'fatma@company.com',
        position: 'Software Engineer',
        department: 'MANUFACTURING',
        salary: 8000,
        hireDate: new Date('2023-01-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        firstName: 'Michael',
        lastName: 'Smith',
        email: 'michael@company.com',
        position: 'Sales Director',
        department: 'SALES',
        salary: 12000,
        hireDate: new Date('2022-06-01'),
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('👥 Created employees:', employees);

  // Create sample campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: 'حملة الصيف التسويقية',
        description: 'حملة تسويقية لزيادة المبيعات في فصل الصيف',
        type: 'SOCIAL_MEDIA',
        status: 'ACTIVE',
        budget: 25000,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        targetAudience: 'العملاء الشباب في مصر',
        createdBy: salesUser.id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Q4 Email Campaign',
        description: 'End of year promotional email campaign',
        type: 'EMAIL',
        status: 'DRAFT',
        budget: 15000,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        targetAudience: 'Existing customers and prospects',
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('📧 Created campaigns:', campaigns);

  // Create sample inventory items
  const inventoryItems = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        name: 'قطع غيار محرك',
        sku: 'ENG-001',
        description: 'قطع غيار أساسية للمحركات',
        category: 'Engine Parts',
        quantity: 150,
        minQuantity: 20,
        price: 250,
        cost: 180,
        supplier: 'مصنع القاهرة للقطع',
        location: 'Warehouse A',
        status: 'IN_STOCK',
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Industrial Sensors',
        sku: 'SEN-002',
        description: 'High-precision industrial sensors',
        category: 'Electronics',
        quantity: 5,
        minQuantity: 10,
        price: 150,
        cost: 120,
        supplier: 'TechSupply Co.',
        location: 'Warehouse B',
        status: 'LOW_STOCK',
      },
    }),
  ]);

  console.log('📦 Created inventory items:', inventoryItems);

  // Create sample tickets
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        title: 'مشكلة في النظام',
        description: 'العميل يواجه مشكلة في تسجيل الدخول للنظام',
        category: 'TECHNICAL',
        priority: 'HIGH',
        status: 'OPEN',
        assignedTo: adminUser.id,
      },
    }),
    prisma.ticket.create({
      data: {
        title: 'Billing inquiry',
        description: 'Customer has questions about recent invoice charges',
        category: 'BILLING',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        assignedTo: salesUser.id,
      },
    }),
  ]);

  console.log('🎫 Created tickets:', tickets);

  // Create sample calls
  const calls = await Promise.all([
    prisma.call.create({
      data: {
        phoneNumber: '+201234567890',
        duration: 180, // 3 minutes
        type: 'INBOUND',
        department: 'SALES',
        status: 'COMPLETED',
        transcript: 'عميل مهتم بشراء منتجاتنا، طلب عرض أسعار',
        sentiment: 'positive',
        priority: 'MEDIUM',
        summary: 'اهتمام بالمنتجات',
        actionItems: ['إرسال عرض أسعار', 'متابعة خلال 3 أيام'],
        userId: salesUser.id,
      },
    }),
    prisma.call.create({
      data: {
        phoneNumber: '+1555123456',
        duration: 240, // 4 minutes
        type: 'OUTBOUND',
        department: 'SUPPORT',
        status: 'COMPLETED',
        transcript: 'Customer support call regarding product warranty',
        sentiment: 'neutral',
        priority: 'LOW',
        summary: 'Warranty information provided',
        actionItems: ['Send warranty documentation'],
        userId: adminUser.id,
      },
    }),
  ]);

  console.log('📞 Created calls:', calls);

  console.log('✅ Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });