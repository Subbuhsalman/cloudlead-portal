


import CouponRepository from './CouponRepository';

class CouponService {
  private respository: CouponRepository

  constructor() {
    this.respository = new CouponRepository()
  }
  async create(data: any) {
    const result = await this.respository.findOne({where: { code: data?.code, coupon_title: data?.coupon_title } })
    if(result){
      throw "Already exist"
    }
    const existCoupon = await this.respository.findOne({
      where: { code: data?.code }
    })
    if (existCoupon) {
      return { success: false, message: "Already exist" }
    }
    return {
      success: true,
      message:"Record created",
      data: await this.respository.create(data)
    };
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        coupon_id: Number(id),
      },
    });
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }

  async validateCoupon(code:string) {
    const coupon = await this.respository.findOne({
      where:{
        code: code
      }
    });
    console.log("coupon", coupon)
    return coupon;
  }


  async delete(adminUserId: number | string) {
    const result = await this.respository.delete(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: string | any) {
    return await this.respository.paginate({ page, per_page, filter });
  }

  async getList() {
    return await this.respository.findMany();
  }

}


export default CouponService;
