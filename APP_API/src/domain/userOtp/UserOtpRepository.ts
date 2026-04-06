import { prisma } from "../../config/dbConnection";

class UserOtpRepository {
  async create(data: any) {
    console.log("new data", {
        user_id: data.user_id,
        otp: data.otp,
        is_verified: data.is_verified,
        expires_at: data.expires_at
      })
    const newUser = await prisma.userOtp.create({
      data: {
        user_id: data.user_id,
        otp: data.otp,
        is_verified: data.is_verified,
        expires_at: data.expires_at
      },
  });
    return newUser;
  }
  async findOne({ where }: { where: any }) {
    console.log("where",where)
    return await prisma.userOtp.findFirst({
      where,
    });
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.userOtp.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.userOtp.delete({
      where: { id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.userOtp.findUnique({
      where: { id: Number(id) },
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
    sorting = [['id', 'desc']],
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
      where.cuisine_name = { contains: filter };
    }

    try {
      // Count total records
      const totalRecords = await prisma.userOtp.count({ where });

      // Fetch paginated records
      const list = await prisma.userOtp.findMany({
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

export default UserOtpRepository;
