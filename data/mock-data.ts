// Frontend Mock Data for Development/Testing
// This shows what API responses look like

export const MOCK_USERS = {
  customer: {
    _id: "660f5c1234567890abcdef01",
    email: "customer1@example.com",
    fullName: "John Doe",
    role: "customer",
    phone: "+1 (555) 123-4567",
    avatarUrl: null,
    isActive: true,
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-05-31T12:00:00Z",
  },
  cleaner: {
    _id: "660f5c1234567890abcdef02",
    email: "cleaner1@example.com",
    fullName: "Mike Johnson",
    role: "cleaner",
    phone: "+1 (555) 456-7890",
    avatarUrl: null,
    isActive: true,
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-05-31T12:00:00Z",
  },
  admin: {
    _id: "660f5c1234567890abcdef03",
    email: "admin@example.com",
    fullName: "Admin User",
    role: "admin",
    phone: "+1 (555) 789-0123",
    avatarUrl: null,
    isActive: true,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-05-31T12:00:00Z",
  },
};

export const MOCK_TASKS = [
  {
    _id: "660f5c1234567890abcdef10",
    name: "Sweep the floor",
    slug: "sweep",
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: "660f5c1234567890abcdef11",
    name: "Mop the floor",
    slug: "mop",
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: "660f5c1234567890abcdef12",
    name: "Vacuum",
    slug: "vacuum",
    isActive: true,
    sortOrder: 3,
  },
  {
    _id: "660f5c1234567890abcdef13",
    name: "Wipe furniture",
    slug: "wipe_furniture",
    isActive: true,
    sortOrder: 4,
  },
  {
    _id: "660f5c1234567890abcdef14",
    name: "Clean glass / windows",
    slug: "wipe_glass",
    isActive: true,
    sortOrder: 5,
  },
  {
    _id: "660f5c1234567890abcdef15",
    name: "Clean bathroom / toilet",
    slug: "clean_toilet",
    isActive: true,
    sortOrder: 6,
  },
  {
    _id: "660f5c1234567890abcdef16",
    name: "Take out trash",
    slug: "take_out_trash",
    isActive: true,
    sortOrder: 7,
  },
  {
    _id: "660f5c1234567890abcdef17",
    name: "Wash dishes",
    slug: "wash_dishes",
    isActive: true,
    sortOrder: 8,
  },
  {
    _id: "660f5c1234567890abcdef18",
    name: "Fold laundry",
    slug: "fold_clothes",
    isActive: true,
    sortOrder: 9,
  },
  {
    _id: "660f5c1234567890abcdef19",
    name: "Organize belongings",
    slug: "organize",
    isActive: true,
    sortOrder: 10,
  },
];

export const MOCK_ORDERS = {
  pending: {
    _id: "660f5c1234567890abcdef20",
    customerId: "660f5c1234567890abcdef01",
    cleanerId: null,
    status: "PENDING",
    scheduledDate: "2026-06-05",
    scheduledTime: "09:00 - 11:00",
    address: "123 Main St, Springfield, IL 62701",
    note: "Please bring your own supplies",
    tasks: [
      {
        taskCatalogId: "660f5c1234567890abcdef10",
        taskName: "Sweep the floor",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef12",
        taskName: "Vacuum",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef13",
        taskName: "Wipe furniture",
        isDone: false,
      },
    ],
    photosBeforeBooking: [],
    photosCheckin: [],
    photosAfter: [],
    rating: null,
    review: null,
    cancelledBy: null,
    cancelledReason: null,
    createdAt: "2026-05-31T10:30:00Z",
  },

  assigned: {
    _id: "660f5c1234567890abcdef21",
    customerId: "660f5c1234567890abcdef01",
    cleanerId: "660f5c1234567890abcdef02",
    status: "ASSIGNED",
    scheduledDate: "2026-06-06",
    scheduledTime: "14:00 - 16:00",
    address: "456 Oak Ave, Springfield, IL 62702",
    note: "House has 2 bathrooms",
    tasks: [
      {
        taskCatalogId: "660f5c1234567890abcdef11",
        taskName: "Mop the floor",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef15",
        taskName: "Clean bathroom / toilet",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef17",
        taskName: "Wash dishes",
        isDone: false,
      },
    ],
    photosBeforeBooking: [],
    photosCheckin: [],
    photosAfter: [],
    rating: null,
    review: null,
    cancelledBy: null,
    cancelledReason: null,
    createdAt: "2026-05-30T14:20:00Z",
  },

  accepted: {
    _id: "660f5c1234567890abcdef22",
    customerId: "660f5c1234567890abcdef01",
    cleanerId: "660f5c1234567890abcdef02",
    status: "ACCEPTED",
    scheduledDate: "2026-06-07",
    scheduledTime: "10:00 - 12:00",
    address: "789 Pine Rd, Springfield, IL 62703",
    note: "Please be quiet, elderly pets in home",
    tasks: [
      {
        taskCatalogId: "660f5c1234567890abcdef10",
        taskName: "Sweep the floor",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef14",
        taskName: "Clean glass / windows",
        isDone: false,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef18",
        taskName: "Fold laundry",
        isDone: false,
      },
    ],
    photosBeforeBooking: [],
    photosCheckin: [],
    photosAfter: [],
    rating: null,
    review: null,
    cancelledBy: null,
    cancelledReason: null,
    createdAt: "2026-05-29T09:15:00Z",
  },

  inProgress: {
    _id: "660f5c1234567890abcdef23",
    customerId: "660f5c1234567890abcdef01",
    cleanerId: "660f5c1234567890abcdef02",
    status: "IN_PROGRESS",
    scheduledDate: "2026-06-01",
    scheduledTime: "11:00 - 13:00",
    address: "321 Elm St, Springfield, IL 62704",
    note: null,
    tasks: [
      {
        taskCatalogId: "660f5c1234567890abcdef12",
        taskName: "Vacuum",
        isDone: true,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef15",
        taskName: "Clean bathroom / toilet",
        isDone: true,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef19",
        taskName: "Organize belongings",
        isDone: false,
      },
    ],
    photosBeforeBooking: [],
    photosCheckin: ["https://res.cloudinary.com/sample/checkin_001.jpg"],
    photosAfter: [],
    rating: null,
    review: null,
    cancelledBy: null,
    cancelledReason: null,
    createdAt: "2026-05-25T11:45:00Z",
  },

  completed: {
    _id: "660f5c1234567890abcdef24",
    customerId: "660f5c1234567890abcdef01",
    cleanerId: "660f5c1234567890abcdef02",
    status: "COMPLETED",
    scheduledDate: "2026-05-28",
    scheduledTime: "15:00 - 17:00",
    address: "654 Cedar Lane, Springfield, IL 62705",
    note: null,
    tasks: [
      {
        taskCatalogId: "660f5c1234567890abcdef11",
        taskName: "Mop the floor",
        isDone: true,
      },
      {
        taskCatalogId: "660f5c1234567890abcdef16",
        taskName: "Take out trash",
        isDone: true,
      },
    ],
    photosBeforeBooking: [],
    photosCheckin: ["https://res.cloudinary.com/sample/checkin_002.jpg"],
    photosAfter: [
      "https://res.cloudinary.com/sample/after_001.jpg",
      "https://res.cloudinary.com/sample/after_002.jpg",
    ],
    rating: null,
    review: null,
    cancelledBy: null,
    cancelledReason: null,
    createdAt: "2026-05-20T16:30:00Z",
  },
};

// Mock API Responses
export const MOCK_RESPONSES = {
  login: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: MOCK_USERS.customer,
  },

  register: {
    message: "Registration successful",
    userId: "660f5c1234567890abcdef01",
  },

  getOrders: {
    data: [
      MOCK_ORDERS.pending,
      MOCK_ORDERS.assigned,
      MOCK_ORDERS.accepted,
      MOCK_ORDERS.inProgress,
      MOCK_ORDERS.completed,
    ],
    total: 5,
    page: 1,
    limit: 10,
  },

  getTasks: {
    data: MOCK_TASKS,
    total: 10,
  },

  error: {
    statusCode: 400,
    message: "Validation error",
    error: "Bad Request",
  },

  unauthorized: {
    statusCode: 401,
    message: "Invalid credentials",
    error: "Unauthorized",
  },
};
