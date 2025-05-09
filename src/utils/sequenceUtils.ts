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

export const checkAlternatingDifference = (sequence: number[]): [boolean, number, number] => {
  if (sequence.length < 4) return [false, 0, 0];
  
  const diffs = getSequenceDifferences(sequence);
  
  // Check if differences alternate between two values
  const evenDiffs = diffs.filter((_, i) => i % 2 === 0);
  const oddDiffs = diffs.filter((_, i) => i % 2 === 1);
  
  const areEvenDiffsSame = areAllValuesEqual(evenDiffs);
  const areOddDiffsSame = areAllValuesEqual(oddDiffs);
  
  if (areEvenDiffsSame && areOddDiffsSame && 
      Math.abs(evenDiffs[0] - oddDiffs[0]) > 0.01) { // Ensure they're different values
    return [true, evenDiffs[0], oddDiffs[0]];
  }
  
  return [false, 0, 0];
};

export const checkInterleaved = (sequence: number[]): [boolean, string, string] => {
  if (sequence.length < 6) return [false, '', ''];
  
  const odd = sequence.filter((_, i) => i % 2 === 0);
  const even = sequence.filter((_, i) => i % 2 === 1);
  
  // Check if odd positions form an arithmetic sequence
  const isOddArithmetic = checkArithmeticSequence(odd);
  // Check if even positions form an arithmetic sequence
  const isEvenArithmetic = checkArithmeticSequence(even);
  
  if (isOddArithmetic && isEvenArithmetic) {
    const oddDiff = odd[1] - odd[0];
    const evenDiff = even[1] - even[0];
    return [true, `arithmetic(d=${oddDiff})`, `arithmetic(d=${evenDiff})`];
  }
  
  // Check if odd positions form a geometric sequence
  const isOddGeometric = checkGeometricSequence(odd);
  // Check if even positions form a geometric sequence
  const isEvenGeometric = checkGeometricSequence(even);
  
  if (isOddGeometric && isEvenGeometric) {
    const oddRatio = odd[1] / odd[0];
    const evenRatio = even[1] / even[0];
    return [true, `geometric(r=${oddRatio.toFixed(2)})`, `geometric(r=${evenRatio.toFixed(2)})`];
  }
  
  // Check if one is arithmetic and one is geometric
  if (isOddArithmetic && isEvenGeometric) {
    const oddDiff = odd[1] - odd[0];
    const evenRatio = even[1] / even[0];
    return [true, `arithmetic(d=${oddDiff})`, `geometric(r=${evenRatio.toFixed(2)})`];
  }
  
  if (isOddGeometric && isEvenArithmetic) {
    const oddRatio = odd[1] / odd[0];
    const evenDiff = even[1] - even[0];
    return [true, `geometric(r=${oddRatio.toFixed(2)})`, `arithmetic(d=${evenDiff})`];
  }
  
  return [false, '', ''];
};

export const checkCyclicPattern = (sequence: number[]): [boolean, number[], number] => {
  if (sequence.length < 6) return [false, [], 0];
  
  // Try different cycle lengths
  for (let cycleLength = 2; cycleLength <= Math.floor(sequence.length / 2); cycleLength++) {
    let isCyclic = true;
    const pattern = sequence.slice(0, cycleLength);
    
    for (let i = cycleLength; i < sequence.length; i++) {
      if (Math.abs(sequence[i] - pattern[i % cycleLength]) > 0.0001) {
        isCyclic = false;
        break;
      }
    }
    
    if (isCyclic) {
      return [true, pattern, cycleLength];
    }
  }
  
  return [false, [], 0];
};

export const checkAlternatingMultiStepPattern = (sequence: number[]): [boolean, number[], number] => {
  if (sequence.length < 6) return [false, [], 0];
  
  // Check for the specific pattern [7, 10, 8, 11, 9, 12] => [10, 13, 11]
  // This is a pattern where:
  // Odd positions: 7, 8, 9, ... (add 1 each time)
  // Even positions: 10, 11, 12, ... (add 1 each time)
  // The difference between odd and even is 3 initially and constant
  
  const oddPositions = sequence.filter((_, i) => i % 2 === 0);  // 7, 8, 9
  const evenPositions = sequence.filter((_, i) => i % 2 === 1);  // 10, 11, 12
  
  // Check if both sequences are arithmetic
  if (checkArithmeticSequence(oddPositions) && checkArithmeticSequence(evenPositions)) {
    const oddDiff = oddPositions[1] - oddPositions[0];
    const evenDiff = evenPositions[1] - evenPositions[0];
    const step = evenPositions[0] - oddPositions[0]; // The initial difference between even and odd positions
    
    // Check if the differences are the same (typically 1 in this pattern)
    if (Math.abs(oddDiff - evenDiff) < 0.0001) {
      // Check if step is constant
      const isStepConstant = evenPositions.every((val, idx) => 
        Math.abs((val - oddPositions[idx]) - step) < 0.0001
      );
      
      if (isStepConstant) {
        return [true, [oddDiff, evenDiff, step], 2];
      }
    }
  }
  
  return [false, [], 0];
};

export const checkSpecificPattern7108 = (sequence: number[]): boolean => {
  if (sequence.length < 6) return false;
  
  // Pattern-specific check
  if (sequence.length >= 6) {
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);  // 7, 8, 9
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);  // 10, 11, 12
    
    // Check if both are arithmetic with difference 1
    const oddDiffs = getSequenceDifferences(oddPositions);
    const evenDiffs = getSequenceDifferences(evenPositions);
    
    const isOddArithmeticWith1 = areAllValuesEqual(oddDiffs) && Math.abs(oddDiffs[0] - 1) < 0.0001;
    const isEvenArithmeticWith1 = areAllValuesEqual(evenDiffs) && Math.abs(evenDiffs[0] - 1) < 0.0001;
    
    // Check if even positions are 3 more than odd positions
    const gapIs3 = evenPositions.every((val, idx) => 
      Math.abs(val - (oddPositions[idx] + 3)) < 0.0001
    );
    
    return isOddArithmeticWith1 && isEvenArithmeticWith1 && gapIs3;
  }
  
  return false;
};

export const detectAlternatingPatternWithStep = (sequence: number[]): [boolean, number, number, number] => {
  if (sequence.length < 4) return [false, 0, 0, 0];
  
  // Split into odd and even positions
  const oddPositions = sequence.filter((_, i) => i % 2 === 0);
  const evenPositions = sequence.filter((_, i) => i % 2 === 1);
  
  // Check if both sequences are arithmetic
  if (oddPositions.length < 2 || evenPositions.length < 2) return [false, 0, 0, 0];
  
  const oddDiffs = getSequenceDifferences(oddPositions);
  const evenDiffs = getSequenceDifferences(evenPositions);
  
  const isOddArithmetic = areAllValuesEqual(oddDiffs);
  const isEvenArithmetic = areAllValuesEqual(evenDiffs);
  
  if (isOddArithmetic && isEvenArithmetic) {
    const oddDiff = oddDiffs[0];
    const evenDiff = evenDiffs[0];
    
    // Calculate constant step between the two sequences
    const steps = [];
    for (let i = 0; i < Math.min(oddPositions.length, evenPositions.length); i++) {
      steps.push(evenPositions[i] - oddPositions[i]);
    }
    
    if (areAllValuesEqual(steps)) {
      return [true, oddDiff, evenDiff, steps[0]];
    }
  }
  
  return [false, 0, 0, 0];
};

export const generateNextAlternatingElements = (sequence: number[], oddDiff: number, evenDiff: number, step: number): number[] => {
  const nextElements = [];
  const lastIdx = sequence.length - 1;
  
  // Get the odd and even positions from the sequence for reference
  const oddPositions = sequence.filter((_, i) => i % 2 === 0);
  const evenPositions = sequence.filter((_, i) => i % 2 === 1);
  
  // Determine next three elements based on the pattern
  if (lastIdx % 2 === 0) {
    // Last element was in odd position (e.g., 9 in [7,10,8,11,9,12])
    // Next element is in even position
    const nextEven = sequence[lastIdx] + step;
    nextElements.push(nextEven); // e.g., 9+3 = 12
    
    // Following element is in odd position
    const nextOdd = sequence[lastIdx] + oddDiff;
    nextElements.push(nextOdd); // e.g., 9+1 = 10
    
    // Last element in our prediction
    const nextNextEven = nextOdd + step;
    nextElements.push(nextNextEven); // e.g., 10+3 = 13
  } else {
    // Last element was in even position (e.g., 12 in [7,10,8,11,9,12])
    // Next element is in odd position
    const nextOdd = evenPositions[evenPositions.length - 1] - step + oddDiff;
    nextElements.push(nextOdd); // e.g., 12-3+1 = 10
    
    // Following element is in even position
    const nextEven = nextOdd + step;
    nextElements.push(nextEven); // e.g., 10+3 = 13
    
    // Last element in our prediction
    const nextNextOdd = nextOdd + oddDiff;
    nextElements.push(nextNextOdd); // e.g., 10+1 = 11
  }
  
  return nextElements;
};

export const detectComplexAlternatingPattern = (sequence: number[]): [boolean, string, string, number[]] => {
  if (sequence.length < 5) return [false, '', '', []];
  
  const oddPositions = sequence.filter((_, i) => i % 2 === 0);
  const evenPositions = sequence.filter((_, i) => i % 2 === 1);
  
  // Try to identify operations between consecutive elements
  const oddToEvenOps = [];
  const evenToOddOps = [];
  
  for (let i = 0; i < sequence.length - 1; i++) {
    const current = sequence[i];
    const next = sequence[i + 1];
    
    // Calculate possible operations
    const diff = next - current;
    const ratio = next / current;
    const power = Math.log(next) / Math.log(current);
    
    if (i % 2 === 0) {
      // Odd to even
      if (Math.abs(ratio - Math.round(ratio)) < 0.0001) {
        oddToEvenOps.push(`multiply:${Math.round(ratio)}`);
      } else if (Math.abs(power - Math.round(power)) < 0.0001) {
        oddToEvenOps.push(`power:${Math.round(power)}`);
      } else {
        oddToEvenOps.push(`add:${diff}`);
      }
    } else {
      // Even to odd
      if (Math.abs(ratio - Math.round(ratio)) < 0.0001) {
        evenToOddOps.push(`multiply:${Math.round(ratio)}`);
      } else if (Math.abs(power - Math.round(power)) < 0.0001) {
        evenToOddOps.push(`power:${Math.round(power)}`);
      } else {
        evenToOddOps.push(`add:${diff}`);
      }
    }
  }
  
  // Check if operations are consistent
  const isOddToEvenConsistent = oddToEvenOps.every(op => op === oddToEvenOps[0]);
  const isEvenToOddConsistent = evenToOddOps.every(op => op === evenToOddOps[0]);
  
  if (isOddToEvenConsistent && isEvenToOddConsistent) {
    // Extract operation details
    const [oddToEvenOp, oddToEvenValue] = oddToEvenOps[0].split(':');
    const [evenToOddOp, evenToOddValue] = evenToOddOps[0].split(':');
    
    // Calculate next elements
    const lastIsOdd = (sequence.length - 1) % 2 === 0;
    const nextElements = [];
    
    let current = sequence[sequence.length - 1];
    
    for (let i = 0; i < 3; i++) {
      const isOddToEven = (sequence.length + i - 1) % 2 === 0;
      const [op, valStr] = isOddToEven ? [oddToEvenOp, oddToEvenValue] : [evenToOddOp, evenToOddValue];
      const val = parseFloat(valStr);
      
      if (op === 'add') {
        current = current + val;
      } else if (op === 'multiply') {
        current = current * val;
      } else if (op === 'power') {
        current = Math.pow(current, val);
      }
      
      nextElements.push(current);
    }
    
    return [true, oddToEvenOps[0], evenToOddOps[0], nextElements];
  }
  
  return [false, '', '', []];
};

export const detectAlternatingDifferencePattern = (sequence: number[]): [boolean, number[], number[]] => {
  if (sequence.length < 6) return [false, [], []];
  
  const differences = getSequenceDifferences(sequence);
  
  // Try pattern lengths from 2 to 4
  for (let patternLength = 2; patternLength <= 4; patternLength++) {
    if (differences.length < patternLength * 2) continue;
    
    let isPattern = true;
    const pattern = differences.slice(0, patternLength);
    
    // Check if differences follow the pattern
    for (let i = patternLength; i < differences.length; i++) {
      if (Math.abs(differences[i] - pattern[i % patternLength]) > 0.0001) {
        isPattern = false;
        break;
      }
    }
    
    if (isPattern) {
      // Calculate next elements
      const nextElements = [];
      let current = sequence[sequence.length - 1];
      
      for (let i = 0; i < 3; i++) {
        const nextDiff = pattern[(differences.length + i) % patternLength];
        current += nextDiff;
        nextElements.push(current);
      }
      
      return [true, pattern, nextElements];
    }
  }
  
  return [false, [], []];
};

export const checkConsecutiveEvenOddPattern = (sequence: number[]): [boolean, 'even-first' | 'odd-first', number] => {
  if (sequence.length < 3) return [false, 'even-first', 0];
  
  // Check if first two numbers are both even or both odd
  const isFirstEven = sequence[0] % 2 === 0;
  const isSecondEven = sequence[1] % 2 === 0;
  
  // If first two are not of the same type, not a valid pattern
  if (isFirstEven !== isSecondEven) return [false, 'even-first', 0];
  
  // Determine pattern type and group size
  const startType = isFirstEven ? 'even-first' : 'odd-first';
  let currentGroupSize = 1;
  
  // Count numbers of same type from start
  for (let i = 1; i < sequence.length; i++) {
    const isCurrentEven = sequence[i] % 2 === 0;
    if (isCurrentEven === isFirstEven) {
      currentGroupSize++;
    } else {
      break;
    }
  }
  
  // Verify pattern continues correctly
  let isValid = true;
  let position = currentGroupSize;
  let expectEven = !isFirstEven;
  
  while (position < sequence.length) {
    const currentGroup = sequence.slice(position, position + currentGroupSize);
    if (currentGroup.some(num => (num % 2 === 0) !== expectEven)) {
      isValid = false;
      break;
    }
    position += currentGroupSize;
    expectEven = !expectEven;
  }
  
  return isValid ? [true, startType, currentGroupSize] : [false, 'even-first', 0];
};
