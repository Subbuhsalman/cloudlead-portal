import { prisma } from "../../config/dbConnection";

class PlatformSettingsRepository {
  async create(data: any) {
    try {
      const newUser = await prisma.platformSettings.create({
        data: data,
      });
      return newUser;
    } catch (error) {
      console.log("error", error)
      return error
    }

  }
  async findOne({ where }: { where: any }) {
    return await prisma.platformSettings.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.platformSettings.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.platformSettings.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.platformSettings.delete({
      where: { platform_setting_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.platformSettings.findUnique({
      where: { platform_setting_id: Number(id) },
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
    sorting = [['platform_setting_id', 'desc']],
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
      where.platformSettings_name = { contains: filter };
    }

    try {
      // Count total records
      const totalRecords = await prisma.platformSettings.count({ where });

      // Fetch paginated records
      const list = await prisma.platformSettings.findMany({
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

export default PlatformSettingsRepository;
