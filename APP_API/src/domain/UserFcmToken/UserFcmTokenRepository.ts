import { prisma } from "../../config/dbConnection";

class UserFcmTokenRepository {
  async create(data: any) {
    try {
      const newUser = await prisma.userFcmToken.create({
        data: data,
      });
      return newUser;  
    } catch (error) {
      console.log("error", error)
      return error
    }
    
  }
  async findOne({ where }: { where: any }) {
    return await prisma.userFcmToken.findFirst({
      where,
    });
  }

  async findMany({ where }: { where: any }) {
    return await prisma.userFcmToken.findMany({where});
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.userFcmToken.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.userFcmToken.delete({
      where: { user_fcm_token_id: Number(id) },
    });
  }
  async deleteWhere({
    where,
  }: {
    where: any;
  }) {
    try {
     const token = await this.findOne({where:where})
     if(token){
      return await prisma.userFcmToken.delete({
        where: { user_fcm_token_id: token?.user_fcm_token_id},
      });
     }
     else{
      return { messsage :"deleted"}
     }
      
    } catch (error) {
      console.log("error", error)
      throw new Error(error)
    }
   
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.userFcmToken.findUnique({
      where: { user_fcm_token_id: Number(id) },
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
    sorting = [['user_fcm_token_id', 'desc']],
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
      where.userFcmToken_name = { contains: filter };
    }

    try {
      // Count total records
      const totalRecords = await prisma.userFcmToken.count({ where });

      // Fetch paginated records
      const list = await prisma.userFcmToken.findMany({
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

export default UserFcmTokenRepository;
