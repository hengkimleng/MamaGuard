/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RiskLevel {
  HIGH = "HIGH",
  MONITOR = "MONITOR",
  ROUTINE = "ROUTINE",
}

export interface PatientData {
  gestationalWeeks?: number;
  isFirstPregnancy?: boolean;
  historyOfComplications?: boolean;
  age?: number;
  symptoms: Set<string>;
  gutConcern?: boolean;
}

export interface AssessmentResult {
  riskLevel: RiskLevel;
  meaningKey: string;
  actionKeys: string[];
  patientMessageKey: string;
  warningSignsKeys?: string[];
  // Keep original for back-compat or debugging if needed, but we'll primary use keys
  meaning?: string;
  actions?: string[];
  patientMessage?: string;
  warningSigns?: string[];
}

export const SYMPTOMS_A = [
  { id: 'heavy_bleeding', label: 'Heavy vaginal bleeding' },
  { id: 'severe_headache', label: 'Severe headache that won\'t go away' },
  { id: 'blurred_vision', label: 'Blurred or changed vision' },
  { id: 'fits_convulsions', label: 'Fits or convulsions (seizures)' },
  { id: 'difficulty_breathing', label: 'Difficulty breathing' },
  { id: 'high_fever', label: 'High fever (feels very hot, over 38°C)' },
  { id: 'severe_abdominal_pain', label: 'Severe abdominal pain' },
  { id: 'no_fetal_movement', label: 'No fetal movement for 12+ hours (after 28 weeks)' },
  { id: 'fluid_leaking', label: 'Fluid leaking from vagina before labor' },
];

export const SYMPTOMS_B = [
  { id: 'mild_headache', label: 'Mild headache' },
  { id: 'swollen_parts', label: 'Swollen hands, face, or feet' },
  { id: 'weak_dizzy', label: 'Feeling very weak or dizzy' },
  { id: 'reduced_movement', label: 'Reduced fetal movement (not absent)' },
  { id: 'burning_urine', label: 'Burning when urinating' },
  { id: 'vomiting', label: 'Vomiting that prevents eating/drinking' },
  { id: 'pale_eyelids', label: 'Pale inner eyelids or palms (anemia)' },
];
