/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskLevel, PatientData, AssessmentResult, SYMPTOMS_A, SYMPTOMS_B } from '../types';

export function calculateRisk(data: PatientData): AssessmentResult {
  const hasGroupA = SYMPTOMS_A.some(s => data.symptoms.has(s.id));
  const hasGroupB = SYMPTOMS_B.some(s => data.symptoms.has(s.id));
  
  // Rule: No fetal movement 12h+ after 28w
  const isNoFetalMovementHighRisk = data.symptoms.has('no_fetal_movement') && (data.gestationalWeeks || 0) >= 28;

  // Rule: Pre-eclampsia history + Group B
  const isHistoryAndB = data.historyOfComplications && hasGroupB;

  // Rule: Under 16 or Over 40 + Group B
  const isAgeRiskAndB = data.age && (data.age < 16 || data.age > 40) && hasGroupB;

  if (hasGroupA || isNoFetalMovementHighRisk || isHistoryAndB || isAgeRiskAndB) {
    return {
      riskLevel: RiskLevel.HIGH,
      meaningKey: 'meaning_high',
      actionKeys: ['action_high_1', 'action_high_2', 'action_high_3', 'action_high_4'],
      patientMessageKey: 'message_high',
    };
  }

  if (hasGroupB || data.historyOfComplications || data.gutConcern) {
    return {
      riskLevel: RiskLevel.MONITOR,
      meaningKey: 'meaning_monitor',
      actionKeys: ['action_monitor_1', 'action_monitor_2', 'action_monitor_3', 'action_monitor_4'],
      patientMessageKey: 'message_monitor',
      warningSignsKeys: ['warning_monitor_1', 'warning_monitor_2', 'warning_monitor_3']
    };
  }

  return {
    riskLevel: RiskLevel.ROUTINE,
    meaningKey: 'meaning_routine',
    actionKeys: ['action_routine_1', 'action_routine_2', 'action_routine_3', 'action_routine_4'],
    patientMessageKey: 'message_routine',
  };
}
