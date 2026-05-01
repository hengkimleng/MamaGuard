/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { AlertCircle, Phone } from "lucide-react";
import { RiskLevel, AssessmentResult } from "../types";
import { translations, logicTranslations, riskLevelTranslations, Language } from "../constants/translations";

interface RiskCardProps {
  result: AssessmentResult;
  lang: Language;
}

export function RiskCard({ result, lang }: RiskCardProps) {
  const isHigh = result.riskLevel === RiskLevel.HIGH;
  const isMonitor = result.riskLevel === RiskLevel.MONITOR;
  
  const statusColor = isHigh ? "bg-oxblood text-white" : isMonitor ? "bg-amber-600 text-white" : "bg-emerald-700 text-white";
  const textColor = isHigh ? "text-oxblood" : isMonitor ? "text-amber-800" : "text-emerald-900";
  const borderColor = isHigh ? "border-oxblood" : isMonitor ? "border-amber-600" : "border-emerald-700";

  const t = translations[lang];
  const lt = logicTranslations[lang];
  const rt = riskLevelTranslations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10"
    >
      {/* Risk Banner */}
      <div className={`p-10 md:p-14 ${statusColor} rounded-sm shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-12 bg-white/40"></div>
            <span className="text-xs uppercase tracking-[0.5em] font-sans font-black opacity-80">{t.riskResult}</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-6">
            {(rt as any)?.[result.riskLevel] || result.riskLevel}
          </h2>
          <p className="text-xl md:text-2xl font-medium tracking-tight max-w-2xl leading-snug opacity-90">
            {(lt as any)?.[result.meaningKey] || result.meaningKey}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 md:gap-12">
        {/* Actions Section */}
        <div className="col-span-12 md:col-span-8 space-y-10">
          <section>
            <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-8 text-ink">
              <h3 className="font-sans font-black uppercase text-[10px] tracking-[0.3em]">{t.immediateActions}</h3>
              <span className="font-sans font-black text-[8px] uppercase tracking-widest opacity-40 italic">{t.responseProtocol}</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(result.actionKeys || []).map((key, i) => (
                <div key={i} className="group flex gap-6 items-start p-6 bg-white border border-ink/5 hover:border-ink/20 transition-all shadow-sm">
                  <span className="text-4xl font-black italic text-ink/10 group-hover:text-ink/20 transition-colors leading-none">{i + 1}</span>
                  <p className="text-lg font-bold leading-tight pt-1 text-ink group-hover:text-ink transition-colors">{(lt as any)?.[key] || key}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-8 text-ink">
              <h3 className="font-sans font-black uppercase text-[10px] tracking-[0.3em]">{t.patientCommGuide}</h3>
              <span className="font-sans font-black text-[8px] uppercase tracking-widest opacity-40">{t.verbalInstruction}</span>
            </div>
            <div className="bg-ink text-paper p-10 rounded-sm relative shadow-xl">
              <div className="text-6xl font-serif text-white/5 absolute top-4 left-4 leading-none">“</div>
              <p className="text-2xl md:text-3xl font-bold italic tracking-tight leading-snug relative z-10 px-4">
                {(lt as any)?.[result.patientMessageKey] || result.patientMessageKey}
              </p>
              <div className="text-6xl font-serif text-white/5 absolute bottom-4 right-4 leading-none rotate-180">“</div>
            </div>
          </section>
        </div>

        {/* Warning Signs Sidebar */}
        <div className="col-span-12 md:col-span-4 space-y-8">
          {result.warningSignsKeys && (
            <div className={`border-2 ${borderColor} p-8 bg-white shadow-lg`}>
              <h3 className={`font-sans font-black uppercase text-[10px] tracking-[0.3em] mb-8 ${textColor}`}>{t.warningSignsTitle}</h3>
              <ul className="space-y-6">
                {(result.warningSignsKeys || []).map((key, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isHigh ? 'bg-oxblood' : 'bg-amber-600'}`}></div>
                  <span className={`text-sm font-bold uppercase tracking-tight leading-tight group-hover:underline decoration-2 underline-offset-4 ${textColor}`}>{(lt as any)?.[key] || key}</span>
                </li>
                ))}
              </ul>
            </div>
          )}

          {isHigh && (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-oxblood text-white p-8 flex flex-col gap-6 shadow-[10px_10px_0px_rgba(194,62,45,0.2)]"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={24} />
                <span className="font-sans font-black uppercase text-xs tracking-widest">{t.immediateReferral}</span>
              </div>
              <h4 className="text-4xl font-black italic tracking-tighter leading-none">{t.doNotWait}</h4>
              <p className="font-sans text-[10px] uppercase font-black tracking-widest opacity-80 decoration-white/30 underline underline-offset-4">{t.transportProtocol}</p>
              <button className="bg-white text-oxblood font-sans font-black py-4 uppercase text-xs tracking-[0.2em] hover:bg-paper transition-colors shadow-lg">
                {t.activateTransport}
              </button>
            </motion.div>
          )}

          <div className="p-8 border border-ink/10 opacity-60">
             <h4 className="font-sans font-black uppercase text-[8px] tracking-[0.3em] mb-4 text-ink">{t.evidenceRef}</h4>
             <p className="text-xs leading-relaxed italic text-ink">
               {isHigh ? "Critical symptom detection in Phase 1." : isMonitor ? "Sub-critical indicators necessitating follow-up." : "Routine monitoring baseline."}
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
