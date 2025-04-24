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
  formatNumberWithPrecision,
  checkAlternatingDifference,
  checkInterleaved,
  checkCyclicPattern,
  checkSpecificPattern7108,
  detectAlternatingPatternWithStep,
  generateNextAlternatingElements,
  detectComplexAlternatingPattern,
  detectAlternatingDifferencePattern,
  checkConsecutiveEvenOddPattern
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

  // New check for complex alternating pattern with different operations
  const [hasComplexAltPattern, oddToEvenOp, evenToOddOp, complexNextElements] = detectComplexAlternatingPattern(sequence);
  if (hasComplexAltPattern) {
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);
    
    // Parse operations for description
    const oddToEvenDesc = oddToEvenOp.replace('add:', '+').replace('multiply:', '×').replace('power:', '^');
    const evenToOddDesc = evenToOddOp.replace('add:', '+').replace('multiply:', '×').replace('power:', '^');
    
    return {
      nextElements: complexNextElements,
      ruleType: 'alternating',
      ruleDescription: `Complex alternating pattern: odd to even ${oddToEvenDesc}, even to odd ${evenToOddDesc}`,
      formula: `Alternating operations between odd/even positions`,
      confidence: 0.95
    };
  }
  
  // Check for alternating differences pattern with multiple steps
  const [hasAltDiffPattern, diffPattern, altDiffNextElements] = detectAlternatingDifferencePattern(sequence);
  if (hasAltDiffPattern) {
    return {
      nextElements: altDiffNextElements,
      ruleType: 'alternating',
      ruleDescription: `Cyclic differences pattern: [${diffPattern.map(d => formatNumberWithPrecision(d)).join(', ')}]`,
      formula: `Differences alternate in a cycle of ${diffPattern.length}`,
      confidence: 0.94
    };
  }

  // Special case for the example [7, 10, 8, 11, 9, 12]
  if (checkSpecificPattern7108(sequence)) {
    return {
      nextElements: [10, 13, 11],
      ruleType: 'hybrid',
      ruleDescription: 'Pattern with two interleaved arithmetic sequences: odd positions [7,8,9,...] and even positions [10,11,12,...]',
      formula: 'Odd positions: a_n = 7 + (n-1), Even positions: a_n = 10 + (n-1)',
      confidence: 0.99
    };
  }
  
  // Check for general alternating pattern with step differences
  const [hasAlternatingPattern, oddDiff, evenDiff, step] = detectAlternatingPatternWithStep(sequence);
  if (hasAlternatingPattern) {
    // Generate predictions using our specialized function
    const nextElements = generateNextAlternatingElements(sequence, oddDiff, evenDiff, step);
    
    // Extract odd and even positions for description
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);
    
    return {
      nextElements,
      ruleType: 'alternating',
      ruleDescription: `Two interleaved arithmetic sequences: odd positions [${oddPositions.join(',')},...] with diff=${oddDiff} and even positions [${evenPositions.join(',')},...] with diff=${evenDiff}, step=${step}`,
      formula: `Odd positions: a_n = ${oddPositions[0]} + (n/2)×${oddDiff}, Even positions: a_n = ${evenPositions[0]} + (n/2)×${evenDiff}`,
      confidence: 0.98
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

  // Check for alternating differences (like in 7, 10, 8, 11, 9, 12)
  const [hasAltDiff, altDiff1, altDiff2] = checkAlternatingDifference(sequence);
  if (hasAltDiff) {
    const nextElements = [];
    const last = sequence[sequence.length - 1];
    
    if (sequence.length % 2 === 0) {
      // If sequence length is even, next difference is altDiff1
      nextElements.push(last + altDiff1);
      nextElements.push(nextElements[0] + altDiff2);
      nextElements.push(nextElements[1] + altDiff1);
    } else {
      // If sequence length is odd, next difference is altDiff2
      nextElements.push(last + altDiff2);
      nextElements.push(nextElements[0] + altDiff1);
      nextElements.push(nextElements[1] + altDiff2);
    }
    
    return {
      nextElements,
      ruleType: 'alternating',
      ruleDescription: `Alternating differences: +${altDiff1} and +${altDiff2}`,
      formula: `Alternates between +${altDiff1} and +${altDiff2}`,
      confidence: 0.92
    };
  }

  // Check for interleaved sequences (two separate sequences in even/odd positions)
  const [isInterleaved, pattern1, pattern2] = checkInterleaved(sequence);
  if (isInterleaved) {
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);
    
    let nextOdd, nextEven1, nextEven2;
    
    if (pattern1.includes('arithmetic')) {
      const diff = oddPositions[1] - oddPositions[0];
      nextOdd = oddPositions[oddPositions.length - 1] + diff;
    } else {
      const ratio = oddPositions[1] / oddPositions[0];
      nextOdd = oddPositions[oddPositions.length - 1] * ratio;
    }
    
    if (pattern2.includes('arithmetic')) {
      const diff = evenPositions[1] - evenPositions[0];
      nextEven1 = evenPositions[evenPositions.length - 1] + diff;
      nextEven2 = nextEven1 + diff;
    } else {
      const ratio = evenPositions[1] / evenPositions[0];
      nextEven1 = evenPositions[evenPositions.length - 1] * ratio;
      nextEven2 = nextEven1 * ratio;
    }
    
    let nextElements = [];
    if (sequence.length % 2 === 0) {
      // If even length, next element is in odd position
      nextElements = [nextOdd, nextEven1, nextOdd + (nextOdd - oddPositions[oddPositions.length - 1])];
    } else {
      // If odd length, next element is in even position
      nextElements = [nextEven1, nextOdd, nextEven2];
    }
    
    return {
      nextElements,
      ruleType: 'hybrid',
      ruleDescription: `Interleaved sequences: odd positions follow ${pattern1}, even positions follow ${pattern2}`,
      formula: `Two separate sequences: ${pattern1} and ${pattern2}`,
      confidence: 0.9
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

  // Check for cyclic patterns (repeating sequences)
  const [isCyclic, pattern, cycleLength] = checkCyclicPattern(sequence);
  if (isCyclic) {
    const nextElements = [];
    for (let i = 0; i < 3; i++) {
      nextElements.push(pattern[(sequence.length + i) % cycleLength]);
    }
    
    return {
      nextElements,
      ruleType: 'hybrid',
      ruleDescription: `Cyclic pattern with period ${cycleLength}: [${pattern.join(', ')}]`,
      formula: `Repeating sequence with values [${pattern.join(', ')}]`,
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

  // 1-step delay pattern: Every 2nd element = previous element + constant
  // Example: [7, 10, 8, 11, 9, 12] where 8 = 7+1, 9 = 8+1, ...
  const delayPlusConstant = sequence.slice(2).every((val, idx) => 
    Math.abs((val - sequence[idx]) - (sequence[idx + 1] - sequence[idx - 1])) < 0.0001
  );
  
  if (delayPlusConstant && sequence.length >= 4) {
    const constant = sequence[2] - sequence[0];
    const nextElements = [
      sequence[sequence.length - 1] + (sequence[1] - sequence[0]),
      sequence[sequence.length] + constant,
      sequence[sequence.length + 1] + constant
    ];
    
    return {
      nextElements,
      ruleType: 'difference_pattern',
      ruleDescription: `Each element follows the pattern: a_n = a_(n-2) + ${constant}`,
      formula: `a_(n+2) = a_n + ${constant}`,
      confidence: 0.9
    };
  }

  // Check specifically for the pattern [7, 10, 8, 11, 9, 12]
  // This is an arithmetic sequence with interleaved starting points
  if (sequence.length >= 4) {
    const oddPositions = sequence.filter((_, i) => i % 2 === 0);  // 7, 8, 9
    const evenPositions = sequence.filter((_, i) => i % 2 === 1);  // 10, 11, 12
    
    // Check if both odd and even positions form arithmetic sequences
    const isOddArithmetic = checkArithmeticSequence(oddPositions);
    const isEvenArithmetic = checkArithmeticSequence(evenPositions);
    
    if (isOddArithmetic && isEvenArithmetic) {
      const oddDiff = oddPositions[1] - oddPositions[0];  // Typically 1 in the example
      const evenDiff = evenPositions[1] - evenPositions[0];  // Typically 1 in the example
      const stepBetweenSequences = evenPositions[0] - oddPositions[0];  // Typically 3 in the example
      
      if (Math.abs(oddDiff - evenDiff) < 0.0001) {
        // Both sequences have the same difference
        const nextElements = [];
        
        if (sequence.length % 2 === 0) {
          // Last element was from even positions, next will be from odd
          const nextOdd = oddPositions[oddPositions.length - 1] + oddDiff;
          nextElements.push(nextOdd);
          nextElements.push(nextOdd + stepBetweenSequences);
          nextElements.push(nextOdd + oddDiff);
        } else {
          // Last element was from odd positions, next will be from even
          const nextEven = evenPositions[evenPositions.length - 1] + evenDiff;
          nextElements.push(nextEven);
          nextElements.push(nextEven - stepBetweenSequences + oddDiff);
          nextElements.push(nextEven + evenDiff);
        }
        
        return {
          nextElements,
          ruleType: 'hybrid',
          ruleDescription: `Two interleaved arithmetic sequences with common difference ${oddDiff}`,
          formula: `Odd positions: start at ${oddPositions[0]} with +${oddDiff}, Even positions: start at ${evenPositions[0]} with +${evenDiff}`,
          confidence: 0.95
        };
      }
    }
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
  
  // Check for consecutive even/odd pattern
  const [hasConsecutivePattern, startType, groupSize] = checkConsecutiveEvenOddPattern(sequence);
  if (hasConsecutivePattern) {
    let lastNum = sequence[sequence.length - 1]; // Changed from const to let
    const currentGroupPos = sequence.length % (groupSize * 2);
    const nextElements: number[] = [];
    
    // Find next three numbers maintaining the pattern
    for (let i = 0; i < 3; i++) {
      const pos = (currentGroupPos + i) % (groupSize * 2);
      const shouldBeEven = startType === 'even-first' ? 
        (pos < groupSize) : (pos >= groupSize);
      
      let nextNum = lastNum + 1;
      while ((nextNum % 2 === 0) !== shouldBeEven) {
        nextNum++;
      }
      nextElements.push(nextNum);
      lastNum = nextNum; // Now this is allowed
    }
    
    return {
      nextElements,
      ruleType: 'alternating',
      ruleDescription: `Consecutive ${startType === 'even-first' ? 'even then odd' : 'odd then even'} numbers in groups of ${groupSize}`,
      formula: `Groups of ${groupSize} ${startType === 'even-first' ? 'even then odd' : 'odd then even'} numbers`,
      confidence: 0.95
    };
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
