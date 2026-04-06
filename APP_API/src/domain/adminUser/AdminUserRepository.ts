import { prisma } from "../../config/dbConnection";

class AdminUserRepository {
  async create(user: any) {
    const newUser = await prisma.adminUser.create({
      data: user,
    });
    return newUser;
  }

  async checkIfExists({
    user,
    returnResponseIfExists,
  }: {
    user: any;
    returnResponseIfExists?: boolean;
  }) {
    try {
      const data = await prisma.adminUser.findFirst({
        where: {email: user.email},
      });
      const exists = data !== null;
  
      if (returnResponseIfExists && exists) {
        return {
          ...data
        };
      } else {
        return exists;
      }
    } catch (error) {
      return { success: false, error };
    }

  }

  async findOne({ where }: { where: any }) {
    return await prisma.adminUser.findFirst({
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
    return await prisma.adminUser.update({
      where,
      data: update,
    });
  }

  async deleteByUserId(userId: number | string) {
    return await prisma.adminUser.delete({
      where: { admin_user_id: Number(userId) },
    });
  }

  async getUserById(userId: number | string, attributes: Array<string>) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await prisma.adminUser.findUnique({
        where: { admin_user_id: Number(userId) },
        select: attributes.reduce((acc, attr) => {
          acc[attr] = true;
          return acc;
        }, {} as Record<string, boolean>),
      });

      return user;
    } catch (error) {
      console.error('Error in getUserById repository:', error);
      throw new Error(`Failed to fetch admin user: ${error.message}`);
    }
  }

  async getUserByIdFull(userId: number | string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await prisma.adminUser.findUnique({
        where: { admin_user_id: Number(userId) },
      });

      return user;
    } catch (error) {
      console.error('Error in getUserByIdFull repository:', error);
      throw new Error(`Failed to fetch admin user: ${error.message}`);
    }
  }

  async checkIfUserExistsByEmail(email: string) {
    const data = await prisma.adminUser.findUnique({
      where: { email },
    });
    return data || false;
  }

  async validateUserPassword(email: string, password: string) {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    // Add proper password comparison logic here
    return Boolean(user);
  }

  async paginate({
    page = 1,
    per_page = 10,
    filters = {},
    sorting = [['admin_user_id', 'desc']],
  }: {
    page?: number;
    per_page?: number;
    filters?: any;
    sorting?: [string, 'asc' | 'desc'][];
  }) {
    const offset = (page - 1) * per_page;

    // Define the filters
    const where: any = {};
    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    try {
      // Count total records
      const totalRecords = await prisma.adminUser.count({ where });

      // Fetch paginated records
      const list = await prisma.adminUser.findMany({
        where,
        orderBy: sorting.map(([field, direction]) => ({ [field]: direction })),
        skip: offset,
        take: per_page,
        select: {
          name: true,
          created_at: true,
          email: true,
          admin_user_id: true,
        },
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

export default AdminUserRepository;
