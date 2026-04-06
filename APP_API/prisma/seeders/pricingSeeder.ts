import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

async function seedPricingData() {
  try {
    console.log('🌱 Starting pricing data seeding...');

    // Clear existing data (be careful in production)
    await prisma.planFeature.deleteMany();
    await prisma.feature.deleteMany();
    await prisma.pricingPlan.deleteMany();

    // Create features
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

    // Create pricing plans
    console.log('💰 Creating pricing plans...');
    const plans = await Promise.all([
      // Monthly plans
      prisma.pricingPlan.create({
        data: {
          name: 'Starter Monthly',
          description: 'Perfect for small projects and getting started',
          price: 29.99,
          billing_cycle: 'monthly',
          credits_included: 1000,
          stripe_price_id: 'price_starter_monthly', // Replace with actual Stripe price IDs
          is_active: true
        }
      }),
      prisma.pricingPlan.create({
        data: {
          name: 'Professional Monthly',
          description: 'For growing businesses and advanced features',
          price: 79.99,
          billing_cycle: 'monthly',
          credits_included: 3000,
          stripe_price_id: 'price_pro_monthly',
          is_active: true
        }
      }),
      prisma.pricingPlan.create({
        data: {
          name: 'Enterprise Monthly',
          description: 'For large organizations with unlimited needs',
          price: 199.99,
          billing_cycle: 'monthly',
          credits_included: 10000,
          stripe_price_id: 'price_enterprise_monthly',
          is_active: true
        }
      }),
      // Yearly plans (with 17% discount)
      prisma.pricingPlan.create({
        data: {
          name: 'Starter Yearly',
          description: 'Perfect for small projects (2 months free!)',
          price: 299.99, // ~25% discount
          billing_cycle: 'yearly',
          credits_included: 12000,
          stripe_price_id: 'price_starter_yearly',
          is_active: true
        }
      }),
      prisma.pricingPlan.create({
        data: {
          name: 'Professional Yearly',
          description: 'For growing businesses (2 months free!)',
          price: 799.99, // ~17% discount
          billing_cycle: 'yearly',
          credits_included: 36000,
          stripe_price_id: 'price_pro_yearly',
          is_active: true
        }
      }),
      prisma.pricingPlan.create({
        data: {
          name: 'Enterprise Yearly',
          description: 'For large organizations (2 months free!)',
          price: 1999.99, // ~17% discount
          billing_cycle: 'yearly',
          credits_included: 120000,
          stripe_price_id: 'price_enterprise_yearly',
          is_active: true
        }
      })
    ]);

    console.log(`✅ Created ${plans.length} pricing plans`);

    // Link features to plans
    console.log('🔗 Linking features to plans...');
    
    // Starter plans (monthly and yearly)
    const starterPlans = plans.filter(plan => plan.name.includes('Starter'));
    for (const plan of starterPlans) {
      await Promise.all([
        // API calls - unlimited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[0].id, // API Call
            included_usage: null // unlimited
          }
        }),
        // Data Export - limited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[1].id, // Data Export
            included_usage: plan.billing_cycle === 'monthly' ? 50 : 600
          }
        }),
        // Advanced Analytics - limited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[2].id, // Advanced Analytics
            included_usage: plan.billing_cycle === 'monthly' ? 10 : 120
          }
        })
      ]);
    }

    // Professional plans (monthly and yearly)
    const proPlan = plans.filter(plan => plan.name.includes('Professional'));
    for (const plan of proPlan) {
      await Promise.all([
        // API calls - unlimited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[0].id, // API Call
            included_usage: null
          }
        }),
        // Data Export - higher limit
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[1].id, // Data Export
            included_usage: plan.billing_cycle === 'monthly' ? 200 : 2400
          }
        }),
        // Advanced Analytics - higher limit
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[2].id, // Advanced Analytics
            included_usage: plan.billing_cycle === 'monthly' ? 50 : 600
          }
        }),
        // Custom Integration - limited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[3].id, // Custom Integration
            included_usage: plan.billing_cycle === 'monthly' ? 10 : 120
          }
        })
      ]);
    }

    // Enterprise plans (monthly and yearly)
    const enterprisePlans = plans.filter(plan => plan.name.includes('Enterprise'));
    for (const plan of enterprisePlans) {
      await Promise.all([
        // All features unlimited
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[0].id, // API Call
            included_usage: null
          }
        }),
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[1].id, // Data Export
            included_usage: null
          }
        }),
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[2].id, // Advanced Analytics
            included_usage: null
          }
        }),
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[3].id, // Custom Integration
            included_usage: null
          }
        }),
        prisma.planFeature.create({
          data: {
            plan_id: plan.id,
            feature_id: features[4].id, // Priority Support
            included_usage: null
          }
        })
      ]);
    }

    console.log('✅ Linked features to plans');
    console.log('🎉 Pricing data seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Summary:');
    console.log(`• Features created: ${features.length}`);
    console.log(`• Pricing plans created: ${plans.length}`);
    console.log(`• Monthly plans: ${plans.filter(p => p.billing_cycle === 'monthly').length}`);
    console.log(`• Yearly plans: ${plans.filter(p => p.billing_cycle === 'yearly').length}`);

  } catch (error) {
    console.error('❌ Error seeding pricing data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedPricingData()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedPricingData;