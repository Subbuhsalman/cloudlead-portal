import { prisma } from "../../config/dbConnection";

class UserAddressRepository {
  async create(data: any) {
    const newUser = await prisma.userAddress.create({
      data: data,
    });
    return newUser;
  }
  async findOne({ where }: { where: any }) {
    return await prisma.userAddress.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.userAddress.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.userAddress.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.userAddress.delete({
      where: { user_address_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.userAddress.findUnique({
      where: { user_address_id: Number(id) },
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
    sorting = [['user_address_id', 'desc']],
    searchFilters
  }: {
    page?: number;
    per_page?: number;
    filter?: any;
    sorting?: [string, 'asc' | 'desc'][];
    searchFilters: any
  }) {
    const offset = (page - 1) * per_page;

    // Define the filters
    // Define the filters
    searchFilters = JSON.parse(searchFilters)

    // Define the filters
    const where: any = {};

    if(searchFilters?.user_id && Number(searchFilters?.user_id) > 0){
      where.user_id = Number(searchFilters?.user_id)
    }

    try {
      // Count total records
      const totalRecords = await prisma.userAddress.count({ where });

      // Fetch paginated records
      const list = await prisma.userAddress.findMany({
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

export default UserAddressRepository;
