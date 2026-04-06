import React, { useState } from 'react';
import { Check, BarChart3 } from 'lucide-react';

const PricingCards = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    // Mock JSON data for pricing plans
    const pricingData = {
        header: {
            title: "Simple, Transparent Pricing",
            subtitle: "Pay for what you generate. No hidden fees, no limits on creativity."
        },
        plans: [
            {
                id: "free",
                name: "Free",
                icon: "check",
                price: {
                    monthly: 0,
                    annually: 0
                },
                description: "Perfect for testing ideas",
                features: [
                    "10,000 credits / month",
                    "5 AI strategy prompts",
                    "10 AI-generated posts",
                    "Post scheduling to 2 platforms"
                ],
                buttonText: "Get Started",
                buttonStyle: "secondary",
                popular: false,
                colorScheme: "purple"
            },
            {
                id: "plus",
                name: "Plus Plan",
                icon: "chart",
                price: {
                    monthly: 79,
                    annually: 63
                },
                description: "For content creators, or small teams scaling up their campaigns",
                features: [
                    "50,000 credits / month",
                    "40 AI strategy prompts",
                    "200 AI-generated posts",
                    "Schedule to 4 platforms",
                    "Content calendar view",
                    "Brand voice presets (up to 3)",
                    "Campaign folders & tagging"
                ],
                buttonText: "Get Started",
                buttonStyle: "primary",
                popular: true,
                colorScheme: "purple"
            },
            {
                id: "pro",
                name: "Pro Plan",
                icon: "dot",
                price: {
                    monthly: 89,
                    annually: 71
                },
                description: "Built for agencies and power users",
                features: [
                    "150,000 credits / month",
                    "Unlimited strategy prompts",
                    "Unlimited AI post generations",
                    "Multi-brand management",
                    "Connect unlimited platforms",
                    "Priority support + Brand training"
                ],
                buttonText: "Get Started",
                buttonStyle: "secondary",
                popular: false,
                colorScheme: "blue"
            }
        ]
    };

    const renderIcon = (id: string) => {


        switch (id) {
            case "free":
                return <img src="/assets/icons/pricing/free-plan.png" />;
            case "plus":
                return <img src="/assets/icons/pricing/plus-plan.png" />;
            case "pro":
                return <img src="/assets/icons/pricing/pro-plan.png" />;
            default:
                return <></>;
        }
    };

    const getCardClasses = (plan: any) => {
        if (plan.popular) {
            return "bg-[var(--primary-color)] rounded-3xl px-5 py-8 shadow-2xl transform scale-105 relative";
        }
        return "bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow";
    };





    const getButtonClasses = (plan: any) => {
        if (plan.buttonStyle === "primary") {
            return "w-full bg-white text-[var(--primary-color)] font-semibold py-3 px-6 rounded-full hover:bg-gray-50 transition-colors";
        }
        return "w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors";
    };

    const getTextClasses = (plan: any) => {
        return plan.popular ? "text-white" : "text-gray-900";
    };

    const getDescriptionClasses = (plan: any) => {
        return plan.popular ? "text-green-200" : "text-gray-600";
    };

    const getFeatureTextClasses = (plan: any) => {
        return plan.popular ? "text-white" : "text-gray-700";
    };

    const getCurrentPrice = (plan: any) => {
        return plan.price[billingPeriod];
    };

    return (
        <div className=" ">
            {/* Header */}
            <div className="text-center mb-12">

                {/* Billing Toggle */}
                <div className="border border-[var(--primary-color)] inline-flex rounded-full p-1">
                    <button
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${billingPeriod === 'monthly'
                            ? 'bg-[var(--primary-color)] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Billed Monthly
                    </button>
                    <button
                        onClick={() => setBillingPeriod('annually')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${billingPeriod === 'annually'
                            ? 'bg-[var(--primary-color)] text-white shadow-sm'
                            : 'text-gray-600 '
                            }`}
                    >
                        Billed Annually
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 lg:px-25 gap-8 items-start">
                {pricingData.plans.map((plan) => (
                    <div key={plan.id} className={getCardClasses(plan)}>
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-white text-[var(--primary-color)] px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            </div>
                        )}

                        <div className=" mb-6">
                            <div className="w-8 h-8">
                                {renderIcon(plan.id)}
                            </div>
                            <h3 className={`text-xl font-bold ${getTextClasses(plan)}`}>
                                {plan.name}
                            </h3>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className={`text-5xl font-medium ${getTextClasses(plan)}`}>
                                    ${getCurrentPrice(plan)}
                                </span>
                                <span className={`text-sm ${getDescriptionClasses(plan)}`}>/ month</span>
                            </div>
                            <p className={`${getDescriptionClasses(plan)} text-sm  mt-2`}>
                                {plan.description}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div>
                                        {plan.id !== 'plus' ?
                                            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.54564 12.6996C10.5447 12.6996 12.976 10.2683 12.976 7.26921C12.976 4.27011 10.5447 1.83887 7.54564 1.83887C4.54654 1.83887 2.1153 4.27011 2.1153 7.26921C2.1153 10.2683 4.54654 12.6996 7.54564 12.6996ZM10.062 6.3916C10.3271 6.12652 10.3271 5.69673 10.062 5.43165C9.79691 5.16656 9.36712 5.16656 9.10204 5.43165L6.86685 7.66684L5.98924 6.78923C5.72415 6.52415 5.29437 6.52415 5.02928 6.78923C4.7642 7.05432 4.7642 7.4841 5.02928 7.74919L6.38687 9.10677C6.65195 9.37186 7.08174 9.37186 7.34682 9.10677L10.062 6.3916Z" fill="url(#paint0_linear_14_296)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_14_296" x1="2.11576" y1="7.26771" x2="12.9752" y2="7.26771" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#8800FF" />
                                                        <stop offset="1" stopColor="#3305C1" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            :
                                            <svg width="20" height="20" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.07689 12.722C10.076 12.722 12.5072 10.2908 12.5072 7.29167C12.5072 4.29258 10.076 1.86133 7.07689 1.86133C4.07779 1.86133 1.64655 4.29258 1.64655 7.29167C1.64655 10.2908 4.07779 12.722 7.07689 12.722ZM9.59325 6.41406C9.85833 6.14898 9.85833 5.71919 9.59325 5.45411C9.32816 5.18902 8.89837 5.18902 8.63329 5.45411L6.3981 7.6893L5.52049 6.81169C5.2554 6.54661 4.82562 6.54661 4.56053 6.81169C4.29545 7.07678 4.29545 7.50656 4.56053 7.77165L5.91812 9.12924C6.1832 9.39432 6.61299 9.39432 6.87807 9.12924L9.59325 6.41406Z" fill="white" />
                                            </svg>

                                        }
                                    </div>
                                    <span className={`${getFeatureTextClasses(plan)} text-xs `}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`rounded-full ${getButtonClasses(plan)}`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { PricingCards }