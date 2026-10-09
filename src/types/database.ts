export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LanguageCode = "en" | "ar";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type UserRole = "ADMIN" | "STAFF";
export type ProductBadge = "BEST_SELLER" | "NEW";

export type Database = {
  public: {
    Tables: {
      Address: {
        Row: {
          id: string;
          customerId: string;
          label: string | null;
          addressLine1: string;
          addressLine2: string | null;
          city: string;
          state: string | null;
          postalCode: string | null;
          country: string;
          phone: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["Address"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["Address"]["Row"],
            "customerId" | "addressLine1" | "city" | "country"
          >;
        Update: Partial<Database["public"]["Tables"]["Address"]["Row"]>;
        Relationships: [];
      };
      BlogPost: {
        Row: {
          id: string;
          topic: string;
          format: string;
          status: string;
          publishedAt: string | null;
          featuredImageUrl: string | null;
          authorName: string | null;
          readTimeMinutes: number;
          viewCount: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["BlogPost"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["BlogPost"]["Row"]>;
        Relationships: [];
      };
      BlogPostTranslation: {
        Row: {
          id: string;
          blogPostId: string;
          language: LanguageCode;
          title: string;
          slug: string;
          excerpt: string | null;
          body: Json;
          metaTitle: string | null;
          metaDescription: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["BlogPostTranslation"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["BlogPostTranslation"]["Row"],
            "blogPostId" | "language" | "title" | "slug"
          >;
        Update: Partial<Database["public"]["Tables"]["BlogPostTranslation"]["Row"]>;
        Relationships: [];
      };
      Collection: {
        Row: {
          id: string;
          systemSlug: string;
          sortOrder: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["Collection"]["Row"]> &
          Pick<Database["public"]["Tables"]["Collection"]["Row"], "id" | "systemSlug">;
        Update: Partial<Database["public"]["Tables"]["Collection"]["Row"]>;
        Relationships: [];
      };
      CollectionTranslation: {
        Row: {
          id: string;
          collectionId: string;
          language: LanguageCode;
          name: string;
          slug: string;
          description: string | null;
          h1: string | null;
          metaTitle: string | null;
          metaDesc: string | null;
          keywords: string | null;
          ogImage: string | null;
          canonical: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["CollectionTranslation"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["CollectionTranslation"]["Row"],
            "collectionId" | "language" | "name" | "slug"
          >;
        Update: Partial<Database["public"]["Tables"]["CollectionTranslation"]["Row"]>;
        Relationships: [];
      };
      Customer: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          firstName: string;
          lastName: string;
          isWholesale: boolean;
          companyName: string | null;
          taxId: string | null;
          totalSpent: number;
          lastOrderDate: string | null;
          marketingOptIn: boolean;
          adminNotes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["Customer"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["Customer"]["Row"],
            "email" | "firstName" | "lastName"
          >;
        Update: Partial<Database["public"]["Tables"]["Customer"]["Row"]>;
        Relationships: [];
      };
      GlobalSeoSetting: {
        Row: {
          id: string;
          ogImage: string | null;
          twitterHandle: string | null;
          facebookPage: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["GlobalSeoSetting"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["GlobalSeoSetting"]["Row"]>;
        Relationships: [];
      };
      GlobalSeoTranslation: {
        Row: {
          id: string;
          globalSeoSettingId: string;
          language: LanguageCode;
          siteName: string | null;
          titleSuffix: string | null;
          defaultMetaDesc: string | null;
          defaultKeywords: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["GlobalSeoTranslation"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["GlobalSeoTranslation"]["Row"],
            "globalSeoSettingId" | "language"
          >;
        Update: Partial<Database["public"]["Tables"]["GlobalSeoTranslation"]["Row"]>;
        Relationships: [];
      };
      MediaLibrary: {
        Row: {
          id: string;
          storagePath: string;
          url: string;
          localPath: string | null;
          originalSize: number;
          compressedSize: number;
          contentHash: string;
          filename: string;
          mimeType: string;
          width: number | null;
          height: number | null;
          isDuplicate: boolean;
          duplicateOfId: string | null;
          createdAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["MediaLibrary"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["MediaLibrary"]["Row"],
            | "storagePath"
            | "url"
            | "originalSize"
            | "compressedSize"
            | "contentHash"
            | "filename"
            | "mimeType"
          >;
        Update: Partial<Database["public"]["Tables"]["MediaLibrary"]["Row"]>;
        Relationships: [];
      };
      Order: {
        Row: {
          id: string;
          reference: string;
          customerId: string;
          shippingAddressId: string;
          status: OrderStatus;
          subtotal: number;
          shipping: number;
          totalAmount: number;
          currency: string;
          paymentProvider: string;
          paymentId: string | null;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["Order"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["Order"]["Row"],
            | "reference"
            | "customerId"
            | "shippingAddressId"
            | "paymentProvider"
            | "totalAmount"
          >;
        Update: Partial<Database["public"]["Tables"]["Order"]["Row"]>;
        Relationships: [];
      };
      OrderItem: {
        Row: {
          id: string;
          orderId: string;
          productId: string;
          productNameSnapshot: string;
          priceSnapshot: number;
          quantity: number;
        };
        Insert: Partial<Database["public"]["Tables"]["OrderItem"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["OrderItem"]["Row"],
            | "orderId"
            | "productId"
            | "productNameSnapshot"
            | "priceSnapshot"
            | "quantity"
          >;
        Update: Partial<Database["public"]["Tables"]["OrderItem"]["Row"]>;
        Relationships: [];
      };
      Product: {
        Row: {
          id: string;
          collectionId: string;
          priceUsd: number;
          compareAtUsd: number | null;
          sku: string;
          stock: number;
          material: string;
          swatches: Json;
          badge: ProductBadge | null;
          filterFacets: Json;
          isAvailable: boolean;
          isFeatured: boolean;
          sortOrder: number;
          attributes: Json | null;
          detailImage1: string | null;
          detailImage2: string | null;
          detailImage3: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["Product"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["Product"]["Row"],
            "collectionId" | "priceUsd"
          >;
        Update: Partial<Database["public"]["Tables"]["Product"]["Row"]>;
        Relationships: [];
      };
      ProductImage: {
        Row: {
          id: string;
          productId: string;
          url: string;
          altText: string | null;
          isPrimary: boolean;
          sortOrder: number;
        };
        Insert: Partial<Database["public"]["Tables"]["ProductImage"]["Row"]> &
          Pick<Database["public"]["Tables"]["ProductImage"]["Row"], "productId" | "url">;
        Update: Partial<Database["public"]["Tables"]["ProductImage"]["Row"]>;
        Relationships: [];
      };
      ProductTranslation: {
        Row: {
          id: string;
          productId: string;
          language: LanguageCode;
          name: string;
          h1: string | null;
          shortDescription: string | null;
          description: string | null;
          slug: string;
          metaTitle: string | null;
          metaDesc: string | null;
          keywords: string | null;
          ogImage: string | null;
          canonical: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["ProductTranslation"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["ProductTranslation"]["Row"],
            "productId" | "language" | "name" | "slug"
          >;
        Update: Partial<Database["public"]["Tables"]["ProductTranslation"]["Row"]>;
        Relationships: [];
      };
      StaticPage: {
        Row: {
          id: string;
          systemName: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["StaticPage"]["Row"]> &
          Pick<Database["public"]["Tables"]["StaticPage"]["Row"], "systemName">;
        Update: Partial<Database["public"]["Tables"]["StaticPage"]["Row"]>;
        Relationships: [];
      };
      StaticPageTranslation: {
        Row: {
          id: string;
          staticPageId: string;
          language: LanguageCode;
          h1: string | null;
          description: string | null;
          slug: string;
          metaTitle: string | null;
          metaDesc: string | null;
          keywords: string | null;
          ogImage: string | null;
          canonical: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["StaticPageTranslation"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["StaticPageTranslation"]["Row"],
            "staticPageId" | "language" | "slug"
          >;
        Update: Partial<Database["public"]["Tables"]["StaticPageTranslation"]["Row"]>;
        Relationships: [];
      };
      User: {
        Row: {
          id: string;
          name: string;
          email: string;
          emailVerified: string | null;
          image: string | null;
          role: UserRole;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["User"]["Row"]> &
          Pick<Database["public"]["Tables"]["User"]["Row"], "name" | "email">;
        Update: Partial<Database["public"]["Tables"]["User"]["Row"]>;
        Relationships: [];
      };
      UserCredential: {
        Row: {
          userId: string;
          passwordHash: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Partial<Database["public"]["Tables"]["UserCredential"]["Row"]> &
          Pick<
            Database["public"]["Tables"]["UserCredential"]["Row"],
            "userId" | "passwordHash"
          >;
        Update: Partial<Database["public"]["Tables"]["UserCredential"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      LanguageCode: LanguageCode;
      OrderStatus: OrderStatus;
      UserRole: UserRole;
      ProductBadge: ProductBadge;
    };
    CompositeTypes: Record<string, never>;
  };
};
