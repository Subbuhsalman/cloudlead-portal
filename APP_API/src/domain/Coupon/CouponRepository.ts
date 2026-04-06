import { prisma } from "../../config/dbConnection";

class CouponRepository {
  async create(data: any) {
    try {
      const newUser = await prisma.coupon.create({
        data: data,
      });
      return newUser;  
    } catch (error) {
      console.log("error", error)
      return error
    }
    
  }
  async findOne({ where }: { where: any }) {
    return await prisma.coupon.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.coupon.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.coupon.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.coupon.delete({
      where: { coupon_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.coupon.findUnique({
      where: { coupon_id: Number(id) },
      // select: attributes.reduce((acc, attr) => {
      //   acc[attr] = true;
      //   return acc;
      // }, {} as Record<string, boolean>),
    });
  }


  async paginate({
    page = 1,
    per_page = 10,
    filter = "",
    sorting = [['coupon_id', 'desc']],
  }: {
    page?: number;
    per_page?: number;
    filter?: any;
    sorting?: [string, 'asc' | 'desc'][];
  }) {
    const offset = (page - 1) * per_page;

    // Define the filters
    const where: any = {};
    if (filter) {
      where.coupon_title  = { contains: filter };
    }
    if (filter) {
      where.OR = [
        { coupon_title: { contains: filter } },
        { code: { contains: filter } }
      ];
    }
    try {
      // Count total records
      const totalRecords = await prisma.coupon.count({ where });

      // Fetch paginated records
      const list = await prisma.coupon.findMany({
        where,
        orderBy: sorting.map(([field, direction]) => ({ [field]: direction })),
        skip: offset,
        take: per_page,
      });

      return {
        list,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / per_page),
          currentPage: page,
          per_page,
        },
      };
    } catch (error) {
      console.error("Error in paginating admin users:", error);
      throw new Error(`Failed to fetch paginated admin users: ${error.message}`);
    }
  }
}

export default CouponRepository;
