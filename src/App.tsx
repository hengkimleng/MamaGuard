/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Stethoscope, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw,
  Sparkles,
  Baby,
  AlertTriangle,
  Info,
  Send,
  Languages
} from "lucide-react";
import { RiskLevel, PatientData, AssessmentResult, SYMPTOMS_A, SYMPTOMS_B } from "./types";
import { calculateRisk } from "./lib/assessmentLogic";
import { parsePatientDescription } from "./services/geminiService";
import { RiskCard } from "./components/RiskCard";
import { Language, translations, symptomTranslations } from "./constants/translations";

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const st = symptomTranslations[lang];

  const [description, setDescription] = useState("");
  const [data, setData] = useState<PatientData>({
    gestationalWeeks: undefined,
    isFirstPregnancy: false,
    historyOfComplications: false,
    age: undefined,
    symptoms: new Set(),
    gutConcern: false
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"description" | "form">("description");

  const symptomsWithLablesA = useMemo(() => (SYMPTOMS_A || []).map(s => ({ ...s, label: (st as any)?.[s.id] || s.label })), [st]);
  const symptomsWithLablesB = useMemo(() => (SYMPTOMS_B || []).map(s => ({ ...s, label: (st as any)?.[s.id] || s.label })), [st]);

  const handleAssessment = useCallback(() => {
    const res = calculateRisk(data);
    setResult(res);
  }, [data]);

  const toggleSymptom = (id: string) => {
    setData(prev => {
      const next = new Set(prev.symptoms);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, symptoms: next };
    });
  };

  const handleAIScan = async () => {
    if (!description.trim()) return;
    setLoading(true);
    const parsed = await parsePatientDescription(description);
    if (parsed) {
      const newData = {
        gestationalWeeks: parsed.gestationalWeeks || undefined,
        age: parsed.age || undefined,
        isFirstPregnancy: parsed.isFirstPregnancy ?? false,
        historyOfComplications: parsed.historyOfComplications ?? false,
        symptoms: new Set(parsed.detectedSymptoms),
        gutConcern: parsed.gutConcern ?? false
      };
      setData(newData);
      const res = calculateRisk(newData);
      setResult(res);
    }
    setLoading(false);
  };

  const reset = () => {
    setData({
      gestationalWeeks: undefined,
      isFirstPregnancy: false,
      historyOfComplications: false,
      age: undefined,
      symptoms: new Set(),
      gutConcern: false
    });
    setResult(null);
    setDescription("");
    setMode("description");
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-serif pb-24">
      {/* Editorial Header */}
      <header className="max-w-5xl mx-auto px-6 py-10 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline border-b-2 border-ink pb-8 gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-black opacity-60 mb-2">{t.appSubtitle}</span>
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter">{t.appName}</h1>
              <div className="hidden md:block w-px h-12 bg-ink/20 transform rotate-12"></div>
              <p className="hidden md:block text-xs font-sans font-bold uppercase tracking-widest opacity-40 max-w-[12rem] leading-tight">
                {t.appDescription}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-ink/5 p-1 rounded-sm gap-1">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest transition-all ${lang === 'en' ? 'bg-ink text-paper' : 'text-ink/40'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('km')}
                className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest transition-all ${lang === 'km' ? 'bg-ink text-paper' : 'text-ink/40'}`}
              >
                ខ្មែរ
              </button>
            </div>
            <div className="text-right font-sans">
              <div className="text-2xl font-black tracking-tighter">{data.gestationalWeeks ? `${data.gestationalWeeks} ${t.weeks}` : `-- ${t.weeks}`}</div>
              <div className="text-[10px] uppercase font-black tracking-widest opacity-50">{t.gestationPeriod}</div>
            </div>
            <button 
              onClick={reset}
              className="p-3 bg-ink text-paper rounded-sm hover:scale-105 transition-transform shadow-lg"
              title={t.newAssessment}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-12 gap-8 md:gap-12"
            >
              {/* Left Column: Input Modes */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                {/* Mode Selector */}
                <div className="inline-flex border-b border-ink/10 pb-4 gap-8">
                  <button 
                    onClick={() => setMode("description")}
                    className={`text-xs uppercase tracking-widest font-sans font-black transition-all pb-2 relative ${mode === "description" ? "opacity-100" : "opacity-30 hover:opacity-50"}`}
                  >
                    {t.narrativeInput}
                    {mode === "description" && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
                  </button>
                  <button 
                    onClick={() => setMode("form")}
                    className={`text-xs uppercase tracking-widest font-sans font-black transition-all pb-2 relative ${mode === "form" ? "opacity-100" : "opacity-30 hover:opacity-50"}`}
                  >
                    {t.clinicalForm}
                    {mode === "form" && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
                  </button>
                </div>

                {mode === "description" ? (
                  <div className="space-y-6">
                    <div className="bg-ink text-paper p-8 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <h2 className="text-xs uppercase tracking-[0.3em] mb-6 opacity-60 font-sans font-bold">{t.patientDescription}</h2>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.placeholderDescription}
                        className="w-full h-48 bg-transparent text-2xl md:text-3xl font-bold tracking-tight outline-none resize-none placeholder:opacity-20 placeholder:italic leading-tight"
                      />
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-sans font-black tracking-widest opacity-40 uppercase">
                          <Sparkles size={12} className="text-amber-400" /> {t.aiActive}
                        </div>
                        <button 
                          onClick={handleAIScan}
                          disabled={loading || !description.trim()}
                          className="bg-paper text-ink px-8 py-3 font-sans font-black uppercase text-xs tracking-widest shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-30"
                        >
                          {loading ? t.analyzing : t.triageCase}
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-oxblood pl-6 py-2">
                      <h3 className="font-sans text-[10px] uppercase font-black mb-2 tracking-widest opacity-60">{t.systemInstruction}</h3>
                      <p className="text-lg leading-relaxed italic font-medium opacity-80 decoration-oxblood/30 underline decoration-2 underline-offset-4">
                        "{t.instructionText}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 md:p-10 border border-ink/10 shadow-sm space-y-10">
                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50 block">{t.maternalAge}</label>
                        <input 
                          type="number"
                          value={data.age || ""}
                          onChange={(e) => setData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                          className="w-full text-5xl font-black tracking-tighter border-b-2 border-slate-100 focus:border-ink outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50 block">{t.gestationWks}</label>
                        <input 
                          type="number"
                          value={data.gestationalWeeks || ""}
                          onChange={(e) => setData(prev => ({ ...prev, gestationalWeeks: parseInt(e.target.value) || undefined }))}
                          className="w-full text-5xl font-black tracking-tighter border-b-2 border-slate-100 focus:border-ink outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setData(prev => ({ ...prev, isFirstPregnancy: !prev.isFirstPregnancy }))}
                        className={`flex-1 p-6 border-2 font-sans font-black uppercase text-xs tracking-widest transition-all ${data.isFirstPregnancy ? "bg-ink text-paper border-ink" : "bg-white border-slate-100 text-slate-400"}`}
                      >
                        {t.primigravida}
                      </button>
                      <button 
                        onClick={() => setData(prev => ({ ...prev, historyOfComplications: !prev.historyOfComplications }))}
                        className={`flex-1 p-6 border-2 font-sans font-black uppercase text-xs tracking-widest transition-all ${data.historyOfComplications ? "bg-oxblood text-white border-oxblood" : "bg-white border-slate-100 text-slate-400"}`}
                      >
                        {t.prevComplications}
                      </button>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-baseline justify-between border-b-2 border-oxblood pb-2">
                        <h3 className="font-sans font-black uppercase text-[10px] tracking-[0.3em] text-oxblood">{t.groupATitle}</h3>
                        <span className="font-sans font-black text-[8px] uppercase tracking-widest opacity-40">{t.referralRequired}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {symptomsWithLablesA.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`flex justify-between items-center pb-2 border-b border-ink/5 group transition-colors ${data.symptoms.has(s.id) ? "text-oxblood" : "text-slate-400 hover:text-ink"}`}
                          >
                            <span className={`text-sm font-bold uppercase tracking-tight ${data.symptoms.has(s.id) ? "translate-x-2" : ""} transition-transform`}>{s.label}</span>
                            <div className={`w-2 h-2 rounded-full ${data.symptoms.has(s.id) ? "bg-oxblood animate-pulse" : "bg-slate-200"}`}></div>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-baseline justify-between border-b-2 border-amber-600 pb-2 mt-12">
                        <h3 className="font-sans font-black uppercase text-[10px] tracking-[0.3em] text-amber-600">{t.groupBTitle}</h3>
                        <span className="font-sans font-black text-[8px] uppercase tracking-widest opacity-40">{t.observationProtocol}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {symptomsWithLablesB.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`flex justify-between items-center pb-2 border-b border-ink/5 group transition-colors ${data.symptoms.has(s.id) ? "text-amber-600" : "text-slate-400 hover:text-ink"}`}
                          >
                            <span className={`text-sm font-bold uppercase tracking-tight ${data.symptoms.has(s.id) ? "translate-x-2" : ""} transition-transform`}>{s.label}</span>
                            <div className={`w-2 h-2 rounded-full ${data.symptoms.has(s.id) ? "bg-amber-600" : "bg-slate-200"}`}></div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={() => setData(prev => ({ ...prev, gutConcern: !prev.gutConcern }))}
                        className={`w-full flex items-center justify-center gap-3 p-6 border-2 font-sans font-black uppercase text-[10px] tracking-widest transition-all ${data.gutConcern ? "bg-ink border-ink text-paper shadow-xl" : "bg-paper border-ink/10 text-ink/40 hover:bg-white"}`}
                      >
                        <AlertTriangle size={20} />
                        {t.gutConcern}
                      </button>
                    </div>

                    <button 
                      onClick={handleAssessment}
                      className="w-full bg-ink text-paper font-sans font-black py-8 uppercase tracking-[0.5em] text-sm shadow-2xl hover:shadow-none hover:bg-oxblood transition-all"
                    >
                      {t.processAssessment}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Context/Guides (Sidebar Pattern) */}
              <div className="hidden lg:col-span-4 lg:flex flex-col gap-6">
                <div className="border-2 border-ink p-8 flex flex-col h-full bg-white/40">
                  <h3 className="font-sans text-[10px] uppercase font-black mb-8 tracking-widest opacity-60">{t.clinicalGuidelines}</h3>
                  
                  <div className="mb-10">
                    <div className="text-[8px] font-sans uppercase font-black opacity-40 mb-2 tracking-widest">{t.hypertensiveScreen}</div>
                    <div className="text-4xl font-black tracking-tighter text-oxblood">140/90</div>
                    <div className="text-[10px] italic font-serif leading-tight mt-1 opacity-60">{t.thresholdText}</div>
                  </div>

                  <div className="mb-10">
                    <div className="text-[8px] font-sans uppercase font-black opacity-40 mb-2 tracking-widest">{t.fetalVitality}</div>
                    <div className="text-4xl font-black tracking-tighter leading-none italic">10/12h</div>
                    <div className="h-1 bg-ink/10 mt-3 relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        className="h-full bg-ink"
                      />
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-ink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="text-oxblood" size={20} />
                      <span className="font-sans font-black text-[10px] uppercase tracking-widest">{t.redFlagProtocol}</span>
                    </div>
                    <p className="text-sm italic leading-relaxed opacity-70">
                      {t.redFlagText}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12 pb-32">
              <button 
                onClick={() => setResult(null)}
                className="flex items-center gap-3 text-ink font-black uppercase text-[10px] tracking-[0.3em] hover:translate-x-[-8px] transition-transform"
              >
                <ChevronLeft size={16} /> {t.backToEntry}
              </button>
              
              <RiskCard result={result} lang={lang} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Editorial Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 pointer-events-none">
        <div className="max-w-5xl mx-auto flex justify-between items-center border-t border-ink/20 pt-4 font-sans text-[8px] uppercase tracking-[0.4em] opacity-40 mix-blend-multiply">
          <div className="pointer-events-auto lowercase tracking-widest">id: assessment-{new Date().getTime().toString().slice(-8)} // {t.triageActive}</div>
          <div className="pointer-events-auto">{t.whoAligned}</div>
        </div>
      </footer>
    </div>
  );
}
