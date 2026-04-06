

const { startOfMonth, endOfMonth, subMonths } = require('date-fns');
import { prisma } from '../../config/dbConnection';
import { OrderStatus } from '../Orders/types';


class DashboardService {




  async update(id: number, body: any) {
    return null
  }




  async stats(){
    try {
      const currentMonthStart = startOfMonth(new Date());
      const currentMonthEnd = endOfMonth(new Date());
      const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
      const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));
  
      // Helper Function: Calculate Percentage Change
      const calculateChange = (current, previous) => {
        if (previous === 0) {
          // If there were no previous records and there are current records, it's a "new activity"
          return {
            value: current > 0 ? "100.00" : "0.00", // 100% up for new activity, 0% if both are zero
            trend: current > 0 ? "up" : "neutral",  // 'neutral' if no activity in both months
          };
        }
        const value = ((current - previous) / Math.abs(previous)) * 100;
        return {
          value: value.toFixed(2),
          trend: value > 0 ? "up" : "down",
        };
      };
  
      // Fetch All Vendors
      let vendorStats = {};
  

        // Current Month Stats
        const currentMonthCancelledOrders = await prisma.order.count({
          where: {
            created_at: { gte: currentMonthStart, lte: currentMonthEnd },
            order_status: OrderStatus.CANCELLED
          },
        });
        const currentMonthOrders = await prisma.order.count({
          where: {
            created_at: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        });
  
        const currentMonthCustomers = await prisma.user.count({
          where: {
            created_at: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        });
  
        const currentMonthEarnings = await prisma.order.aggregate({
          _sum: { total_amount: true },
          where: {
            created_at: { gte: currentMonthStart, lte: currentMonthEnd },
          },
        });
  
        // Previous Month Stats
        const previousMonthOrders = await prisma.order.count({
          where: {
            created_at: { gte: previousMonthStart, lte: previousMonthEnd },
          },
        });
        const previousMonthCancelledOrders = await prisma.order.count({
          where: {
            created_at: { gte: previousMonthStart, lte: previousMonthEnd },
            order_status: OrderStatus.CANCELLED

          },
        });
        const previousMonthCustomers = await prisma.user.count({
          where: {
            created_at: { gte: previousMonthStart, lte: previousMonthEnd },
          },
        });
  
        const previousMonthEarnings = await prisma.order.aggregate({
          _sum: { total_amount: true },
          where: {
            created_at: { gte: previousMonthStart, lte: previousMonthEnd },
          },
        });
  
        // Calculate Percentage Changes
        const percentageChange = {
          orders: calculateChange(currentMonthOrders, previousMonthOrders),
          newCustomers: calculateChange(currentMonthCustomers, previousMonthCustomers),
          cancelledOrders: calculateChange(currentMonthCancelledOrders, previousMonthCancelledOrders),
          earnings: calculateChange(
            currentMonthEarnings._sum.total_amount || 0,
            previousMonthEarnings._sum.total_amount || 0
          ),
        };
  
        // Collect Stats Per Vendor
        vendorStats = {
          currentMonth: {
            orders: currentMonthOrders,
            newCustomers: currentMonthCustomers,
            cancelledOrders: currentMonthCancelledOrders,
            earnings: currentMonthEarnings._sum.total_amount || 0,
          },
          previousMonth: {
            orders: previousMonthOrders,
            newCustomers: previousMonthCustomers,
            earnings: previousMonthEarnings._sum.total_amount || 0,
          },
          percentageChange,
        };
   
  
      // Response Data
      return vendorStats;
    } catch (error) {
      
      return { error: 'An error occurred while fetching stats.' };
    }
  }
}


export default DashboardService;
