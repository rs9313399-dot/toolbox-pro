'use client';

import { useState } from 'react';
import { Calendar, Clock, Heart, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToolLayout from '@/components/ToolLayout';

/* ─── FAQ Items ─── */
const faqItems = [
  {
    question: 'How does the Age Calculator determine my exact age?',
    answer:
      'The Age Calculator computes the precise difference between your date of birth and today\'s date, accounting for varying month lengths and leap years. It breaks down the result into years, months, and days for maximum accuracy.',
  },
  {
    question: 'Is my date of birth stored or sent to a server?',
    answer:
      'No. All calculations happen entirely in your browser using JavaScript. Your date of birth is never sent to any server, stored in any database, or shared with any third party. Your privacy is fully protected.',
  },
  {
    question: 'How are the heartbeat and breathing estimates calculated?',
    answer:
      'The average resting heart rate is approximately 72 beats per minute, and the average breathing rate is about 16 breaths per minute. We multiply these averages by the total number of minutes you have lived to produce the estimates. Individual rates vary, so these are approximations.',
  },
  {
    question: 'How does the next birthday countdown work?',
    answer:
      'The calculator finds your next upcoming birthday. If your birthday has already passed this year, it counts down to your birthday next year. The result shows the exact number of days remaining.',
  },
  {
    question: 'Does the calculator account for leap years?',
    answer:
      'Yes. The calculation properly handles leap years when computing total days and all derived values (hours, minutes, etc.). February 29th birthdays are also handled correctly.',
  },
];

/* ─── Related Tools ─── */
const relatedTools = [
  {
    name: 'Word Counter',
    hash: '#/tools/word-counter',
    description: 'Count words, characters, and more in your text.',
  },
  {
    name: 'Password Generator',
    hash: '#/tools/password-generator',
    description: 'Generate strong, secure passwords instantly.',
  },
  {
    name: 'QR Code Generator',
    hash: '#/tools/qr-code-generator',
    description: 'Create custom QR codes for URLs and more.',
  },
];

/* ─── Types ─── */
interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthdayDays: number;
  nextBirthdayAge: number;
  dayOfBirth: string;
  zodiacSign: string;
}

/* ─── Calculation Helpers ─── */
const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ZODIAC_SIGNS: { sign: string; start: [number, number]; end: [number, number] }[] = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

function getZodiacSign(month: number, day: number): string {
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm > em) {
      // Capricorn wraps around year
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
      if (month > sm && month < em) return z.sign;
    }
  }
  return 'Capricorn';
}

function calculateAge(dob: Date): AgeResult {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birth = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());

  // Years, months, days breakdown
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total calculations
  const diffMs = today.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Day of birth
  const dayOfBirth = DAYS_OF_WEEK[dob.getDay()];

  // Next birthday
  let nextBirthdayYear = today.getFullYear();
  let nextBirthday = new Date(nextBirthdayYear, dob.getMonth(), dob.getDate());

  // Handle Feb 29 for non-leap years
  if (dob.getMonth() === 1 && dob.getDate() === 29) {
    if (!isLeapYear(nextBirthdayYear)) {
      nextBirthday = new Date(nextBirthdayYear, 1, 28);
    }
  }

  if (nextBirthday.getTime() <= today.getTime()) {
    nextBirthdayYear += 1;
    if (dob.getMonth() === 1 && dob.getDate() === 29) {
      if (!isLeapYear(nextBirthdayYear)) {
        nextBirthday = new Date(nextBirthdayYear, 1, 28);
      } else {
        nextBirthday = new Date(nextBirthdayYear, 1, 29);
      }
    } else {
      nextBirthday = new Date(nextBirthdayYear, dob.getMonth(), dob.getDate());
    }
  }

  const nextBirthdayDays = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const nextBirthdayAge = nextBirthdayYear - dob.getFullYear();

  // Zodiac
  const zodiacSign = getZodiacSign(dob.getMonth() + 1, dob.getDate());

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    nextBirthdayDays,
    nextBirthdayAge,
    dayOfBirth,
    zodiacSign,
  };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/* ─── Stat Card Sub-component ─── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  accent?: 'cyan' | 'purple';
}

function StatCard({ icon, label, value, sublabel, accent = 'purple' }: StatCardProps) {
  const accentClasses =
    accent === 'cyan'
      ? 'text-[#00FFFF] bg-[#00FFFF]/10 border-[#00FFFF]/20'
      : 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/20';

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#8A2BE2]/30 transition-all duration-300">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border mb-3 ${accentClasses}`}>
        {icon}
      </div>
      <span className="text-xl sm:text-2xl font-black text-white mb-1">{value}</span>
      <span className="text-xs text-[#AAAAAA] text-center">{label}</span>
      {sublabel && (
        <span className="text-[10px] text-[#555555] mt-0.5">{sublabel}</span>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
interface AgeCalculatorProps {
  onNavigate: (hash: string) => void;
}

export default function AgeCalculator({ onNavigate }: AgeCalculatorProps) {
  const [dob, setDob] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!dob) {
      setError('Please select your date of birth.');
      return;
    }

    const birthDate = new Date(dob + 'T00:00:00');
    const now = new Date();

    if (birthDate > now) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    // Sanity check: limit to reasonable age
    const ageMs = now.getTime() - birthDate.getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    if (ageYears > 150) {
      setError('Please enter a valid date of birth.');
      return;
    }

    const ageResult = calculateAge(birthDate);
    setResult(ageResult);
  };

  const handleReset = () => {
    setDob('');
    setResult(null);
    setError('');
  };

  // Fun fact estimates
  const heartbeats = result ? result.totalMinutes * 72 : 0;
  const breaths = result ? result.totalMinutes * 16 : 0;
  const sleepHours = result ? Math.floor(result.totalHours * 0.33) : 0;
  const mealsEaten = result ? Math.floor(result.totalDays * 3) : 0;

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, days, hours, and more"
      icon={Calendar}
      faqItems={faqItems}
      relatedTools={relatedTools}
      onNavigate={onNavigate}
    >
      <div className="space-y-8">
        {/* ── Input Section ── */}
        <div>
          <label
            htmlFor="dob-input"
            className="block text-sm font-medium text-white mb-3"
          >
            Date of Birth
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#555555] pointer-events-none" />
              <input
                id="dob-input"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setError('');
                }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-black/40 border border-[#222222] text-white text-sm focus:outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2]/50 transition-all duration-300 [color-scheme:dark]"
                aria-label="Select your date of birth"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                className="h-12 px-6 text-sm font-semibold cta-primary flex-shrink-0"
              >
                Calculate Age
              </Button>
              {result && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 px-4 text-sm border-[#222222] text-[#AAAAAA] hover:text-white hover:border-[#8A2BE2]/50 transition-all duration-300 flex-shrink-0"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* ── Results ── */}
        {result && (
          <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
            {/* Primary Age Display */}
            <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-b from-[#8A2BE2]/5 to-transparent border border-[#8A2BE2]/10">
              <p className="text-sm text-[#888888] mb-2">You are</p>
              <div className="flex items-baseline justify-center gap-1 flex-wrap">
                <span className="text-5xl sm:text-6xl font-black gradient-text">
                  {result.years}
                </span>
                <span className="text-lg text-[#AAAAAA] font-medium ml-1">
                  year{result.years !== 1 ? 's' : ''}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-white mx-1">
                  {result.months}
                </span>
                <span className="text-lg text-[#AAAAAA] font-medium ml-1">
                  month{result.months !== 1 ? 's' : ''}
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-white mx-1">
                  {result.days}
                </span>
                <span className="text-lg text-[#AAAAAA] font-medium ml-1">
                  day{result.days !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-[#555555] mt-3">old today</p>
            </div>

            {/* Detailed Stats Grid */}
            <div>
              <h3 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">
                Detailed Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <StatCard
                  icon={<Calendar className="h-5 w-5" />}
                  label="Total Months"
                  value={formatNumber(result.totalMonths)}
                  accent="purple"
                />
                <StatCard
                  icon={<Clock className="h-5 w-5" />}
                  label="Total Weeks"
                  value={formatNumber(result.totalWeeks)}
                  accent="cyan"
                />
                <StatCard
                  icon={<Calendar className="h-5 w-5" />}
                  label="Total Days"
                  value={formatNumber(result.totalDays)}
                  accent="purple"
                />
                <StatCard
                  icon={<Clock className="h-5 w-5" />}
                  label="Total Hours"
                  value={formatNumber(result.totalHours)}
                  accent="cyan"
                />
                <StatCard
                  icon={<Clock className="h-5 w-5" />}
                  label="Total Minutes"
                  value={formatNumber(result.totalMinutes)}
                  accent="purple"
                />
                <StatCard
                  icon={<Cake className="h-5 w-5" />}
                  label="Day of Birth"
                  value={result.dayOfBirth}
                  accent="cyan"
                />
                <StatCard
                  icon={<Calendar className="h-5 w-5" />}
                  label="Zodiac Sign"
                  value={result.zodiacSign}
                  accent="purple"
                />
                <StatCard
                  icon={<Cake className="h-5 w-5" />}
                  label="Next Birthday"
                  value={`${result.nextBirthdayDays} day${result.nextBirthdayDays !== 1 ? 's' : ''}`}
                  sublabel={`Turning ${result.nextBirthdayAge}`}
                  accent="cyan"
                />
              </div>
            </div>

            {/* Fun Facts Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">
                Fun Facts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#8A2BE2]/20 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
                    <Heart className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">
                      You have lived approximately{' '}
                      <span className="text-white font-bold">
                        {formatNumber(heartbeats)}
                      </span>{' '}
                      heartbeats
                    </p>
                    <p className="text-[10px] text-[#555555] mt-1">
                      Based on avg. 72 beats/min
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#00FFFF]/20 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex-shrink-0">
                    <span className="text-lg" aria-hidden="true">💨</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">
                      You have breathed approximately{' '}
                      <span className="text-white font-bold">
                        {formatNumber(breaths)}
                      </span>{' '}
                      times
                    </p>
                    <p className="text-[10px] text-[#555555] mt-1">
                      Based on avg. 16 breaths/min
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#8A2BE2]/20 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 flex-shrink-0">
                    <span className="text-lg" aria-hidden="true">😴</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">
                      You have slept approximately{' '}
                      <span className="text-white font-bold">
                        {formatNumber(sleepHours)}
                      </span>{' '}
                      hours
                    </p>
                    <p className="text-[10px] text-[#555555] mt-1">
                      Based on avg. 8 hours/day
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-black/30 border border-[#1a1a1a] hover:border-[#00FFFF]/20 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                    <span className="text-lg" aria-hidden="true">🍽️</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed">
                      You have eaten approximately{' '}
                      <span className="text-white font-bold">
                        {formatNumber(mealsEaten)}
                      </span>{' '}
                      meals
                    </p>
                    <p className="text-[10px] text-[#555555] mt-1">
                      Based on avg. 3 meals/day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Birthday Highlight */}
            <div className="text-center py-5 px-4 rounded-2xl bg-gradient-to-b from-[#00FFFF]/5 to-transparent border border-[#00FFFF]/10">
              <Cake className="h-8 w-8 text-[#00FFFF] mx-auto mb-2" />
              <p className="text-sm text-[#AAAAAA]">
                Your next birthday is in{' '}
                <span className="text-white font-bold text-lg">
                  {result.nextBirthdayDays}
                </span>{' '}
                day{result.nextBirthdayDays !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-[#555555] mt-1">
                You will be {result.nextBirthdayAge} years old
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
