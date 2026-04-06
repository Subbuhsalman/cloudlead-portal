


import UserWalletRepository from './UserWalletRepository';

class UserWalletService {
  private respository: UserWalletRepository

  constructor() {
    this.respository = new UserWalletRepository()
  }
  async create(data: any) {
    return await this.respository.create(data);
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        userWallet_id: Number(id),
      },
    });
  }

  async updateByUserId(userId: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        user_id: Number(userId),
      },
    });
  }
  async findByUserId(userId: number) {
    return await this.respository.findOne({
      where: {
        user_id: Number(userId),
      },
    });
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }


  async delete(adminUserId: number | string) {
    const result = await this.respository.delete(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: any) {
    return await this.respository.paginate({ page, per_page, filter });
  }

  async getList() {
    return await this.respository.findMany();
  }

}


export default UserWalletService;
