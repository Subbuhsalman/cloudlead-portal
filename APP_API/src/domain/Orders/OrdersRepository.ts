import { equals } from 'class-validator';
import { prisma } from '../../config/dbConnection';


class OrdersRepository {
  async create(data: any) {
    try {
      const newUser = await prisma.order.create({
        data: data,
      });
      return newUser;  
    } catch (error) {
      console.log("error", error)
      throw error
    }
    
  }
  async findOne({ where }: { where: any }) {
    return await prisma.order.findFirst({
      where,
    });
  }

  async findMany() {
    return await prisma.order.findMany();
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    try {
      return await prisma.order.update({
        where,
        data: update,
      });      
    } catch (error) {
      console.log("error", error)
      return error;
    }
  }

  async delete(id: number | string) {
    return await prisma.order.delete({
      where: { order_id: Number(id) },
    });
  }

  async getById(id: number | string, attributes: Array<string>) {
    return await prisma.order.findUnique({
      where: { order_id: Number(id) },
      include:{
        User: true,
        Transaction: true,
        
      }
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
    sorting = [['updated_at', 'desc']],
    searchFilters =null
  }: {
    page?: number;
    per_page?: number;
    filter?: any;
    sorting?: [string, 'asc' | 'desc'][];
    searchFilters:any
  }) {
    const offset = (page - 1) * per_page;
     searchFilters = JSON.parse(searchFilters)

    // Define the filters
    const where: any = {};

    if(searchFilters?.user_id && Number(searchFilters?.user_id) > 0){
      where.user_id = Number(searchFilters?.user_id)
    }
    if(searchFilters?.vendor_id !== undefined && Number(searchFilters?.vendor_id) > 0){
      where.vendor_id = Number(searchFilters?.vendor_id)
    }
    if(searchFilters?.order_status !== "" && searchFilters?.order_status !== "ALL" && searchFilters?.order_status !== undefined){
      where.order_status = searchFilters?.order_status
    }
    if (filter && !isNaN(Number(filter))) {
      where.order_id = { equals: Number(filter) };
    }
    try {
      // Count total records
      const totalRecords = await prisma.order.count({ where });

      // Fetch paginated records
      const list = await prisma.order.findMany({
        where,
        orderBy: sorting.map(([field, direction]) => ({ [field]: direction })),
        skip: offset,
        take: per_page,
        include:{
          User: true,
        }
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

export default OrdersRepository;
