
export type SequenceRule = 
  | 'arithmetic'
  | 'geometric'
  | 'fibonacci'
  | 'square'
  | 'cube'
  | 'factorial'
  | 'prime'
  | 'alternating'
  | 'power'
  | 'unknown';

export interface PredictionResult {
  nextElements: number[];
  ruleType: SequenceRule;
  ruleDescription: string;
  formula: string;
  confidence: number;
}

export const formatNumberWithPrecision = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Round to max 3 decimal places
  return num.toFixed(3).replace(/\.?0+$/, '');
};

export const getSequenceDifferences = (sequence: number[]): number[] => {
  const differences = [];
  for (let i = 1; i < sequence.length; i++) {
    differences.push(sequence[i] - sequence[i-1]);
  }
  return differences;
};

export const getSequenceRatios = (sequence: number[]): number[] => {
  const ratios = [];
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i-1] !== 0) {
      ratios.push(sequence[i] / sequence[i-1]);
    } else {
      ratios.push(NaN);
    }
  }
  return ratios;
};

export const checkArithmeticSequence = (sequence: number[]): boolean => {
  if (sequence.length < 3) return false;
  
  const differences = getSequenceDifferences(sequence);
  const firstDiff = differences[0];
  
  return differences.every(diff => Math.abs(diff - firstDiff) < 0.0001);
};

export const checkGeometricSequence = (sequence: number[]): boolean => {
  if (sequence.length < 3) return false;
  
  const ratios = getSequenceRatios(sequence);
  const firstRatio = ratios[0];
  
  if (isNaN(firstRatio)) return false;
  
  return ratios.every(ratio => !isNaN(ratio) && Math.abs(ratio - firstRatio) < 0.0001);
};

export const checkFibonacciSequence = (sequence: number[]): boolean => {
  if (sequence.length < 3) return false;
  
  for (let i = 2; i < sequence.length; i++) {
    if (Math.abs(sequence[i] - (sequence[i-1] + sequence[i-2])) > 0.0001) {
      return false;
    }
  }
  
  return true;
};

export const checkSquareSequence = (sequence: number[]): boolean => {
  if (sequence.length < 3) return false;
  
  for (let i = 0; i < sequence.length; i++) {
    const squareRoot = Math.sqrt(sequence[i]);
    if (Math.abs(Math.round(squareRoot) - squareRoot) > 0.0001) {
      return false;
    }
  }
  
  return true;
};
