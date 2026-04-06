import { PrismaClient } from '@prisma/client';
import { isJsonString } from '../../Utility/utils';

const prisma = new PrismaClient();

class TransactionRepository {
  async create(data: any) {
    const newUser = await prisma.transaction.create({
      data: data,
    });
    return newUser;
  }
  async findOne({ where }: { where: any }) {
    return await prisma.transaction.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.transaction.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.transaction.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.transaction.delete({
      where: { transaction_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.transaction.findUnique({
      where: { transaction_id: Number(id) },
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
    sorting = [['transaction_id', 'desc']],
    searchFilters
  }: {
    page?: number;
    per_page?: number;
    filter?: any;
    sorting?: [string, 'asc' | 'desc'][];
    searchFilters?: any;

  }) {
    const offset = (page - 1) * per_page;

    // Define the filters
    const where: any = {};
    // if (filter) {
    //   where.transaction_name = { contains: filter };
    // }

    try {
      // Count total records
       searchFilters = isJsonString(searchFilters) ? JSON.parse(searchFilters) : {}
      
       if (searchFilters?.user_id && Number(searchFilters.user_id) > 0) {
        where.user_id = Number(searchFilters?.user_id)
      }
      const totalRecords = await prisma.transaction.count({ where });

      // Fetch paginated records
      const list = await prisma.transaction.findMany({
        where,
        include:{
          Order: {
            select:{
              order_id: true,
              total_amount: true,
              OrderItems: true,
            }
          },
          User: true,
        },
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

export default TransactionRepository;
