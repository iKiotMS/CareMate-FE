/**
 * Mock responses for BE endpoints not yet implemented.
 * Used by the Axios mock interceptor in api-client.ts.
 * Remove entries here once the real BE endpoint is live.
 */

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATION_LIST = {
  data: [
    {
      _id: "n1",
      recipientId: "me",
      type: "ORDER_COMPLETED",
      title: "Hoàn thành dịch vụ",
      body: "Đơn hàng #ORD001 đã được hoàn thành. Hãy để lại đánh giá!",
      isRead: false,
      referenceId: "ord001",
      referenceType: "order",
      createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    },
    {
      _id: "n2",
      recipientId: "me",
      type: "CLEANER_ASSIGNED",
      title: "Đã phân công nhân viên",
      body: "Nhân viên Trần Văn Hùng đã được phân công cho đơn của bạn.",
      isRead: false,
      referenceId: "ord002",
      referenceType: "order",
      createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    },
    {
      _id: "n3",
      recipientId: "me",
      type: "COMPLAINT_REPLIED",
      title: "Khiếu nại được phản hồi",
      body: "Admin đã phản hồi khiếu nại #CP001 của bạn.",
      isRead: false,
      referenceId: "cp1",
      referenceType: "complaint",
      createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
    },
    {
      _id: "n4",
      recipientId: "me",
      type: "ORDER_CANCELLED",
      title: "Đơn đã bị hủy",
      body: "Đơn hàng #ORD005 đã bị hủy theo yêu cầu.",
      isRead: true,
      referenceId: "ord005",
      referenceType: "order",
      createdAt: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
    },
    {
      _id: "n5",
      recipientId: "me",
      type: "NEW_JOB_AVAILABLE",
      title: "Việc mới khả dụng",
      body: "Có đơn mới tại Quận 1 vào ngày 10/06 — nhấn để xem chi tiết.",
      isRead: true,
      referenceId: "ord006",
      referenceType: "order",
      createdAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
    },
  ],
  total: 5,
  page: 1,
  limit: 20,
};

export const MOCK_UNREAD_COUNT = { count: 3 };

// ─── Complaints ───────────────────────────────────────────────────────────────
const BASE_COMPLAINTS = [
  {
    _id: "cp1",
    orderId: "ord001",
    orderShortId: "ORD001",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    subject: "Dọn chưa sạch góc bếp",
    description: "Nhân viên bỏ sót góc bếp, dầu mỡ vẫn còn bám trên bề mặt bếp và tường. Tôi đã nhắc nhở nhưng không được xử lý.",
    evidenceUrls: [],
    status: "PROCESSING",
    category: "SERVICE_QUALITY",
    replies: [
      {
        _id: "r1",
        authorId: "admin1",
        authorName: "Admin CareMate",
        authorRole: "admin",
        message: "Chúng tôi đã ghi nhận và sẽ liên hệ nhân viên để làm rõ vấn đề. Cảm ơn bạn đã phản hồi.",
        createdAt: new Date(Date.now() - 20 * 3600_000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600_000).toISOString(),
  },
  {
    _id: "cp2",
    orderId: "ord005",
    orderShortId: "ORD005",
    customerId: "c002",
    customerName: "Phạm Thu Hà",
    subject: "Nhân viên đến trễ 45 phút",
    description: "Lịch hẹn 09:00 nhưng nhân viên đến lúc 09:45 mà không có thông báo trước. Gây bất tiện cho tôi.",
    evidenceUrls: [],
    status: "OPEN",
    category: "LATE_ARRIVAL",
    replies: [],
    createdAt: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600_000).toISOString(),
  },
  {
    _id: "cp3",
    orderId: "ord004",
    orderShortId: "ORD004",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    subject: "Vật dụng bị làm vỡ",
    description: "Bình hoa trên kệ bị vỡ trong quá trình dọn dẹp, nhân viên không thông báo.",
    evidenceUrls: [],
    status: "RESOLVED",
    category: "DAMAGE",
    replies: [
      {
        _id: "r2",
        authorId: "admin1",
        authorName: "Admin CareMate",
        authorRole: "admin",
        message: "Chúng tôi đã xác minh và sẽ bồi thường theo chính sách. Xin lỗi vì sự bất tiện này.",
        createdAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 3600_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
  },
];

export const MOCK_COMPLAINT_LIST = {
  data: BASE_COMPLAINTS,
  total: BASE_COMPLAINTS.length,
  page: 1,
  limit: 20,
};

export const MOCK_COMPLAINT_DETAIL = BASE_COMPLAINTS[0];

export function makeMockComplaint(data: any) {
  return {
    _id: `cp_new_${Date.now()}`,
    orderId: data.orderId,
    orderShortId: data.orderId.slice(-6).toUpperCase(),
    customerId: "me",
    customerName: "Bạn",
    subject: data.subject,
    description: data.description,
    evidenceUrls: data.evidenceUrls ?? [],
    status: "OPEN",
    category: null,
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Income (Cleaner) ─────────────────────────────────────────────────────────
export const MOCK_INCOME_SUMMARY = {
  totalNet: 4_235_000,
  totalGross: 4_980_000,
  totalCommission: 745_000,
  ordersCount: 18,
  period: "monthly",
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
  to: new Date().toISOString(),
};

export const MOCK_INCOME_BY_ORDER = {
  data: [
    { orderId: "ord001", scheduledDate: "2026-06-02", tasks: 2, grossAmount: 280_000, commission: 42_000, netAmount: 238_000 },
    { orderId: "ord003", scheduledDate: "2026-05-25", tasks: 1, grossAmount: 160_000, commission: 24_000, netAmount: 136_000 },
    { orderId: "ord004", scheduledDate: "2026-05-15", tasks: 1, grossAmount: 100_000, commission: 15_000, netAmount: 85_000 },
    { orderId: "ord006", scheduledDate: "2026-06-04", tasks: 1, grossAmount: 90_000,  commission: 13_500, netAmount: 76_500 },
  ],
  total: 4,
  page: 1,
  limit: 10,
};

// ─── Rating Analytics ─────────────────────────────────────────────────────────
export const MOCK_CLEANER_RATING_ANALYTICS = {
  averageRating: 4.7,
  totalReviews: 42,
  distribution: [
    { stars: 5, count: 28, percentage: 66.7 },
    { stars: 4, count: 10, percentage: 23.8 },
    { stars: 3, count: 3,  percentage: 7.1  },
    { stars: 2, count: 1,  percentage: 2.4  },
    { stars: 1, count: 0,  percentage: 0    },
  ],
};

export const MOCK_CLEANER_RECEIVED_REVIEWS = {
  data: [
    { _id: "rv1", orderId: "ord004", customerName: "Nguyễn Minh An",  rating: 5, comment: "Rất hài lòng, dọn sạch và đúng giờ!", createdAt: new Date(Date.now() - 3 * 24 * 3600_000).toISOString() },
    { _id: "rv2", orderId: "ord003", customerName: "Phạm Thu Hà",     rating: 4, comment: "Tốt, sẽ đặt lại", createdAt: new Date(Date.now() - 10 * 24 * 3600_000).toISOString() },
    { _id: "rv3", orderId: "ord010", customerName: "Hoàng Đức Bình",  rating: 5, comment: "Nhân viên chuyên nghiệp, nhiệt tình.", createdAt: new Date(Date.now() - 15 * 24 * 3600_000).toISOString() },
    { _id: "rv4", orderId: "ord011", customerName: "Lê Văn Cường",    rating: 3, comment: "Bình thường, chưa đạt kỳ vọng.", createdAt: new Date(Date.now() - 20 * 24 * 3600_000).toISOString() },
  ],
  total: 42,
  page: 1,
  limit: 10,
};

// ─── Admin Analytics ──────────────────────────────────────────────────────────
export const MOCK_ADMIN_RATING_ANALYTICS = {
  overallAverage: 4.5,
  totalReviews: 312,
  distribution: [
    { stars: 5, count: 180, percentage: 57.7 },
    { stars: 4, count: 89,  percentage: 28.5 },
    { stars: 3, count: 28,  percentage: 9.0  },
    { stars: 2, count: 11,  percentage: 3.5  },
    { stars: 1, count: 4,   percentage: 1.3  },
  ],
  lowRatingAlerts: [
    { cleanerId: "cl003", cleanerName: "Trần Minh Đức", recentRating: 2.1, orderId: "ord020" },
  ],
};

export const MOCK_CLEANER_PERFORMANCE = {
  data: [
    { cleanerId: "u002",  cleanerName: "Trần Văn Hùng",    avatarUrl: null, totalOrders: 156, completedOrders: 148, cancelledOrders: 4, completionRate: 94.9, cancellationRate: 2.6, averageRating: 4.8, totalReviews: 120 },
    { cleanerId: "cl002", cleanerName: "Nguyễn Thị Lan",   avatarUrl: null, totalOrders: 89,  completedOrders: 82,  cancelledOrders: 5, completionRate: 92.1, cancellationRate: 5.6, averageRating: 4.5, totalReviews: 74  },
    { cleanerId: "cl003", cleanerName: "Trần Minh Đức",    avatarUrl: null, totalOrders: 45,  completedOrders: 38,  cancelledOrders: 6, completionRate: 84.4, cancellationRate: 13.3, averageRating: 4.0, totalReviews: 35  },
  ],
  total: 3,
  page: 1,
  limit: 10,
};

// ─── Revenue Dashboard ────────────────────────────────────────────────────────
export const MOCK_REVENUE_DASHBOARD = {
  totalRevenue:     485_000_000,
  revenueThisMonth: 62_400_000,
  revenueLastMonth: 55_200_000,
  growthRate: 13.04,
  byDay: [
    { day: "T2", amount: 5_200_000 },
    { day: "T3", amount: 6_800_000 },
    { day: "T4", amount: 6_100_000 },
    { day: "T5", amount: 8_900_000 },
    { day: "T6", amount: 7_500_000 },
    { day: "T7", amount: 9_200_000 },
    { day: "CN", amount: 5_800_000 },
  ],
  topEarners: [
    { cleanerName: "Trần Văn Hùng", net: 28_400_000 },
    { cleanerName: "Nguyễn Thị Lan", net: 17_600_000 },
    { cleanerName: "Trần Minh Đức", net: 8_200_000 },
  ],
};

export const MOCK_PAYMENT_STATS = {
  totalOrders:   986,
  paid:          782,
  unpaid:        156,
  refunded:      48,
  totalCollected: 382_400_000,
  cashAmount:    210_000_000,
  bankAmount:    152_000_000,
  eWalletAmount: 20_400_000,
};

// ─── Cleaner Availability ─────────────────────────────────────────────────────
export const MOCK_AVAILABILITY = {
  workingDays: [1, 2, 3, 4, 5],
  workingHours: { start: "07:00", end: "19:00" },
  daysOff: [],
};

// ─── Dashboards ───────────────────────────────────────────────────────────────
export const MOCK_CUSTOMER_DASHBOARD = {
  activeOrders: 2,
  completedOrders: 14,
  pendingReviews: 1,
  totalSpent: 3_420_000,
};

export const MOCK_CLEANER_DASHBOARD = {
  jobsToday: 2,
  completedThisMonth: 18,
  netEarningsThisMonth: 4_235_000,
  averageRating: 4.7,
};

// ─── Pricing ─────────────────────────────────────────────────────────────────
export function makeMockCalculateTotal(taskIds: string[]) {
  const priceMap: Record<string, { name: string; price: number }> = {
    t1: { name: "Quét sàn",          price: 50_000 },
    t2: { name: "Lau sàn",           price: 60_000 },
    t3: { name: "Hút bụi",           price: 70_000 },
    t4: { name: "Lau nội thất",      price: 80_000 },
    t5: { name: "Lau kính",          price: 55_000 },
    t6: { name: "Dọn nhà vệ sinh",   price: 90_000 },
    t7: { name: "Đổ rác",            price: 30_000 },
    t8: { name: "Rửa bát",           price: 45_000 },
  };
  const tasks = taskIds.map((id) => ({
    taskId: id,
    taskName: priceMap[id]?.name ?? id,
    price: priceMap[id]?.price ?? 50_000,
  }));
  const totalAmount = tasks.reduce((s, t) => s + t.price, 0);
  return { tasks, totalAmount };
}

// ─── Admin Reviews ────────────────────────────────────────────────────────────
export const MOCK_ADMIN_REVIEWS = {
  data: [
    { _id: "rv1", orderId: "ord004", customerName: "Nguyễn Minh An",  cleanerName: "Trần Văn Hùng",  rating: 5, comment: "Rất hài lòng, dọn sạch và đúng giờ!",   createdAt: new Date(Date.now() - 3  * 24 * 3600_000).toISOString() },
    { _id: "rv2", orderId: "ord010", customerName: "Phạm Thu Hà",     cleanerName: "Nguyễn Thị Lan", rating: 2, comment: "Một số góc chưa dọn kỹ, cần cải thiện.", createdAt: new Date(Date.now() - 8  * 24 * 3600_000).toISOString() },
    { _id: "rv3", orderId: "ord011", customerName: "Hoàng Đức Bình",  cleanerName: "Trần Văn Hùng",  rating: 4, comment: "Tốt, sẽ đặt lại.",                       createdAt: new Date(Date.now() - 12 * 24 * 3600_000).toISOString() },
    { _id: "rv4", orderId: "ord012", customerName: "Lê Văn Cường",    cleanerName: "Trần Minh Đức",  rating: 3, comment: "Bình thường.",                            createdAt: new Date(Date.now() - 16 * 24 * 3600_000).toISOString() },
    { _id: "rv5", orderId: "ord013", customerName: "Vũ Thị Hoa",      cleanerName: "Nguyễn Thị Lan", rating: 5, comment: "Nhân viên thân thiện, nhà sạch bóng.",   createdAt: new Date(Date.now() - 20 * 24 * 3600_000).toISOString() },
    { _id: "rv6", orderId: "ord014", customerName: "Đặng Minh Tuấn",  cleanerName: "Trần Minh Đức",  rating: 1, comment: "Nhân viên đến trễ, chất lượng rất kém.", createdAt: new Date(Date.now() - 25 * 24 * 3600_000).toISOString() },
  ],
  total: 312,
  page: 1,
  limit: 20,
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS = {
  data: [
    { _id: "al1", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "ASSIGN_CLEANER",   targetId: "ord001", targetType: "Order",    oldValue: null, newValue: { cleanerId: "u002" }, createdAt: new Date(Date.now() - 1 * 3600_000).toISOString() },
    { _id: "al2", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "LOCK_USER",        targetId: "c004",   targetType: "User",     oldValue: { isActive: true }, newValue: { isActive: false }, createdAt: new Date(Date.now() - 3 * 3600_000).toISOString() },
    { _id: "al3", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "CANCEL_ORDER",     targetId: "ord005", targetType: "Order",    oldValue: { status: "PENDING" }, newValue: { status: "CANCELLED" }, createdAt: new Date(Date.now() - 6 * 3600_000).toISOString() },
    { _id: "al4", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "CREATE_TASK",      targetId: "t8",     targetType: "Task",     oldValue: null, newValue: { name: "Rửa bát" }, createdAt: new Date(Date.now() - 24 * 3600_000).toISOString() },
    { _id: "al5", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "REPLY_COMPLAINT",  targetId: "cp1",    targetType: "Complaint", oldValue: null, newValue: { message: "Đã ghi nhận..." }, createdAt: new Date(Date.now() - 26 * 3600_000).toISOString() },
    { _id: "al6", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "CREATE_CLEANER",   targetId: "cl003",  targetType: "User",     oldValue: null, newValue: { email: "duc.tran@caremate.vn" }, createdAt: new Date(Date.now() - 2 * 24 * 3600_000).toISOString() },
    { _id: "al7", actorId: "u003", actorName: "Lê Thị Quản (Admin)", action: "UPDATE_COMPLAINT", targetId: "cp3",    targetType: "Complaint", oldValue: { status: "OPEN" }, newValue: { status: "RESOLVED" }, createdAt: new Date(Date.now() - 3 * 24 * 3600_000).toISOString() },
  ],
  total: 7,
  page: 1,
  limit: 20,
};
