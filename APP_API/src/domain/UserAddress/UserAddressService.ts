


import UserAddressRepository from './UserAddressRepository';

class UserAddressService {
  private respository: UserAddressRepository

  constructor() {
    this.respository = new UserAddressRepository()
  }
  async create(data: any) {
    try {
      console.log("data", data)
      // Check if a default address already exists for the user
      const isExist = await this.respository.findOne({
        where: { user_id: data.user_id, is_default: 'YES' },
      });
  
      if (isExist) {
        // If a default address exists, update it to 'NO'
        await this.respository.findOneAndUpdate({where: { user_address_id: isExist.user_address_id },  update:{ is_default: 'NO' }});
        // Ensure the new address is marked as default
        data.is_default = 'YES';
      } else {
        // If no default address exists, set the new one to default
        data.is_default = 'YES';
      }
  
      // Create the new address
      return await this.respository.create(data);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        user_address_id: Number(id),
      },
    });
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }

  async getDefaultAddressByUserId(userId: number | string, attributes?: Array<string>) {
    return await this.respository.findOne({
      where: {user_id: userId , is_default: "YES" }
    });
  }

  
  async delete(adminUserId: number | string) {
    const result = await this.respository.delete(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: string | any, searchFilters:any) {
    return await this.respository.paginate({ page, per_page, filter, searchFilters });
  }

  async getList() {
    return await this.respository.findMany();
  }

}


export default UserAddressService;
