import { prisma } from "../../config/dbConnection";


class UserWalletRepository {
  async create(data: any) {
    const newUser = await prisma.userWallet.create({
      data: data,
    });
    return newUser;
  }
  async findOne({ where }: { where: any }) {
    return await prisma.userWallet.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.userWallet.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.userWallet.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.userWallet.delete({
      where: { user_wallet_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.userWallet.findUnique({
      where: { user_wallet_id: Number(id) },
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
    sorting = [['user_wallet_id', 'desc']],
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
      where.userWallet_name = { contains: filter };
    }

    try {
      // Count total records
      const totalRecords = await prisma.userWallet.count({ where });

      // Fetch paginated records
      const list = await prisma.userWallet.findMany({
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

export default UserWalletRepository;
