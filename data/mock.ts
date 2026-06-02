import type {
  Complaint,
  EarningsSummary,
  Notification,
  Order,
  Review,
  TaskCatalogItem,
  User,
} from "@/types";

export const MOCK_USERS: Record<string, User> = {
  customer: {
    _id: "u001",
    email: "khachhang@caremate.vn",
    fullName: "Nguyễn Minh An",
    role: "customer",
    phone: "0901234567",
    avatarUrl: null,
    isActive: true,
  },
  cleaner: {
    _id: "u002",
    email: "nhanvien@caremate.vn",
    fullName: "Trần Văn Hùng",
    role: "cleaner",
    phone: "0912345678",
    avatarUrl: null,
    isActive: true,
    rating: 4.8,
    completedJobs: 156,
  },
  admin: {
    _id: "u003",
    email: "admin@caremate.vn",
    fullName: "Lê Thị Quản",
    role: "admin",
    phone: "0923456789",
    avatarUrl: null,
    isActive: true,
  },
};

export const MOCK_TASKS: TaskCatalogItem[] = [
  { _id: "t1", name: "Quét sàn", slug: "sweep", description: "Quét sạch toàn bộ sàn nhà", isActive: true, sortOrder: 1 },
  { _id: "t2", name: "Lau sàn", slug: "mop", description: "Lau sàn bằng nước lau sàn chuyên dụng", isActive: true, sortOrder: 2 },
  { _id: "t3", name: "Hút bụi", slug: "vacuum", description: "Hút bụi thảm, sofa và góc khuất", isActive: true, sortOrder: 3 },
  { _id: "t4", name: "Lau nội thất", slug: "wipe_furniture", description: "Lau bụi bàn ghế, tủ kệ", isActive: true, sortOrder: 4 },
  { _id: "t5", name: "Lau kính", slug: "wipe_glass", description: "Lau cửa kính, gương", isActive: true, sortOrder: 5 },
  { _id: "t6", name: "Dọn nhà vệ sinh", slug: "clean_toilet", description: "Vệ sinh toilet, lavabo", isActive: true, sortOrder: 6 },
  { _id: "t7", name: "Đổ rác", slug: "take_out_trash", description: "Gom và đổ rác", isActive: true, sortOrder: 7 },
  { _id: "t8", name: "Rửa bát", slug: "wash_dishes", description: "Rửa bát đĩa sau bữa ăn", isActive: true, sortOrder: 8 },
];

export const MOCK_ORDERS: Order[] = [
  {
    _id: "ord001",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    cleanerId: "u002",
    cleanerName: "Trần Văn Hùng",
    status: "IN_PROGRESS",
    scheduledDate: "2026-06-02",
    scheduledTime: "09:00 - 11:00",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    note: "Có nuôi mèo, vui lòng đóng cửa phòng ngủ",
    tasks: [
      { taskCatalogId: "t1", taskName: "Quét sàn", isDone: true, photoBefore: "/placeholder-before.jpg", photoAfter: "/placeholder-after.jpg" },
      { taskCatalogId: "t6", taskName: "Dọn nhà vệ sinh", isDone: false },
    ],
    photosBeforeBooking: ["/placeholder-room.jpg"],
    photosCheckin: ["/placeholder-checkin.jpg"],
    createdAt: "2026-05-28T08:00:00Z",
  },
  {
    _id: "ord002",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    cleanerId: null,
    cleanerName: null,
    status: "PENDING",
    scheduledDate: "2026-06-05",
    scheduledTime: "13:00 - 15:00",
    address: "456 Lê Lợi, Quận 3, TP.HCM",
    tasks: [
      { taskCatalogId: "t2", taskName: "Lau sàn", isDone: false },
      { taskCatalogId: "t3", taskName: "Hút bụi", isDone: false },
    ],
    photosBeforeBooking: [],
    createdAt: "2026-05-30T10:00:00Z",
  },
  {
    _id: "ord003",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    cleanerId: "u002",
    cleanerName: "Trần Văn Hùng",
    status: "REVIEW_PENDING",
    scheduledDate: "2026-05-25",
    scheduledTime: "09:00 - 11:00",
    address: "789 Hai Bà Trưng, Quận 1, TP.HCM",
    tasks: [
      { taskCatalogId: "t4", taskName: "Lau nội thất", isDone: true, photoBefore: "/p1.jpg", photoAfter: "/p2.jpg" },
    ],
    photosBeforeBooking: ["/p3.jpg"],
    photosCheckin: ["/p4.jpg"],
    photosAfter: ["/p5.jpg"],
    createdAt: "2026-05-20T08:00:00Z",
  },
  {
    _id: "ord004",
    customerId: "u001",
    customerName: "Nguyễn Minh An",
    cleanerId: "u002",
    cleanerName: "Trần Văn Hùng",
    status: "COMPLETED",
    scheduledDate: "2026-05-15",
    scheduledTime: "15:00 - 17:00",
    address: "321 Pasteur, Quận 3, TP.HCM",
    tasks: [{ taskCatalogId: "t1", taskName: "Quét sàn", isDone: true }],
    rating: 5,
    review: "Rất hài lòng, dọn sạch và đúng giờ!",
    createdAt: "2026-05-10T08:00:00Z",
  },
  {
    _id: "ord005",
    customerId: "c002",
    customerName: "Phạm Thu Hà",
    cleanerId: null,
    cleanerName: null,
    status: "PENDING",
    scheduledDate: "2026-06-03",
    scheduledTime: "07:00 - 09:00",
    address: "55 Võ Văn Tần, Quận 3, TP.HCM",
    tasks: [
      { taskCatalogId: "t5", taskName: "Lau kính", isDone: false },
      { taskCatalogId: "t7", taskName: "Đổ rác", isDone: false },
    ],
    createdAt: "2026-05-31T09:00:00Z",
  },
  {
    _id: "ord006",
    customerId: "c003",
    customerName: "Hoàng Đức Bình",
    cleanerId: "u002",
    cleanerName: "Trần Văn Hùng",
    status: "ASSIGNED",
    scheduledDate: "2026-06-04",
    scheduledTime: "11:00 - 13:00",
    address: "12 Trần Hưng Đạo, Quận 5, TP.HCM",
    tasks: [{ taskCatalogId: "t8", taskName: "Rửa bát", isDone: false }],
    note: "Nhà bếp cần dọn kỹ",
    createdAt: "2026-05-29T14:00:00Z",
  },
];

export const MOCK_CUSTOMERS: User[] = [
  MOCK_USERS.customer,
  { _id: "c002", email: "ha.pham@email.vn", fullName: "Phạm Thu Hà", role: "customer", phone: "0934567890", isActive: true },
  { _id: "c003", email: "binh.hoang@email.vn", fullName: "Hoàng Đức Bình", role: "customer", phone: "0945678901", isActive: true },
  { _id: "c004", email: "locked@email.vn", fullName: "Tài khoản khóa", role: "customer", phone: "0956789012", isActive: false },
];

export const MOCK_CLEANERS: User[] = [
  MOCK_USERS.cleaner,
  { _id: "cl002", email: "lan.nguyen@caremate.vn", fullName: "Nguyễn Thị Lan", role: "cleaner", phone: "0967890123", isActive: true, rating: 4.5, completedJobs: 89 },
  { _id: "cl003", email: "duc.tran@caremate.vn", fullName: "Trần Minh Đức", role: "cleaner", phone: "0978901234", isActive: true, rating: 4.2, completedJobs: 45 },
];

export const MOCK_REVIEWS: Review[] = [
  { _id: "r1", orderId: "ord004", customerName: "Nguyễn Minh An", cleanerName: "Trần Văn Hùng", rating: 5, comment: "Rất hài lòng, dọn sạch và đúng giờ!", createdAt: "2026-05-16T10:00:00Z" },
  { _id: "r2", orderId: "ord010", customerName: "Phạm Thu Hà", cleanerName: "Nguyễn Thị Lan", rating: 2, comment: "Một số góc chưa dọn kỹ", createdAt: "2026-05-20T14:00:00Z" },
  { _id: "r3", orderId: "ord011", customerName: "Hoàng Đức Bình", cleanerName: "Trần Văn Hùng", rating: 4, comment: "Tốt, sẽ đặt lại", createdAt: "2026-05-22T09:00:00Z" },
  { _id: "r4", orderId: "ord012", customerName: "Lê Văn C", cleanerName: "Trần Minh Đức", rating: 3, comment: "Bình thường", createdAt: "2026-05-25T11:00:00Z" },
];

export const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  customer: [
    { _id: "n1", title: "Hoàn thành dịch vụ", message: "Vệ sinh tổng quát cho căn hộ A-1204 đã hoàn thành xuất sắc. Cảm ơn quý khách đã sử dụng CleanFlow!", type: "success", read: false, createdAt: "2026-06-02T11:00:00Z" },
    { _id: "n2", title: "Bắt đầu dọn dẹp", message: "Nhân viên của chúng tôi đã bắt đầu công việc tại địa chỉ của bạn. Bạn có thể theo dõi tiến độ thực hiệp.", type: "info", read: false, createdAt: "2026-06-02T09:05:00Z" },
    { _id: "n3", title: "Đã phân công nhân viên", message: "Chuyên gia Lê Thị Thanh đã được điều phối để yêu cầu dặt lịch của bạn.", type: "info", read: false, createdAt: "2026-05-28T09:00:00Z" },
    { _id: "n4", title: "Ưu đãi cuối tuần: Giảm 20%", message: "Chi duy nhất cuối tuần này, nhận ngay ưu đãi 20% cho dịch vụ vệ sinh máy lạnh. Nhập mã: CLEAN20.", type: "promo", read: false, createdAt: "2026-06-01T18:30:00Z" },
    { _id: "n5", title: "Cập nhật ứng dụng", message: "CleanFlow v2.4.0 sắn sàng với lịnh năng theo dõi vị trí bản đồ.", type: "warning", read: true, createdAt: "2026-05-20T15:00:00Z" },
  ],
  cleaner: [
    { _id: "cn1", title: "Việc mới khả dụng", message: "Có đơn PENDING tại Quận 3 — 05/06", type: "info", read: false, createdAt: "2026-05-30T10:00:00Z" },
    { _id: "cn2", title: "Đánh giá mới", message: "Khách hàng đánh giá 5 sao cho đơn #ord004", type: "success", read: true, createdAt: "2026-05-16T10:30:00Z" },
  ],
};

export const MOCK_COMPLAINTS: Complaint[] = [
  { _id: "cp1", type: "customer", subject: "Dọn chưa sạch góc bếp", description: "Khách phàn nàn góc bếp còn dầu mỡ", status: "investigating", createdAt: "2026-05-21T08:00:00Z" },
  { _id: "cp2", type: "cleaner", subject: "Khách không có mặt", description: "NV đến đúng giờ nhưng không vào được nhà", status: "open", createdAt: "2026-05-23T14:00:00Z" },
  { _id: "cp3", type: "customer", subject: "Trễ giờ 30 phút", description: "NV đến muộn không báo trước", status: "resolved", createdAt: "2026-05-18T09:00:00Z" },
];

export const MOCK_EARNINGS: EarningsSummary = {
  thisWeek: 1250000,
  thisMonth: 4850000,
  totalJobs: 156,
};

export const MOCK_DASHBOARD_STATS = {
  totalOrders: 1248,
  revenue: 485000000,
  activeCleaners: 24,
  completedOrders: 986,
  pending: 45,
  assigned: 32,
  accepted: 28,
  inProgress: 15,
  reviewPending: 12,
  completed: 986,
  cancelled: 130,
  satisfaction: 4.6,
};

export const MOCK_CHART_DATA = {
  ordersByDay: [
    { day: "T2", count: 18 },
    { day: "T3", count: 24 },
    { day: "T4", count: 21 },
    { day: "T5", count: 32 },
    { day: "T6", count: 28 },
    { day: "T7", count: 35 },
    { day: "CN", count: 22 },
  ],
  revenueByDay: [
    { day: "T2", amount: 5200000 },
    { day: "T3", amount: 6800000 },
    { day: "T4", amount: 6100000 },
    { day: "T5", amount: 8900000 },
    { day: "T6", amount: 7500000 },
    { day: "T7", amount: 9200000 },
    { day: "CN", amount: 5800000 },
  ],
  ordersByStatus: [
    { status: "PENDING", count: 45 },
    { status: "ASSIGNED", count: 32 },
    { status: "ACCEPTED", count: 28 },
    { status: "IN_PROGRESS", count: 15 },
    { status: "COMPLETED", count: 986 },
    { status: "CANCELLED", count: 130 },
  ],
};

export const MOCK_AI = {
  demandForecast: { nextWeekOrders: 142, peakHours: "09:00 - 11:00", peakAreas: "Quận 1, Quận 3" },
  cleanerRecommendation: {
    name: "Trần Văn Hùng",
    confidence: 92,
    reasons: ["Gần khu vực", "Điểm cao 4.8", "Lịch trống"],
  },
  qualityScore: 87,
  sentiment: { positive: 72, neutral: 18, negative: 10 },
  assistantReply: "Doanh thu hôm nay: +12% so với hôm qua. Khu vực top: Hai Bà Trưng. NV xuất sắc: Trần Văn Hùng (4.8★).",
};

export function getCustomerOrders(customerId = "u001") {
  return MOCK_ORDERS.filter((o) => o.customerId === customerId);
}

export function getOrderById(id: string) {
  return MOCK_ORDERS.find((o) => o._id === id);
}

export function getPendingOrders() {
  return MOCK_ORDERS.filter((o) => o.status === "PENDING");
}

export function getCleanerAssignedJobs(cleanerId = "u002") {
  return MOCK_ORDERS.filter(
    (o) => o.cleanerId === cleanerId && ["ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(o.status),
  );
}

export function getCleanerCompletedOrders(cleanerId = "u002") {
  return MOCK_ORDERS.filter((o) => o.cleanerId === cleanerId && o.status === "COMPLETED");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(date));
}
