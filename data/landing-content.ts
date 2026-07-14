// Nội dung & hình ảnh cho landing page (mô phỏng bố cục bTaskee cho CareMate).
// Ảnh dùng nguồn Unsplash public — có thể thay bằng ảnh nội bộ trong /public/images.

export interface HeroSlide {
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
}

export const heroSlides: HeroSlide[] = [
  {
    title: "Dịch vụ gia đình",
    highlight: "đáng tin cậy",
    subtitle: "Đặt lịch dọn dẹp trong 60 giây, theo dõi tiến độ realtime.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "Việc nhỏ được sẻ chia,",
    highlight: "âu lo được gỡ bỏ",
    subtitle: "Đội ngũ nhân viên đã xác minh, tận tâm với từng ngôi nhà.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "Không gian sạch,",
    highlight: "cuộc sống thảnh thơi",
    subtitle: "Từ nhà riêng đến văn phòng — CareMate lo trọn.",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80&auto=format&fit=crop",
  },
];

export interface EcoService {
  title: string;
  image: string;
}

export const ecoServices: EcoService[] = [
  {
    title: "Chăm sóc người cao tuổi",
    image:
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Chăm sóc người bệnh",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Vệ sinh máy lạnh",
    image:
      "https://images.unsplash.com/photo-1631545806609-24b7e30d3b28?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Vệ sinh máy giặt",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Dọn dẹp nhà cửa",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Tổng vệ sinh",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Vệ sinh văn phòng",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Giặt ghế sofa",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Chăm sóc trẻ nhỏ",
    image:
      "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Nấu ăn gia đình",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80&auto=format&fit=crop",
  },
];

export interface AppFeature {
  key: string;
  title: string;
  description: string;
  image: string;
}

// "CareMate không chỉ là một ứng dụng" — click để chuyển ảnh
export const appFeatures: AppFeature[] = [
  {
    key: "tasker",
    title: "Người đồng hành",
    description:
      "Họ được gọi là CareMate — những người trợ giúp hiện đại, tận tâm với mỗi gia đình Việt.",
    image:
      "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "mark",
    title: "Dấu ấn riêng",
    description:
      "Là nguồn cảm hứng, mang hình ảnh chăm sóc chuyên nghiệp đến mọi ngôi nhà.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "break",
    title: "Phá bỏ định kiến",
    description:
      "Thay đổi cách xã hội nhìn nhận về nghề giúp việc và người lao động gia đình.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "warmth",
    title: "Ấm áp như ở nhà",
    description:
      "Mang theo những câu chuyện đồng hành đến từng góc nhỏ của ngôi nhà bạn.",
    image:
      "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=900&q=80&auto=format&fit=crop",
  },
];
