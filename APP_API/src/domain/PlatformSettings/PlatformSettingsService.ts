


import PlatformSettingsRepository from './PlatformSettingsRepository';

class PlatformSettingsService {
  private respository: PlatformSettingsRepository

  constructor() {
    this.respository = new PlatformSettingsRepository()
  }
  async create(data: any) {
    const result = await this.respository.findOne({where:{ key: data?.key}})
    if(result){
      throw "Already exist"
    }
    return await this.respository.create(data);
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        platform_setting_id: Number(id),
      },
    });
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }

  async getByKey(key: string) {
    try {
      return await this.respository.findOne({
        where:{ key : key}
      });  
    } catch (error) {
      console.log("error", error)
      throw new Error(error)
    }
    
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


export default PlatformSettingsService;
