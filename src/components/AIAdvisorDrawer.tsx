import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Lightbulb,
  Bot,
  User,
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { BorrowerProfile, ScoringResult } from '../types';
import { Language, translations } from '../i18n/translations';
import OpenAI from 'openai';

interface AIAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BorrowerProfile;
  scoring: ScoringResult;
  language: Language;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  tips?: string[];
}

export const AIAdvisorDrawer: React.FC<AIAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  scoring,
  language
}) => {
  const t = translations[language];

  // Initialize OpenAI client for Hugging Face (optional)
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
    baseURL: 'https://api-inference.huggingface.co/v1',
    dangerouslyAllowBrowser: true // Allow browser-side calls
  });

  const hasApiKey = !!import.meta.env.VITE_HUGGINGFACE_API_KEY && import.meta.env.VITE_HUGGINGFACE_API_KEY !== 'MY_HUGGINGFACE_API_KEY';

  const initialGreeting: Message = {
    id: 'msg-0',
    sender: 'ai',
    text: language === 'hi'
      ? `नमस्ते ${profile.nameHindi || profile.fullName}! मैं आपका क्रेडनोवा एआई वित्तीय सलाहकार हूँ। आपका वर्तमान वैकल्पिक क्रेडिट स्कोर ${scoring.score} (${scoring.riskCategory}) है। क्रेडनोवा पुराने बैंक ब्यूरो के बजाय आपके वास्तविक नकदी प्रवाह और बिल अनुशासन को देखता है। आज आप क्या जानना चाहते हैं?`
      : `Namaste ${profile.fullName}! I'm your CredNova AI Financial Coach. Your current Alternative Credit Score is ${scoring.score} (${scoring.riskCategory}). Because CredNova looks at real cashflow and utility discipline rather than legacy bank bureau files, you have several powerful ways to build credit fast. What would you like to explore today?`,
    tips: language === 'hi'
      ? [
          '90 दिनों में 750+ स्कोर कैसे प्राप्त करें',
          'गिग मौसमी बदलाव का मेरे स्कोर पर प्रभाव',
          'बिना सैलरी स्लिप के आय कैसे प्रमाणित करें'
        ]
      : [
          'How to reach 750+ score in 90 days',
          'How gig seasonality affects my credit',
          'How to prove income without salary slips'
        ]
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Only call API if key is available
      if (hasApiKey) {
        // Prepare context for the AI
        const context = language === 'hi'
          ? `तुम एक क्रेडनोवा एआई वित्तीय सलाहकार हो। उपयोगकर्ता का नाम: ${profile.nameHindi || profile.fullName}, वैकल्पिक क्रेडिट स्कोर: ${scoring.score} (${scoring.riskCategory}), मासिक औसत आय: ₹${profile.monthlyAverageIncome.toLocaleString('en-IN')}, बिल भुगतान स्ट्रीक: ${profile.utilityPaymentStreakMonths} महीने, आपातकालीन बफर: ${profile.emergencySavingsBufferDays} दिन। दो भाषाओं में उत्तर दें: पहले हिंदी में, फिर अंग्रेजी में।`
          : `You are a CredNova AI Financial Coach. User name: ${profile.fullName}, Alternative Credit Score: ${scoring.score} (${scoring.riskCategory}), Monthly Average Income: ₹${profile.monthlyAverageIncome.toLocaleString('en-IN')}, Utility Payment Streak: ${profile.utilityPaymentStreakMonths} months, Emergency Buffer: ${profile.emergencySavingsBufferDays} days. Provide helpful, actionable financial advice in ${language === 'hi' ? 'Hindi and English' : 'English'}.`;

        const completion = await openai.chat.completions.create({
          model: 'meta-llama/Llama-3.3-70B-Instruct',
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: userQuery }
          ],
          max_tokens: 500,
          temperature: 0.7
        });

        const aiResponse = completion.choices[0]?.message?.content;

        if (aiResponse) {
          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: aiResponse,
            tips: language === 'hi'
              ? ['90-दिवसीय कार्ययोजना दिखाएं', 'मुझे कितनी ऋण राशि सिमुलेट करनी चाहिए?']
              : ['Show 90-day checklist', 'What loan amount should I simulate?']
          };

          setMessages(prev => [...prev, aiMsg]);
          return;
        }
      }
    } catch (error) {
      console.error('AI API Error:', error);
    }

    // Fallback to hardcoded responses if API fails or no key
    let replyText = '';
    let replyTips: string[] | undefined;

    const q = userQuery.toLowerCase();
    if (q.includes('750') || q.includes('increase') || q.includes('improve') || q.includes('स्कोर') || q.includes('सुधार')) {
      replyText = language === 'hi'
        ? `आपकी ऑडिटेड प्रोफ़ाइल के अनुसार, आप 90 दिनों में +45 से +60 अंक प्राप्त कर सकते हैं:
1. अपनी ${profile.utilityPaymentStreakMonths}-महीने की बिल भुगतान श्रृंखला जारी रखें (प्रत्येक समय पर रिचार्ज +12 अंक जोड़ता है)।
2. ₹300-₹500 प्रति सप्ताह की माइक्रो-बचत शुरू करके अपने आपातकालीन बफर को ${profile.emergencySavingsBufferDays} दिनों से बढ़ाकर 45 दिन करें।
3. अपने ऋण-से-आय (DTI) अनुपात को 20% से नीचे रखें।`
        : `Based on your audited profile, you can gain +45 to +60 points within 90 days by:
1. Maintaining your ${profile.utilityPaymentStreakMonths}-month utility streak (every on-time recharge adds +12 pts).
2. Automating a micro-deposit of ₹300-₹500 weekly to stretch your emergency cash cushion from ${profile.emergencySavingsBufferDays} days towards 45 days.
3. Keeping your debt-to-income ratio strictly below 20%.`;
      replyTips = language === 'hi'
        ? ['माइक्रो-बचत विकल्पों के बारे में बताएं', 'ऋणदाता मेरे यूपीआई रिकॉर्ड को कैसे देखते हैं']
        : ['Tell me about micro-savings options', 'How lenders view my UPI receipts'];
    } else if (q.includes('season') || q.includes('irregular') || q.includes('gig') || q.includes('मौसम') || q.includes('गिग')) {
      replyText = language === 'hi'
        ? `क्रेडनोवा विशेष रूप से गिग कार्यकर्ताओं और कारीगरों को मौसमी गिरावट के दंड से बचाता है! हमारा इंजन 25वें परसेंटाइल पर आपकी आधारभूत स्थायी आय (BSI) को ₹${Math.round(profile.monthlyAverageIncome * 0.75).toLocaleString('en-IN')}/माह मापता है। त्योहारों या मौसम के कारण कमाई में उतार-चढ़ाव होने पर भी स्कोर में कटौती नहीं होती, जब तक आप मासिक शुद्ध बचत बनाए रखते हैं।`
        : `CredNova explicitly protects gig workers and artisans from seasonality penalties! Our engine measures your Baseline Sustainable Income (BSI) at the 25th percentile (₹${Math.round(profile.monthlyAverageIncome * 0.75).toLocaleString('en-IN')}/mo). When festivals surge or monsoon slows down deliveries, we do not deduct points as long as you maintain your monthly net savings discipline.`;
      replyTips = language === 'hi'
        ? ['मेरी ऋण सीमा क्या है?', 'क्रेडिट पासपोर्ट कैसे डाउनलोड करें']
        : ['What is my loan eligibility limit?', 'How to download my credit passport'];
    } else if (q.includes('salary') || q.includes('proof') || q.includes('income') || q.includes('सैलरी') || q.includes('आय')) {
      replyText = language === 'hi'
        ? `आपको पारंपरिक सैलरी स्लिप की कोई आवश्यकता नहीं है! क्रेडनोवा सीधे आपके यूपीआई क्यूआर मर्चेंट लेजर, डिजिटल वॉलेट रसीदों, डिलीवरी प्लेटफॉर्म भुगतान (ज़ोमैटो/ब्लिंकिट/ओला/डेयरी) और बिल भुगतान स्ट्रीक से आय सत्यापित करता है। यह डिजिटल साक्ष्य हमारे भागीदार सूक्ष्म-ऋण संस्थानों द्वारा 100% मान्य है।`
        : `You do NOT need formal salary slips! CredNova verifies your earnings directly through your UPI QR merchant ledger, digital wallet receipts, platform partner payouts (Zomato/Blinkit/Ola/Dairy cooperative), and utility bill payment streaks. This verifiable digital footprint carries full weight with our partner micro-finance institutions.`;
      replyTips = language === 'hi'
        ? ['आपातकालीन बफर कैसे बनाएं', 'मेरे स्कोर कारक समझाएं']
        : ['How to build emergency buffer', 'Explain my score factors'];
    } else if (q.includes('micro-savings') || q.includes('savings') || q.includes('save') || q.includes('बचत')) {
      replyText = language === 'hi'
        ? `माइक्रो-बचत विकल्प जो आपके क्रेडिट स्कोर को बढ़ाते हैं:
1. यूपीआई ऑटो-पे: ₹100-₹200 साप्ताहिक स्वचालित बचत
2. जीरो-बैलेंस खाते: फिनटेक ऐप्स पर ब्याज-अर्जित बचत
3. मोबाइल वॉलेट: पेटीएम/फोनपे पर राउंड-अप बचत
4. समिति चक्र: पारंपरिक ROSCA आधारित बचत`
        : `Micro-savings options that boost your credit score:
1. UPI Auto-Pay: Set up ₹100-₹200 weekly automated savings
2. Zero-balance accounts: Interest-earning savings on fintech apps
3. Mobile wallets: Round-up savings on Paytm/PhonePe
4. Chit funds/ROSCA: Traditional group-based savings cycles`;
      replyTips = language === 'hi'
        ? ['आपातकालीन बफर कैसे बनाएं', 'मेरी ऋण सीमा क्या है?']
        : ['How to build emergency buffer', 'What is my loan eligibility limit?'];
    } else if (q.includes('checklist') || q.includes('90-day') || q.includes('90 day') || q.includes('कार्ययोजना')) {
      replyText = language === 'hi'
        ? `📋 90-दिवसीय क्रेडिट बिल्डअप योजना:

दिन 1-30: नींव
✅ सभी बिल 3 दिन पहले भरें
✅ यूपीआई लेनदेन सक्रिय रखें
✅ ₹200 साप्ताहिक बचत शुरू करें

दिन 31-60: गति
✅ बिल भुगतान स्ट्रीक बनाए रखें
✅ डिजिटल वॉलेट बैलेंस बढ़ाएं
✅ एक छोटा ऋण लें और समय पर चुकाएं

दिन 61-90: विस्तार
✅ आपातकालीन बफर 45 दिन तक बढ़ाएं
✅ क्रेडिट पासपोर्ट डाउनलोड करें
✅ बड़े ऋण के लिए आवेदन करें`
        : `📋 90-Day Credit Buildup Plan:

Days 1-30: Foundation
✅ Pay all bills 3 days early
✅ Keep UPI transactions active
✅ Start ₹200 weekly savings

Days 31-60: Momentum
✅ Maintain bill payment streak
✅ Increase digital wallet balance
✅ Take a small loan and repay on time

Days 61-90: Expansion
✅ Build emergency buffer to 45 days
✅ Download credit passport
✅ Apply for larger loans`;
      replyTips = language === 'hi'
        ? ['मेरी ऋण सीमा क्या है?', 'क्रेडिट पासपोर्ट कैसे डाउनलोड करें']
        : ['What is my loan eligibility limit?', 'How to download my credit passport'];
    } else if (q.includes('loan') || q.includes('simulate') || q.includes('amount') || q.includes('ऋण') || q.includes('राशि')) {
      const loanAmount = Math.round(profile.monthlyAverageIncome * 3);
      replyText = language === 'hi'
        ? `आपकी ${scoring.score} स्कोर और ₹${profile.monthlyAverageIncome.toLocaleString('en-IN')}/माह आय के आधार पर, आप लगभग ₹${loanAmount.toLocaleString('en-IN')} तक का ऋण प्राप्त कर सकते हैं।

ऋण विकल्प:
- व्यक्तिगत ऋण: ₹${Math.round(loanAmount * 0.6).toLocaleString('en-IN')}
- व्यापार ऋण: ₹${Math.round(loanAmount * 0.8).toLocaleString('en-IN')}
- आपातकालीन ऋण: ₹${Math.round(loanAmount * 0.4).toLocaleString('en-IN')}`
        : `Based on your ${scoring.score} score and ₹${profile.monthlyAverageIncome.toLocaleString('en-IN')}/mo income, you're eligible for approximately ₹${loanAmount.toLocaleString('en-IN')}.

Loan options:
- Personal loan: ₹${Math.round(loanAmount * 0.6).toLocaleString('en-IN')}
- Business loan: ₹${Math.round(loanAmount * 0.8).toLocaleString('en-IN')}
- Emergency loan: ₹${Math.round(loanAmount * 0.4).toLocaleString('en-IN')}`;
      replyTips = language === 'hi'
        ? ['ब्याज दरें क्या हैं?', 'ऋण कैसे आवेदन करें?']
        : ['What are the interest rates?', 'How to apply for a loan?'];
    } else if (q.includes('upi') || q.includes('lender') || q.includes('receipts') || q.includes('लेंडर')) {
      replyText = language === 'hi'
        ? `ऋणदाता आपके यूपीआई रिकॉर्ड को इस प्रकार देखते हैं:
✅ लेनदेन की नियमितता - सप्ताह में 5+ लेनदेन
✅ भुगतान की समयबद्धता - देरी से भुगतान नहीं
✅ व्यापारिक स्थिरता - समान व्यापारियों से नियमित खरीद
✅ बचत पैटर्न - नियमित बचत लेनदेन

यह डेटा आपकी वित्तीय अनुशासन का प्रमाण है!`
        : `Lenders view your UPI records as follows:
✅ Transaction frequency - 5+ transactions weekly
✅ Payment punctuality - no late payments
✅ Merchant stability - regular purchases from same vendors
✅ Savings patterns - consistent saving transactions

This data proves your financial discipline!`;
      replyTips = language === 'hi'
        ? ['मेरा यूपीआई स्कोर क्या है?', 'स्कोर कैसे सुधारें?']
        : ['What is my UPI score?', 'How to improve score?'];
    } else {
      replyText = language === 'hi'
        ? `बहुत अच्छा प्रश्न! बैंक-विहीन और गिग श्रमिकों के लिए, छोटे नियमित कदम—जैसे मोबाइल बिल 3 दिन पहले भरना और डिजिटल यूपीआई लेनदेन सक्रिय रखना—सीधे आपके वैकल्पिक क्रेडिट स्कोर को बढ़ाते हैं। क्या आप 90-दिवसीय कार्ययोजना देखना चाहेंगे?`
        : `Great question! For unbanked and gig-economy workers, consistent small actions—like paying mobile recharges 3 days early and keeping digital UPI transactions active—provide immediate mathematical boosts to your alternative credit score. Would you like a step-by-step 90-day checklist?`;
      replyTips = language === 'hi'
        ? ['90-दिवसीय कार्ययोजना दिखाएं', 'मुझे कितनी ऋण राशि सिमुलेट करनी चाहिए?']
        : ['Show 90-day checklist', 'What loan amount should I simulate?'];
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      tips: replyTips
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0B1120] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{t.advisor.title}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.advisor.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>

            {/* Quick action suggestion chips from AI */}
            {msg.tips && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.tips.map((tip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(tip)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition"
                  >
                    💡 {tip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs p-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1">{t.advisor.thinking}</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            id="ai-advisor-input"
            name="ai-advisor-input"
            placeholder={t.advisor.placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
