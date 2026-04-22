import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  
  const plans = [
    {
      name: "Free",
      description: "Perfect for testing the waters and occasional use.",
      price: "$0",
      features: [
        "10 images per day",
        "Standard quality (up to 1024x1024)",
        "Standard generation speed",
        "Community support",
        "Watermark on images"
      ],
      missing: ["Commercial rights", "API access", "Priority queue"],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      description: "For creators who need more power and quality.",
      price: billing === "monthly" ? "$12" : "$115",
      priceDes: billing === "monthly" ? "per month" : "per year (save 20%)",
      features: [
        "Unlimited images",
        "HD quality (up to 4K resolution)",
        "Fast generation speed",
        "Priority email support",
        "No watermarks",
        "Commercial rights",
        "Priority queue access"
      ],
      missing: ["API access"],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Custom solutions for teams and applications.",
      price: "Custom",
      priceDes: "Contact us for pricing",
      features: [
        "Everything in Pro",
        "Custom APIs and webhooks",
        "Dedicated account manager",
        "Custom model fine-tuning",
        "SLA & priority support",
        "Team collaboration"
      ],
      missing: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "What forms of payment do you accept?",
      a: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal for yearly subscriptions."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes! You can cancel your subscription at any time from your account settings. You will continue to have access to your plan until the end of your billing cycle."
    },
    {
      q: "Do I own the images I generate?",
      a: "On the Pro and Enterprise plans, you have full commercial rights to the images you generate. Free plan images include a watermark and are restricted to personal use."
    },
    {
      q: "How does the API pricing work?",
      a: "API access is available on our Enterprise plan. Pricing is based on generation volume. Please contact our sales team for a custom quote tailored to your application's needs."
    }
  ];

  return (
    <div className="w-full relative py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#EC4899] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-6">Pricing Plans</Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            Simple, honest pricing.
          </h1>
          <p className="text-xl text-gray-400">
            Choose the perfect plan for your creative journey. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#111118] p-1.5 rounded-full border border-white/10 flex items-center shadow-lg">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
            >
              Yearly billing
              <span className="bg-green-500/20 text-green-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-1">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24 items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`relative block rounded-3xl ${plan.popular ? 'p-[1.5px] bg-gradient-primary -mt-4 shadow-[0_0_40px_rgba(236,72,153,0.15)] z-10' : 'p-[1px] bg-white/10 mt-0 z-0'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="bg-[#111118] rounded-[calc(1.5rem-1px)] p-8 h-full flex flex-col relative z-20">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold font-heading tracking-tight text-white">{plan.price}</span>
                  {plan.priceDes && <span className="text-gray-400 text-sm ml-2 block mt-1">{plan.priceDes}</span>}
                </div>
                
                <Link to="/signup" className="mt-auto mb-8 block w-full">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full h-12">
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#06B6D4]/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#06B6D4]" />
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.missing.map((feature, j) => (
                    <div key={`m-${j}`} className="flex items-start gap-3 opacity-50">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[#111118] border border-white/10 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 w-full cursor-pointer text-lg font-medium text-white transition-colors hover:bg-white/5">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:-rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
