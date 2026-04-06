import { prisma } from "../../config/dbConnection";

class TaxRatesRepository {
  async create(data: any) {
    const newUser = await prisma.taxRates.create({
      data: data,
    });
    return newUser;
  }
  async findOne({ where }: { where: any }) {
    return await prisma.taxRates.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.taxRates.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.taxRates.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.taxRates.delete({
      where: { tax_rate_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.taxRates.findUnique({
      where: { tax_rate_id: Number(id) },
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
    sorting = [['tax_rate_id', 'desc']],
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
      where.OR = [
        { country: { contains: filter } },
        { province: { contains: filter } }
      ];
    }

    try {
      // Count total records
      const totalRecords = await prisma.taxRates.count({ where });

      // Fetch paginated records
      const list = await prisma.taxRates.findMany({
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

export default TaxRatesRepository;
