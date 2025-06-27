'use client';
import { useState, useEffect } from "react";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// TODO: Import shadcn/ui Input, Label, Textarea, Tooltip, Accordion when modularizing

// List of 12 European translations of the Amazon slogan
const slogans = [
  { lang: "English", text: "Work Hard, have fun, make history." },
  { lang: "French", text: "Travaillez dur, amusez-vous, faites l'histoire." },
  { lang: "German", text: "Arbeite hart, habe Spaß, schreibe Geschichte." },
  { lang: "Spanish", text: "Trabaja duro, diviértete, haz historia." },
  { lang: "Italian", text: "Lavora sodo, divertiti, fai la storia." },
  { lang: "Dutch", text: "Werk hard, heb plezier, maak geschiedenis." },
  { lang: "Portuguese", text: "Trabalhe duro, divirta-se, faça história." },
  { lang: "Swedish", text: "Arbeta hårt, ha kul, skapa historia." },
  { lang: "Danish", text: "Arbejd hårdt, hav det sjovt, skriv historie." },
  { lang: "Polish", text: "Pracuj ciężko, baw się dobrze, twórz historię." },
  { lang: "Finnish", text: "Tee kovasti töitä, pidä hauskaa, tee historiaa." },
  { lang: "Greek", text: "Δούλεψε σκληρά, διασκέδασε, γράψε ιστορία." },
];

// List of 12 locales for translation
const locales = [
  { code: "gb", label: "United Kingdom" },
  { code: "de", label: "Germany" },
  { code: "es", label: "Spain" },
  { code: "nl", label: "Netherlands" },
  { code: "da", label: "Denmark" },
  { code: "fi", label: "Finland" },
  { code: "fr", label: "France" },
  { code: "it", label: "Italy" },
  { code: "sv", label: "Sweden" },
  { code: "be", label: "Belgium" },
  { code: "no", label: "Norway" },
  { code: "pl", label: "Poland" },
];

export default function Home() {
  // State for landing/started
  const [sloganIdx, setSloganIdx] = useState(0);
  const [started, setStarted] = useState(false);

  // State for translation UI
  const [input, setInput] = useState("");
  const [selectedLocales, setSelectedLocales] = useState(locales.map(l => l.code));
  // State for two rule files
  const [languageRule, setLanguageRule] = useState<{ name: string } | null>({ name: "Language rules.pdf" });
  const [brandRule, setBrandRule] = useState<{ name: string } | null>({ name: "Brand guidelines.pdf" });

  // State for right panel
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingMessages = [
    "Applying rules…",
    "Checking brand guidelines…",
    "Working hard…"
  ];
  // Store translation results
  type TranslationResult = { locale: string; suggestion: string; translation: string };
  const [results, setResults] = useState<TranslationResult[]>([]);

  // Cycle through slogans every 2 seconds
  useEffect(() => {
    if (!started) {
      const interval = setInterval(() => {
        setSloganIdx((idx) => (idx + 1) % slogans.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [started]);

  // Handle locale checkbox toggle
  function handleLocaleToggle(code: string) {
    setSelectedLocales((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  // Handle file upload for each rule
  function handleLanguageRuleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLanguageRule({ name: files[0].name });
    e.target.value = '';
  }
  function handleBrandRuleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setBrandRule({ name: files[0].name });
    e.target.value = '';
  }

  // Handle Translate click
  function handleTranslate() {
    setShowResults(false);
    setLoading(true);
    setResults([]);
    setLoadingMsgIdx(0);
    // Cycle loading messages
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsgIdx(msgIdx);
    }, 900);
    // After 2.7s, show results
    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      setShowResults(true);
      // Mock results for Black Friday Week
      if (input.trim().toLowerCase() === "black friday week".toLowerCase()) {
        setResults(
          locales.filter(loc => selectedLocales.includes(loc.code)).map((loc) => {
            console.log('DEBUG:', loc.code, loc.label);
            console.log('DEBUG', loc.code, input.trim());
            if (loc.code === "fr") {
              return {
                locale: "France",
                suggestion: "While 'Black Friday' itself is commonly used in France without translation (as per the rules), the full phrase 'Black Friday Week' should be translated to 'Semaine du Black Friday' to better resonate with French customers and follow Amazon France's typical marketing approach.",
                translation: "Semaine du Black Friday"
              };
            } else if (loc.code === "sv") {
              return {
                locale: "Sweden",
                suggestion: "Can be reused as-is. The term 'Black Friday Week' is widely recognized and used in Sweden without translation. Sweden has adopted the American shopping tradition and uses the English terminology. There are no cultural sensitivities or legal restrictions regarding this term in Sweden. There are no cultural sensitivities or legal restrictions regarding this term in Swede.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "es") {
              return {
                locale: "Spain",
                suggestion: "According to the provided rules, 'Black Friday Week' should be translated to 'Semana de Black Friday' in Spanish. This adaptation follows the predefined translation guidelines while maintaining brand consistency.",
                translation: "Semana de Black Friday"
              };
            } else if (loc.code === "gb") {
              return {
                locale: "United Kingdom",
                suggestion: "The term 'Black Friday Week' is widely recognized and used in the United Kingdom without translation. UK customers are familiar with the American shopping tradition, and the English terminology aligns with local marketing practices.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "de") {
              return {
                locale: "Germany",
                suggestion: "In Germany, 'Black Friday Week' is commonly used in English for marketing purposes. However, to enhance local relevance, it can also be translated as 'Black Friday Woche'. Both forms are acceptable, but the English version is more prevalent in digital campaigns.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "nl") {
              return {
                locale: "Netherlands",
                suggestion: "Dutch consumers are accustomed to the English term 'Black Friday Week', which is frequently used in retail promotions. No translation is necessary, as the English phrase is well understood and accepted.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "da") {
              return {
                locale: "Denmark",
                suggestion: "The English term 'Black Friday Week' is widely adopted in Denmark, especially in online and retail marketing. Danish customers are familiar with the phrase, and no translation is required for effective communication.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "fi") {
              return {
                locale: "Finland",
                suggestion: "In Finland, 'Black Friday Week' is used in its original English form in most marketing materials. Finnish consumers recognize and respond well to the English phrase, so no translation is needed.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "it") {
              return {
                locale: "Italy",
                suggestion: "While the English term 'Black Friday Week' is increasingly used in Italy, a localized version such as 'Settimana del Black Friday' can also be effective. However, the English phrase is generally preferred for brand consistency.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "be") {
              return {
                locale: "Belgium",
                suggestion: "Belgian consumers, both French and Dutch-speaking, are familiar with the English term 'Black Friday Week'. It is commonly used in marketing and does not require translation for either language group.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "no") {
              return {
                locale: "Norway",
                suggestion: "In Norway, 'Black Friday Week' is widely recognized and used in its English form. Norwegian customers are accustomed to the term, and it aligns with local marketing strategies.",
                translation: "Black Friday Week"
              };
            } else if (loc.code === "pl") {
              return {
                locale: "Poland",
                suggestion: "The English term 'Black Friday Week' is increasingly used in Poland, especially in online advertising. For broader appeal, it can be translated as 'Tydzień Black Friday', but the English version is also well understood.",
                translation: "Black Friday Week"
              };
            } else {
              return {
                locale: loc.label,
                suggestion: `No special adaptation needed. Use the English term or a direct translation as appropriate for ${loc.label}.`,
                translation: "Black Friday Week"
              };
            }
          })
        );
      } else {
        // Generic mock for other input
        setResults(
          locales.filter(loc => selectedLocales.includes(loc.code)).map((loc) => ({
            locale: loc.label,
            suggestion: `No special adaptation needed. Use the English term or a direct translation as appropriate for ${loc.label}.`,
            translation: input || "—"
          }))
        );
      }
    }, 2700);
  }

  // Render blank state landing page
  if (!started) {
    const valueProp = "Instantly generate high-quality, brand-safe translations for your campaigns.";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-center transition-all duration-500">
          {slogans[sloganIdx].text}
        </h1>
        <div className="text-muted-foreground text-center text-base sm:text-lg">
          {valueProp}
        </div>
        <Button size="lg" className="mt-4" onClick={() => setStarted(true)}>
          Start
        </Button>
        <div className="text-xs text-muted-foreground mt-8">({slogans[sloganIdx].lang})</div>
      </div>
    );
  }

  // Main two-column layout
  return (
    <div className="min-h-screen flex flex-row bg-background">
      {/* Left column: Message panel */}
      <aside className="w-full max-w-xs border-r bg-white min-h-screen flex flex-col p-6 gap-8">
        {/* Heading and Translate button */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Message</h2>
          <Button size="sm" onClick={handleTranslate}>Translate</Button>
        </div>

        {/* Input section */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Enter text</label>
          <Textarea
            className="w-full min-h-[64px]"
            placeholder="e.g. Black Friday Week"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {/* Locales selection */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Target locales</label>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {locales.map((loc) => (
              <label key={loc.code} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <Checkbox
                  checked={selectedLocales.includes(loc.code)}
                  onCheckedChange={() => handleLocaleToggle(loc.code)}
                  id={`locale-${loc.code}`}
                />
                {loc.label}
              </label>
            ))}
          </div>
        </div>

        {/* Rules section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rules</label>
          {/* Language rules upload */}
          <div className="flex flex-col gap-4">
          <div>
            <Input
              type="file"
              className="text-sm mb-1"
              onChange={handleLanguageRuleFile}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{languageRule?.name}</span>
            </div>
          </div>
          {/* Brand guidelines upload */}
          <div>
            <Input
              type="file"
              className="text-sm mb-1"
              onChange={handleBrandRuleFile}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{brandRule?.name}</span>
            </div>
          </div>
          </div>
        </div>
      </aside>

      {/* Right column: Translations panel */}
      <main className="flex-1 p-10">
        {/* Show loading state or results after Translate is clicked */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="animate-pulse text-lg font-medium mb-4">{loadingMessages[loadingMsgIdx]}</div>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          </div>
        )}
        {showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Translations</h2>
            <div className="grid grid-cols-1 gap-4">
              {results.map((res) => (
                <Card key={res.locale} className="shadow-xs">
                  <CardContent className="">
                    <div className="font-semibold mb-2 text-base">{res.locale}</div>
                    <div className="mb-3 text-sm text-muted-foreground">{res.suggestion}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-muted px-2 py-1 rounded text-xs">Suggested translation</span>
                      <span className="font-medium text-sm">{res.translation}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
