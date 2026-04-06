import { PrismaClient } from '../../generated/prisma';
import Stripe from 'stripe';
import dotenv from 'dotenv';
// Load environment variables
// dotenv.config();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
interface PlanConfig {
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  credits_included: number;
  features: Array<{
    feature_id: number;
    included_usage: number | null;
  }>;
}
async function createStripeProductsAndPrices() {
  try {
    console.log('🚀 Starting Stripe products and pricing plans creation...');
    // Clear existing data (be careful in production)
    console.log('🧹 Cleaning existing data...');
    await prisma.planFeature.deleteMany();
    await prisma.feature.deleteMany();
    await prisma.pricingPlan.deleteMany();
    // Create features first
    console.log('📝 Creating features...');
    const features = await Promise.all([
      prisma.feature.create({
        data: {
          name: 'API Call',
          description: 'Standard API request',
          credit_cost: 1,
          is_active: true
        }
      }),
      prisma.feature.create({
        data: {
          name: 'Data Export',
          description: 'Export data to various formats',
          credit_cost: 5,
          is_active: true
        }
      }),
      prisma.feature.create({
        data: {
          name: 'Advanced Analytics',
          description: 'Generate detailed reports and analytics',
          credit_cost: 10,
          is_active: true
        }
      }),
      prisma.feature.create({
        data: {
          name: 'Custom Integration',
          description: 'Set up custom integrations with third-party services',
          credit_cost: 25,
          is_active: true
        }
      }),
      prisma.feature.create({
        data: {
          name: 'Priority Support',
          description: 'Get priority customer support',
          credit_cost: 0,
          is_active: true
        }
      })
    ]);
    console.log(`✅ Created ${features.length} features`);
    // Plan configurations
    const planConfigs: PlanConfig[] = [
      // Monthly plans
      {
        name: 'Starter Monthly',
        description: 'Perfect for small projects and getting started',
        price: 29.99,
        billing_cycle: 'monthly',
        credits_included: 1000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: 50 },   // Data Export - 50/month
          { feature_id: features[2].id, included_usage: 10 },   // Advanced Analytics - 10/month
        ]
      },
      {
        name: 'Professional Monthly',
        description: 'For growing businesses and advanced features',
        price: 79.99,
        billing_cycle: 'monthly',
        credits_included: 3000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: 200 },  // Data Export - 200/month
          { feature_id: features[2].id, included_usage: 50 },   // Advanced Analytics - 50/month
          { feature_id: features[3].id, included_usage: 10 },   // Custom Integration - 10/month
        ]
      },
      {
        name: 'Enterprise Monthly',
        description: 'For large organizations with unlimited needs',
        price: 199.99,
        billing_cycle: 'monthly',
        credits_included: 10000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: null }, // Data Export - unlimited
          { feature_id: features[2].id, included_usage: null }, // Advanced Analytics - unlimited
          { feature_id: features[3].id, included_usage: null }, // Custom Integration - unlimited
          { feature_id: features[4].id, included_usage: null }, // Priority Support - unlimited
        ]
      },
      // Yearly plans (with discount)
      {
        name: 'Starter Yearly',
        description: 'Perfect for small projects (2 months free!)',
        price: 299.99, // ~17% discount
        billing_cycle: 'yearly',
        credits_included: 12000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: 600 },  // Data Export - 600/year
          { feature_id: features[2].id, included_usage: 120 },  // Advanced Analytics - 120/year
        ]
      },
      {
        name: 'Professional Yearly',
        description: 'For growing businesses (2 months free!)',
        price: 799.99, // ~17% discount
        billing_cycle: 'yearly',
        credits_included: 36000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: 2400 }, // Data Export - 2400/year
          { feature_id: features[2].id, included_usage: 600 },  // Advanced Analytics - 600/year
          { feature_id: features[3].id, included_usage: 120 },  // Custom Integration - 120/year
        ]
      },
      {
        name: 'Enterprise Yearly',
        description: 'For large organizations (2 months free!)',
        price: 1999.99, // ~17% discount
        billing_cycle: 'yearly',
        credits_included: 120000,
        features: [
          { feature_id: features[0].id, included_usage: null }, // API Call - unlimited
          { feature_id: features[1].id, included_usage: null }, // Data Export - unlimited
          { feature_id: features[2].id, included_usage: null }, // Advanced Analytics - unlimited
          { feature_id: features[3].id, included_usage: null }, // Custom Integration - unlimited
          { feature_id: features[4].id, included_usage: null }, // Priority Support - unlimited
        ]
      }
    ];
    console.log('💳 Creating Stripe products and prices...');
    
    const createdPlans:any = [];
    for (const planConfig of planConfigs) {
      try {
        console.log(`   Creating: ${planConfig.name}...`);
        
        // Create Stripe product
        const product = await stripe.products.create({
          name: planConfig.name,
          description: planConfig.description,
          metadata: {
            credits_included: planConfig.credits_included.toString(),
            billing_cycle: planConfig.billing_cycle
          }
        });
        console.log(`   ✅ Stripe Product created: ${product.id}`);
        // Create Stripe price
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(planConfig.price * 100), // Convert to cents
          currency: 'usd',
          recurring: {
            interval: planConfig.billing_cycle === 'monthly' ? 'month' : 'year',
          },
          metadata: {
            credits_included: planConfig.credits_included.toString()
          }
        });
        console.log(`   ✅ Stripe Price created: ${price.id}`);
        // Create pricing plan in database
        const dbPlan = await prisma.pricingPlan.create({
          data: {
            name: planConfig.name,
            description: planConfig.description,
            price: planConfig.price,
            billing_cycle: planConfig.billing_cycle,
            credits_included: planConfig.credits_included,
            stripe_price_id: price.id,
            is_active: true
          }
        });
        console.log(`   ✅ Database Plan created: ${dbPlan.id}`);
        // Create plan features
        for (const feature of planConfig.features) {
          await prisma.planFeature.create({
            data: {
              plan_id: dbPlan.id,
              feature_id: feature.feature_id,
              included_usage: feature.included_usage
            }
          });
        }
        console.log(`   ✅ Features linked: ${planConfig.features.length}`);
        createdPlans.push({
          name: planConfig.name,
          stripe_product_id: product.id,
          stripe_price_id: price.id,
          database_plan_id: dbPlan.id,
          price: planConfig.price,
          billing_cycle: planConfig.billing_cycle
        });
        console.log(`   🎉 ${planConfig.name} completed!\
`);
      } catch (error) {
        console.error(`   ❌ Error creating ${planConfig.name}:`, error);
        throw error;
      }
    }
    console.log('🎉 All products and plans created successfully!\
');
    
    // Display summary
    console.log('📊 CREATION SUMMARY:');
    console.log('═══════════════════════');
    console.log(`• Features created: ${features.length}`);
    console.log(`• Stripe products created: ${createdPlans.length}`);
    console.log(`• Database plans created: ${createdPlans.length}`);
    console.log(`• Total plan features linked: ${createdPlans.reduce((sum, plan) => sum + planConfigs.find(p => p.name === plan.name)!.features.length, 0)}`);
    
    console.log('\
💳 STRIPE PRODUCTS & PRICES:');
    console.log('═════════════════════════════');
    createdPlans.forEach(plan => {
      console.log(`${plan.name}:`);
      console.log(`  Product ID: ${plan.stripe_product_id}`);
      console.log(`  Price ID: ${plan.stripe_price_id}`);
      console.log(`  Amount: $${plan.price}/${plan.billing_cycle}`);
      console.log(`  Database ID: ${plan.database_plan_id}\
`);
    });
    console.log('✅ NEXT STEPS:');
    console.log('═══════════════');
    console.log('1. ✅ Stripe products and prices are created');
    console.log('2. ✅ Database plans are populated with real Stripe price IDs');
    console.log('3. 🔧 Set up webhook endpoint in Stripe dashboard:');
    console.log('   URL: https://your-domain.com/pricing/webhook');
    console.log('4. 🚀 Start your application servers');
    console.log('5. 🎯 Test the pricing page and subscription flow');
    
    console.log('\
🎊 Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error in createStripeProductsAndPrices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
// Run the seeder
if (require.main === module) {
  createStripeProductsAndPrices()
    .catch((error) => {
      console.error('💥 Seeder failed:', error);
      process.exit(1);
    });
}
export default createStripeProductsAndPrices;