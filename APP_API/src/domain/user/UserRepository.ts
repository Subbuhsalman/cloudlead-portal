import { prisma } from "../../config/dbConnection";




class UserRepository {

  async create(user:any) {
    const userData = await prisma.user.create({
      data: {
        name: user.name,
        email:user.email,
        phone_number_verified:user.phone_number_verified,
        password: user.password,
        UserWallet :{
          create: { amount: 0 }
        }
      },
     
    })
    return userData
  }

  async checkIfExists({
    user,
    returnResponseIfExists,
  }: {
    user: { email?: string; };
    returnResponseIfExists?: boolean;
  }) {
    try {
      const data = await prisma.user.findFirst({
        where: {
          OR: [
            { email: user?.email || '' },
          ],
        },
        include:{
          UserWallet: true
        }
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
  

  async findOne({ where }: { where: Record<string, any> }) {
    return await prisma.user.findFirst({ where });
  }
  

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: Record<string, any>;
    where: any;
  }) {
    return await prisma.user.update({
      where,
      data: update,
    });
  }
  

  async deleteByUserId(userId: number | string) {
    try {
      return await prisma.user.delete({
        where: { user_id: Number(userId) },
      });  
    } catch (error) {
      console.log("error", error)
      throw error
    }
    
  }



  async getUserById(userId: number | string, attributes: Array<string>) {
    return await prisma.user.findUnique({
      where: { user_id: Number(userId) },
      select: {
        user_id: attributes.includes('user_id'),
        name: attributes.includes('name'),
        email: attributes.includes('email'),
        status: attributes.includes('status'),
        created_at: attributes.includes('created_at'),
        UserWallet: true
      },
    });
  }
  

  async checkIfUserExistsByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    return user || false;
  }
  async validateUserPassword(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    // Replace this with secure password validation logic if hashed
    return user && user.password === password;
  }
  

  async paginate({
    page = 1,
    per_page = 10,
    filter = "",
    sorting = [['user_id', 'desc']],
  }: {
    page?: number;
    per_page?: number;
    filter?: any;
    sorting?: [string, 'asc' | 'desc'][];
  }) {
    const offset = (page - 1) * per_page;

    // Define the filters
    const where: any = {};
    if (filter && typeof filter === 'string' && filter.trim() !== '') {
      console.log('Filter value:', filter, 'Type:', typeof filter);
      where.OR = [
        { name: { contains: filter } },
        { email: { contains: filter } }
      ];
    }
    console.log('Where clause:', JSON.stringify(where, null, 2));

    try {
      // Count total records
      const totalRecords = await prisma.user.count({ where });

      // Fetch paginated records
      const list = await prisma.user.findMany({
        where,
        orderBy: sorting.map(([field, direction]) => ({ [field]: direction })),
        skip: offset,
        take: per_page,
        include:{
          UserWallet: true,
          UserCredit: {
            select: {
              total_credits: true,
              used_credits: true,
              remaining_credits: true
            }
          }
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

  async addCredits(creditData: any) {
    try {
      const result = await prisma.userCredit.create({
        data: creditData
      });
      return result;
    } catch (error) {
      console.error('Error adding credits:', error);
      throw new Error(`Failed to add credits: ${error.message}`);
    }
  }

  async findOrCreateAdminSubscription(userId: number) {
    try {
      // First, try to find an existing subscription for the user
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'active'
        }
      });

      if (existingSubscription) {
        return existingSubscription.id;
      }

      // If no existing subscription, create a default admin subscription
      // First, we need to find a default plan (plan_id = 1 or create one)
      let defaultPlanId = 1;
      
      // Check if plan exists, if not create a default one
      const existingPlan = await prisma.pricingPlan.findFirst({
        where: { id: defaultPlanId }
      });

      if (!existingPlan) {
        // Create a default plan for admin credits
        const defaultPlan = await prisma.pricingPlan.create({
          data: {
            name: 'Credits',
            description: 'Default plan for admin-added credits',
            price: 0,
            billing_cycle: 'monthly',
            credits_included: 0,
            stripe_price_id: 'admin_credits',
            is_active: true
          }
        });
        defaultPlanId = defaultPlan.id;
      }

      // Create a subscription for admin credits
      const adminSubscription = await prisma.userSubscription.create({
        data: {
          user_id: userId,
          plan_id: defaultPlanId,
          stripe_subscription_id: `admin_${userId}_${Date.now()}`,
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        }
      });

      return adminSubscription.id;
    } catch (error) {
      console.error('Error finding or creating admin subscription:', error);
      throw new Error(`Failed to find or create admin subscription: ${error.message}`);
    }
  }


}

export default UserRepository;
