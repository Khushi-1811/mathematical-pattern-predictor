
import { PredictionResult, SequenceRule, checkArithmeticSequence, checkGeometricSequence, checkFibonacciSequence, checkSquareSequence, getSequenceDifferences } from "./sequenceUtils";

export const predictSequence = (sequence: number[]): PredictionResult => {
  if (sequence.length < 3) {
    return {
      nextElements: [],
      ruleType: 'unknown',
      ruleDescription: 'Need at least 3 numbers to predict a pattern.',
      formula: 'N/A',
      confidence: 0
    };
  }

  // Simple rules detection
  if (checkArithmeticSequence(sequence)) {
    const difference = sequence[1] - sequence[0];
    const nextElements = [
      sequence[sequence.length - 1] + difference,
      sequence[sequence.length - 1] + difference * 2,
      sequence[sequence.length - 1] + difference * 3
    ];
    
    return {
      nextElements,
      ruleType: 'arithmetic',
      ruleDescription: `Arithmetic sequence with common difference d = ${difference}`,
      formula: `a_n = a_1 + (n-1)d = ${sequence[0]} + (n-1) × ${difference}`,
      confidence: 0.95
    };
  }
  
  if (checkGeometricSequence(sequence)) {
    const ratio = sequence[1] / sequence[0];
    const nextElements = [
      sequence[sequence.length - 1] * ratio,
      sequence[sequence.length - 1] * ratio * ratio,
      sequence[sequence.length - 1] * ratio * ratio * ratio
    ];
    
    return {
      nextElements,
      ruleType: 'geometric',
      ruleDescription: `Geometric sequence with common ratio r = ${ratio}`,
      formula: `a_n = a_1 × r^(n-1) = ${sequence[0]} × ${ratio}^(n-1)`,
      confidence: 0.93
    };
  }
  
  if (checkFibonacciSequence(sequence)) {
    const nextElements = [
      sequence[sequence.length - 1] + sequence[sequence.length - 2],
      sequence[sequence.length - 1] + sequence[sequence.length - 2] + sequence[sequence.length - 1],
      sequence[sequence.length - 1] + sequence[sequence.length - 2] + sequence[sequence.length - 1] + sequence[sequence.length - 1] + sequence[sequence.length - 2]
    ];
    
    return {
      nextElements,
      ruleType: 'fibonacci',
      ruleDescription: 'Fibonacci-like sequence where each number is the sum of the two preceding ones',
      formula: 'a_n = a_(n-1) + a_(n-2)',
      confidence: 0.9
    };
  }
  
  if (checkSquareSequence(sequence)) {
    const nextIndex = Math.sqrt(sequence[sequence.length - 1]) + 1;
    const nextElements = [
      Math.pow(nextIndex, 2),
      Math.pow(nextIndex + 1, 2),
      Math.pow(nextIndex + 2, 2)
    ];
    
    return {
      nextElements,
      ruleType: 'square',
      ruleDescription: 'Square numbers sequence',
      formula: 'a_n = n²',
      confidence: 0.92
    };
  }
  
  // Try second-order differences
  const firstDiffs = getSequenceDifferences(sequence);
  if (checkArithmeticSequence([...firstDiffs])) {
    const secondDiff = firstDiffs[1] - firstDiffs[0];
    const nextFirstDiff = firstDiffs[firstDiffs.length - 1] + secondDiff;
    const nextElement = sequence[sequence.length - 1] + nextFirstDiff;
    
    return {
      nextElements: [nextElement, nextElement + nextFirstDiff + secondDiff, nextElement + nextFirstDiff + secondDiff + nextFirstDiff + secondDiff + secondDiff],
      ruleType: 'arithmetic',
      ruleDescription: 'Quadratic sequence with second-order difference',
      formula: `Second-order differences = ${secondDiff}`,
      confidence: 0.85
    };
  }

  // Fallback to linear prediction
  const diff = sequence[sequence.length - 1] - sequence[sequence.length - 2];
  return {
    nextElements: [
      sequence[sequence.length - 1] + diff,
      sequence[sequence.length - 1] + diff * 2,
      sequence[sequence.length - 1] + diff * 3
    ],
    ruleType: 'unknown',
    ruleDescription: 'Pattern not definitively identified',
    formula: 'Based on last difference',
    confidence: 0.5
  };
};
