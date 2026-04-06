


import TransactionRepository from './TransactionRepository';

class TransactionService {
  private respository: TransactionRepository

  constructor() {
    this.respository = new TransactionRepository()
  }
  async create(data: any) {
    return await this.respository.create(data);
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        transaction_id: Number(id),
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


  async paginate(page: number, per_page: number, filter: any, searchFilters:any) {
    return await this.respository.paginate({ page, per_page, filter , searchFilters});
  }

  async getList() {
    return await this.respository.findMany();
  }

}


export default TransactionService;
