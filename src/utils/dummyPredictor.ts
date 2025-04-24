
import { 
  PredictionResult, 
  SequenceRule, 
  checkArithmeticSequence, 
  checkGeometricSequence, 
  checkFibonacciSequence, 
  checkSquareSequence,
  checkCubeSequence,
  checkAlternatingSequence,
  checkDifferencePatterns,
  checkRatioPatterns,
  checkPowerSequence,
  getSequenceDifferences,
  getSequenceRatios,
  formatNumberWithPrecision
} from "./sequenceUtils";

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

  // Check for simple patterns first
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
      sequence[sequence.length - 1] * Math.pow(ratio, 2),
      sequence[sequence.length - 1] * Math.pow(ratio, 3)
    ];
    
    return {
      nextElements,
      ruleType: 'geometric',
      ruleDescription: `Geometric sequence with common ratio r = ${formatNumberWithPrecision(ratio)}`,
      formula: `a_n = a_1 × r^(n-1) = ${sequence[0]} × ${formatNumberWithPrecision(ratio)}^(n-1)`,
      confidence: 0.93
    };
  }
  
  if (checkFibonacciSequence(sequence)) {
    const nextElements = [
      sequence[sequence.length - 1] + sequence[sequence.length - 2],
      sequence[sequence.length - 1] + sequence[sequence.length - 2] + sequence[sequence.length - 1],
      sequence[sequence.length - 1] * 2 + sequence[sequence.length - 2]
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

  if (checkCubeSequence(sequence)) {
    const nextIndex = Math.cbrt(sequence[sequence.length - 1]) + 1;
    const nextElements = [
      Math.pow(nextIndex, 3),
      Math.pow(nextIndex + 1, 3),
      Math.pow(nextIndex + 2, 3)
    ];
    
    return {
      nextElements,
      ruleType: 'cube',
      ruleDescription: 'Cube numbers sequence',
      formula: 'a_n = n³',
      confidence: 0.91
    };
  }

  // Check for alternating patterns
  const [isAlternating, altValue1, altValue2] = checkAlternatingSequence(sequence);
  if (isAlternating) {
    const nextElements = [];
    const lastIndex = sequence.length - 1;
    
    if (lastIndex % 2 === 0) {
      // Last element was in odd position, next is even position
      nextElements.push(sequence[lastIndex] + altValue2);
      nextElements.push(sequence[lastIndex] + altValue2 + altValue1);
      nextElements.push(sequence[lastIndex] + altValue2 + altValue1 + altValue2);
    } else {
      // Last element was in even position, next is odd position
      nextElements.push(sequence[lastIndex] + altValue1);
      nextElements.push(sequence[lastIndex] + altValue1 + altValue2);
      nextElements.push(sequence[lastIndex] + altValue1 + altValue2 + altValue1);
    }
    
    return {
      nextElements,
      ruleType: 'alternating',
      ruleDescription: `Alternating sequence with different patterns for odd/even positions`,
      formula: `Odd positions: +${formatNumberWithPrecision(altValue1)}, Even positions: +${formatNumberWithPrecision(altValue2)}`,
      confidence: 0.89
    };
  }

  // Check for power sequences (exponential)
  const [isPower, base] = checkPowerSequence(sequence);
  if (isPower) {
    const nextPower = sequence.length;
    const nextElements = [
      Math.pow(base, nextPower),
      Math.pow(base, nextPower + 1),
      Math.pow(base, nextPower + 2)
    ];
    
    return {
      nextElements,
      ruleType: 'power',
      ruleDescription: `Power sequence with base ${base}`,
      formula: `a_n = ${base}^n`,
      confidence: 0.9
    };
  }

  // Check for patterns in differences
  const [hasDiffPattern, diffValue, diffOrder] = checkDifferencePatterns(sequence);
  if (hasDiffPattern) {
    let nextElements: number[] = [];
    
    if (diffOrder === 'first-order') {
      // Linear sequence with constant difference
      nextElements = [
        sequence[sequence.length - 1] + diffValue,
        sequence[sequence.length - 1] + diffValue * 2,
        sequence[sequence.length - 1] + diffValue * 3
      ];
    } else if (diffOrder === 'second-order') {
      // Quadratic sequence with constant second difference
      const firstDiffs = getSequenceDifferences(sequence);
      const lastDiff = firstDiffs[firstDiffs.length - 1];
      const nextDiff1 = lastDiff + diffValue;
      const nextDiff2 = nextDiff1 + diffValue;
      const nextDiff3 = nextDiff2 + diffValue;
      
      nextElements = [
        sequence[sequence.length - 1] + nextDiff1,
        sequence[sequence.length - 1] + nextDiff1 + nextDiff2,
        sequence[sequence.length - 1] + nextDiff1 + nextDiff2 + nextDiff3
      ];
    } else if (diffOrder === 'third-order') {
      // Cubic sequence with constant third difference
      const firstDiffs = getSequenceDifferences(sequence);
      const secondDiffs = getSequenceDifferences(firstDiffs);
      
      const lastFirstDiff = firstDiffs[firstDiffs.length - 1];
      const lastSecondDiff = secondDiffs[secondDiffs.length - 1];
      
      const nextSecondDiff1 = lastSecondDiff + diffValue;
      const nextSecondDiff2 = nextSecondDiff1 + diffValue;
      
      const nextFirstDiff1 = lastFirstDiff + nextSecondDiff1;
      const nextFirstDiff2 = nextFirstDiff1 + nextSecondDiff1 + nextSecondDiff2;
      
      nextElements = [
        sequence[sequence.length - 1] + nextFirstDiff1,
        sequence[sequence.length - 1] + nextFirstDiff1 + nextFirstDiff2,
        sequence[sequence.length - 1] + nextFirstDiff1 + nextFirstDiff2 + (nextFirstDiff2 + nextSecondDiff2 + diffValue)
      ];
    }
    
    return {
      nextElements,
      ruleType: 'difference_pattern',
      ruleDescription: `Sequence with constant ${diffOrder} difference = ${formatNumberWithPrecision(diffValue)}`,
      formula: diffOrder === 'first-order' ? 
                `Linear: a_n = a_1 + (n-1)d` :
                (diffOrder === 'second-order' ? 
                  `Quadratic with constant second difference` : 
                  `Cubic with constant third difference`),
      confidence: diffOrder === 'first-order' ? 0.9 : (diffOrder === 'second-order' ? 0.87 : 0.85)
    };
  }

  // Check for patterns in ratios
  const [hasRatioPattern, ratioValue, ratioOrder] = checkRatioPatterns(sequence);
  if (hasRatioPattern) {
    let nextElements: number[] = [];
    
    if (ratioOrder === 'first-order') {
      // Geometric sequence with constant ratio
      nextElements = [
        sequence[sequence.length - 1] * ratioValue,
        sequence[sequence.length - 1] * Math.pow(ratioValue, 2),
        sequence[sequence.length - 1] * Math.pow(ratioValue, 3)
      ];
    } else if (ratioOrder === 'second-order') {
      // Second-order ratio pattern
      const ratios = getSequenceRatios(sequence).filter(r => !isNaN(r) && isFinite(r));
      const lastRatio = ratios[ratios.length - 1];
      const nextRatio1 = lastRatio * ratioValue;
      const nextRatio2 = nextRatio1 * ratioValue;
      
      nextElements = [
        sequence[sequence.length - 1] * nextRatio1,
        sequence[sequence.length - 1] * nextRatio1 * nextRatio2,
        sequence[sequence.length - 1] * nextRatio1 * nextRatio2 * (nextRatio2 * ratioValue)
      ];
    }
    
    return {
      nextElements,
      ruleType: 'ratio_pattern',
      ruleDescription: `Sequence with constant ${ratioOrder} ratio = ${formatNumberWithPrecision(ratioValue)}`,
      formula: ratioOrder === 'first-order' ? 
                `a_n = a_1 × r^(n-1)` : 
                `Sequence with second-order ratio pattern`,
      confidence: ratioOrder === 'first-order' ? 0.9 : 0.86
    };
  }

  // Attempt to identify hybrid patterns by combining different rules
  // For example, a sequence that alternates between two different patterns
  if (sequence.length >= 6) {
    // Check if odd and even positions follow different sequences
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);
    
    // Check if odd positions follow arithmetic and even follows geometric
    const isOddArithmetic = checkArithmeticSequence(oddPositions);
    const isEvenGeometric = checkGeometricSequence(evenPositions);
    
    if (isOddArithmetic && isEvenGeometric) {
      const oddDiff = oddPositions[1] - oddPositions[0];
      const evenRatio = evenPositions[1] / evenPositions[0];
      
      const nextElements = [];
      if (sequence.length % 2 === 0) {
        // Next is odd
        nextElements.push(oddPositions[oddPositions.length - 1] + oddDiff);
        nextElements.push(evenPositions[evenPositions.length - 1] * evenRatio);
        nextElements.push(oddPositions[oddPositions.length - 1] + oddDiff * 2);
      } else {
        // Next is even
        nextElements.push(evenPositions[evenPositions.length - 1] * evenRatio);
        nextElements.push(oddPositions[oddPositions.length - 1] + oddDiff);
        nextElements.push(evenPositions[evenPositions.length - 1] * evenRatio * evenRatio);
      }
      
      return {
        nextElements,
        ruleType: 'hybrid',
        ruleDescription: 'Hybrid pattern: arithmetic for odd positions, geometric for even positions',
        formula: `Odd positions: a_n = ${oddPositions[0]} + (n/2)×${oddDiff}, Even positions: a_n = ${evenPositions[0]} × ${formatNumberWithPrecision(evenRatio)}^(n/2)`,
        confidence: 0.82
      };
    }
  }
  
  // Fallback to linear prediction based on last difference
  const diff = sequence[sequence.length - 1] - sequence[sequence.length - 2];
  return {
    nextElements: [
      sequence[sequence.length - 1] + diff,
      sequence[sequence.length - 1] + diff * 2,
      sequence[sequence.length - 1] + diff * 3
    ],
    ruleType: 'unknown',
    ruleDescription: 'Pattern not definitively identified, using last difference',
    formula: 'Based on last difference = ' + formatNumberWithPrecision(diff),
    confidence: 0.5
  };
};
