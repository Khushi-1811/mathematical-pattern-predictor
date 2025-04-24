
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
  | 'hybrid'
  | 'difference_pattern'
  | 'ratio_pattern'
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

// Check if all values in an array are approximately equal
export const areAllValuesEqual = (arr: number[], tolerance: number = 0.0001): boolean => {
  if (arr.length <= 1) return true;
  const firstValue = arr[0];
  return arr.every(value => Math.abs(value - firstValue) < tolerance);
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

export const checkCubeSequence = (sequence: number[]): boolean => {
  if (sequence.length < 3) return false;
  
  for (let i = 0; i < sequence.length; i++) {
    const cubeRoot = Math.cbrt(sequence[i]);
    if (Math.abs(Math.round(cubeRoot) - cubeRoot) > 0.0001) {
      return false;
    }
  }
  
  return true;
};

export const checkAlternatingSequence = (sequence: number[]): [boolean, number, number] => {
  if (sequence.length < 4) return [false, 0, 0];
  
  // Check if odd and even positions follow different patterns
  const oddPositions = sequence.filter((_, i) => i % 2 === 0);
  const evenPositions = sequence.filter((_, i) => i % 2 === 1);
  
  // Check if odd positions have constant difference
  const oddDiffs = getSequenceDifferences(oddPositions);
  const evenDiffs = getSequenceDifferences(evenPositions);
  
  const isOddArithmetic = areAllValuesEqual(oddDiffs);
  const isEvenArithmetic = areAllValuesEqual(evenDiffs);
  
  if (isOddArithmetic && isEvenArithmetic) {
    return [true, oddDiffs[0], evenDiffs[0]];
  }
  
  // Check if alternating +/- pattern
  const diffs = getSequenceDifferences(sequence);
  if (diffs.length >= 2) {
    const alternatingSigns = diffs.every((diff, i) => 
      (i % 2 === 0) ? (diff > 0) : (diff < 0)) ||
      (diffs.every((diff, i) => 
      (i % 2 === 0) ? (diff < 0) : (diff > 0)));
    
    if (alternatingSigns && areAllValuesEqual(diffs.map(Math.abs))) {
      return [true, diffs[0], diffs[1]];
    }
  }
  
  return [false, 0, 0];
};

export const checkDifferencePatterns = (sequence: number[]): [boolean, number, string] => {
  if (sequence.length < 4) return [false, 0, ''];
  
  // Check first-order differences
  const firstDiffs = getSequenceDifferences(sequence);
  if (areAllValuesEqual(firstDiffs)) {
    return [true, firstDiffs[0], 'first-order'];
  }
  
  // Check second-order differences
  const secondDiffs = getSequenceDifferences(firstDiffs);
  if (areAllValuesEqual(secondDiffs)) {
    return [true, secondDiffs[0], 'second-order'];
  }
  
  // Check third-order differences
  const thirdDiffs = getSequenceDifferences(secondDiffs);
  if (areAllValuesEqual(thirdDiffs)) {
    return [true, thirdDiffs[0], 'third-order'];
  }
  
  return [false, 0, ''];
};

export const checkRatioPatterns = (sequence: number[]): [boolean, number, string] => {
  if (sequence.length < 4) return [false, 0, ''];
  
  // Check first-order ratios
  const firstRatios = getSequenceRatios(sequence);
  if (areAllValuesEqual(firstRatios)) {
    return [true, firstRatios[0], 'first-order'];
  }
  
  // Check second-order ratios (ratios of ratios)
  const secondRatios = getSequenceRatios(firstRatios.filter(r => !isNaN(r) && isFinite(r)));
  if (secondRatios.length >= 2 && areAllValuesEqual(secondRatios)) {
    return [true, secondRatios[0], 'second-order'];
  }
  
  return [false, 0, ''];
};

export const checkPowerSequence = (sequence: number[]): [boolean, number] => {
  if (sequence.length < 3) return [false, 0];
  
  // Check if sequence follows a^n pattern for some base a
  for (let base = 2; base <= 10; base++) {
    const isMatch = sequence.every((num, idx) => {
      const expected = Math.pow(base, idx);
      return Math.abs(num - expected) < 0.0001;
    });
    
    if (isMatch) {
      return [true, base];
    }
  }
  
  return [false, 0];
};

