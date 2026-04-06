


import PlatformSettingsRepository from '../PlatformSettings/PlatformSettingsRepository';
import TaxRatesRepository from './TaxRatesRepository';

class TaxRatesService {
  private respository: TaxRatesRepository

  constructor() {
    this.respository = new TaxRatesRepository()
  }
  async create(data: any) {
    const result = await this.respository.findOne({where:{ country: data?.country, province: data?.province }})
    if(result){
      throw "Already exist"
    }
    return await this.respository.create(data);
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        tax_rate_id: Number(id),
      },
    });
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }

  async getTaxByCountryState(country:string, state:string) {
    const taxRate =  await this.respository.findOne({
      where:{
        country: country,
        province: state
      }
    });
    if(taxRate){
      return { ...taxRate}
    }
    else{
      const platformSetting = new PlatformSettingsRepository()
      const platformTaxRate =  await platformSetting.findOne({where:{key: "DEFAULT_ORDER_USER_TAX"}})
      return { taxt_rate: parseFloat(platformTaxRate.value) }
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


export default TaxRatesService;
