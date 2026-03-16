import Link from "next/link";
import { Button, cn } from "@/components/Button";
import { Card, CardContent, Badge } from "@/components/Card";
import { 
  CheckCircle2, 
  Crown, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Star, 
  Target, 
  Info, 
  Trophy, 
  ChevronDown,
  LineChart,
  BarChart3,
  Search,
  Users,
  Ticket
} from "lucide-react";
import { createServerClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EdgeBet Football | Professional Soccer Betting Insights",
  description: "Join the elite football betting community. Get daily high-confidence slips, combo picks, and deep technical match analysis from professional analysts.",
};

export default async function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white selection:bg-primary selection:text-black font-sans">
      <PublicNavbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 xl:py-40">
          {/* Animated Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-700" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-10 shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Trusted by 12,000+ Serious Bettors
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
              SMARTER <br />
              <span className="text-primary relative">
                FOOTBALL SLIPS
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="mx-auto max-w-[800px] text-gray-400 text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed">
              Unlock professional-grade football insights with clear analyst reasoning, confidence ratings, and data-driven combo markets. Stop betting on luck—start using the Edge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/subscription" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:px-14 h-16 text-xl font-black shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all">
                  GET STARTED NOW
                </Button>
              </Link>
              <Link href="/slips" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:px-14 h-16 text-xl font-bold border-white/10 hover:bg-white/5 backdrop-blur-sm">
                  VIEW TODAY’S SLIPS
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/5 pt-12">
              {[
                { label: 'Win Rate', value: '74.2%', icon: Target, color: 'text-secondary' },
                { label: 'Average Odds', value: '2.15', icon: Zap, color: 'text-primary' },
                { label: 'Verified Picks', value: '3,200+', icon: ShieldCheck, color: 'text-blue-500' },
                { label: 'Active ROI', value: '+18.8%', icon: TrendingUp, color: 'text-green-500' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center group cursor-default">
                  <div className={cn("w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300", stat.color)}>
                    <stat.icon className="w-5 h-5 fill-current opacity-80" />
                  </div>
                  <span className="text-3xl font-black mb-1 group-hover:text-primary transition-colors duration-300">{stat.value}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 relative bg-black/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  WHY SERIOUS BETTORS CHOOSE <span className="text-primary underline decoration-primary/20 underline-offset-8">EDGEBET</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  We don't just provide picks. We provide a professional framework for football betting success.
                </p>
                <Link href="/subscription" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all">
                  Join the 1% today <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Deep Analyst Reasoning',
                    desc: 'Every slip includes a full breakdown. We explain the "why" so you can bet with absolute confidence.',
                    icon: Info,
                  },
                  {
                    title: 'Confidence Ratings',
                    desc: 'Our proprietary 1-10 scoring system helps you manage your stake size for every single pick.',
                    icon: BarChart3,
                  },
                  {
                    title: 'Combo Market Edge',
                    desc: 'Unlock value in high-yield markets like BTTS + Over 2.5 and customized half-time combinations.',
                    icon: Trophy,
                  },
                  {
                    title: 'Real-Time Performance',
                    desc: 'Fully transparent results tracking. View our historical hit rate and ROI updated every 24 hours.',
                    icon: LineChart,
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{benefit.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">HOW IT WORKS</h2>
              <p className="text-gray-400 text-lg">From data to profit in three simple steps.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
              
              {[
                {
                  step: '01',
                  title: 'Daily Analysis',
                  desc: 'Our analysts scour the top leagues to find the highest value opportunities.',
                  icon: Search,
                },
                {
                  step: '02',
                  title: 'Professional Slips',
                  desc: 'We curate Safe, Balanced, and Aggressive slips tailored to your betting style.',
                  icon: Ticket,
                },
                {
                  step: '03',
                  title: 'Scale Your Bankroll',
                  desc: 'Execute the slips using our suggested confidence stakes and watch your ROI grow.',
                  icon: TrendingUp,
                },
              ].map((step) => (
                <div key={step.step} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary shadow-xl transition-all duration-500 rotate-3 group-hover:rotate-0">
                    <step.icon className="w-10 h-10 text-primary" />
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center shadow-lg">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-gray-400 max-w-[280px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Betting Markets Supported */}
        <section className="py-24 bg-white/5 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">PREMIUM MARKET COVERAGE</h2>
              <p className="text-gray-400">We specialize in high-yield markets that bookmakers often misprice.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                '1X2 Match Result', 'Both Teams to Score', 'Over/Under Goals', 'Asian Handicap', 
                'Double Chance Combo', '1st Half / 2nd Half', 'Draw No Bet', 'Player Prop Combos',
                'Win to Nil', 'Clean Sheet Market'
              ].map((market) => (
                <div key={market} className="px-6 py-3 rounded-full bg-background border border-white/10 text-sm font-bold hover:border-primary/50 transition-colors cursor-default shadow-md">
                  {market}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Slip Preview */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                  SEE THE QUALITY OF OUR <span className="text-primary">EXPERT SLIPS</span>
                </h2>
                <div className="space-y-6 mb-12">
                  {[
                    { label: 'Market Specialization', desc: 'Focus on high-value European & Latin American leagues.' },
                    { label: 'Risk Management', desc: 'Every slip categorized by risk: Safe, Balanced, or Aggressive.' },
                    { label: 'Transparency', desc: 'Full reasoning provided for every single pick in the slip.' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.label}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/slips">
                  <Button variant="outline" className="h-14 px-10 font-bold border-primary/30 hover:bg-primary/5 text-primary">
                    View Today's Full Board
                  </Button>
                </Link>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <Card className="relative bg-[#121212] border-primary/30 p-8 rounded-[32px] shadow-2xl overflow-hidden scale-[1.02]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <Badge variant="primary" className="mb-2 bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black">COMBO SPECIAL</Badge>
                      <h3 className="text-3xl font-black">Weekend Power-3</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">Total Odds</span>
                      <span className="text-4xl font-black text-primary">4.25</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { match: 'Man City vs Arsenal', pick: 'Home Win + Over 1.5', odds: '1.95', conf: '9/10' },
                      { match: 'Real Madrid vs Barcelona', pick: 'BTTS - Yes', odds: '1.65', conf: '8/10' },
                      { match: 'Bayern vs Dortmund', pick: 'Over 3.5 Goals', odds: '2.10', conf: '7/10' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.match}</span>
                          <span className="text-xs font-black text-primary">@{item.odds}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">{item.pick}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-bold">Conf: {item.conf}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[11px] text-gray-400 leading-tight italic">
                      "Both City and Real are at full strength. Historically, these matchups at home yield 2.5+ goals with 80% frequency. The Bayern pick capitalize on Dortmund's defensive injuries."
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Free vs Premium Comparison */}
        <section className="py-32 bg-black/40 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">COMPARE ACCESS</h2>
              <p className="text-gray-400 text-lg">Choose the level of edge you need.</p>
            </div>
            
            <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-background shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-8 text-xl font-black border-b border-white/10">Feature</th>
                    <th className="p-8 text-xl font-black border-b border-white/10 text-center">Free</th>
                    <th className="p-8 text-xl font-black border-b border-white/10 text-center text-primary">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { f: 'Daily Safe Slips', free: true, prem: true },
                    { f: 'Basic Match Selection', free: true, prem: true },
                    { f: 'Confidence Ratings (1-10)', free: false, prem: true },
                    { f: 'Detailed Analyst Reasoning', free: false, prem: true },
                    { f: 'Aggressive & Combo Markets', free: false, prem: true },
                    { f: 'Live Result Notifications', free: false, prem: true },
                    { f: 'Advanced Performance ROI', free: false, prem: true },
                    { f: 'Direct Analyst Support', free: false, prem: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-8 font-medium text-gray-300">{row.f}</td>
                      <td className="p-8 text-center">
                        {row.free ? <CheckCircle2 className="w-6 h-6 text-gray-600 mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/10 mx-auto" />}
                      </td>
                      <td className="p-8 text-center">
                        <CheckCircle2 className="w-6 h-6 text-primary mx-auto shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black mb-4 uppercase">VOICES FROM THE EDGE</h2>
              <p className="text-gray-400">Join thousands of smart bettors who turned their hobby into a strategy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Marco S.', role: 'Premium Member', text: 'The analyst reasoning changed how I view football. I no longer bet on emotion, but on actual tactical edges.' },
                { name: 'David L.', role: 'Active User', text: 'I started with the free slips and upgraded after my first winning weekend. The combo markets are where the real value is.' },
                { name: 'Sarah K.', role: 'Elite Subscriber', text: 'The confidence ratings are a game changer for bankroll management. Finally, a platform that takes betting seriously.' },
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 relative group">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-current" />)}
                  </div>
                  <p className="text-gray-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary uppercase">{t.name[0]}</div>
                    <div>
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-white/5 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-black mb-16 text-center uppercase tracking-tight">FREQUENTLY ASKED</h2>
            <div className="space-y-4">
              {[
                { q: 'How many slips do you provide daily?', a: 'We typically provide 1-2 Safe slips and 1 high-value Aggressive or Combo slip every single day, focused on the top European leagues.' },
                { q: 'Can I cancel my subscription anytime?', a: 'Yes, absolutely. All our plans are managed through Stripe, and you can cancel with a single click from your profile page.' },
                { q: 'What is the average hit rate of premium picks?', a: 'Our historical verified hit rate across all premium picks is 74.2%. You can view our full transparent results history in the dashboard.' },
                { q: 'Do you cover more than just European leagues?', a: 'While our primary focus is on Europe (PL, La Liga, UCL), we also cover major Latin American and international tournaments where our analysts find value.' },
              ].map((faq, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-background border border-white/10 hover:border-primary/30 transition-all cursor-default">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{faq.q}</h4>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-primary transition-all" />
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-40 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">
              READY TO GAIN THE <br />
              <span className="text-primary">ULTIMATE EDGE?</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Join 12,000+ smart bettors and start winning with professional football insights today.
            </p>
            <Link href="/subscription">
              <Button variant="primary" size="lg" className="h-20 px-16 text-2xl font-black shadow-[0_0_50px_rgba(212,175,55,0.4)] group">
                START WINNING NOW <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
