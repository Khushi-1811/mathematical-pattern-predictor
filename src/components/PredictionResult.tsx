
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { PredictionResult as PredictionResultType } from '@/utils/sequenceUtils';
import SequenceChart from './SequenceChart';
import { formatNumberWithPrecision } from '@/utils/sequenceUtils';

interface PredictionResultProps {
  sequence: number[];
  result: PredictionResultType;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ sequence, result }) => {
  const confidencePercentage = Math.round(result.confidence * 100);
  
  return (
    <div className="space-y-8 mb-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Sequence Analysis</CardTitle>
              <CardDescription>
                Pattern identified with {confidencePercentage}% confidence
              </CardDescription>
            </div>
            <Badge 
              variant={result.confidence > 0.8 ? "default" : "outline"} 
              className="self-start sm:self-auto"
            >
              {result.ruleType !== 'unknown' ? result.ruleType.charAt(0).toUpperCase() + result.ruleType.slice(1) : 'Complex Pattern'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Sequence Visualization</h3>
            <SequenceChart sequence={sequence} predictions={result.nextElements} />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Pattern Recognition</h3>
              <p className="text-muted-foreground">{result.ruleDescription}</p>
              {result.formula && (
                <div className="mt-3 font-mono bg-muted p-3 rounded-md text-sm">
                  {result.formula}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Prediction Confidence</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Score</span>
                  <span className="font-medium">{confidencePercentage}%</span>
                </div>
                <Progress value={confidencePercentage} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Sequence Values</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {sequence.map((num, index) => (
                <div key={`original-${index}`} className="sequence-number">
                  {formatNumberWithPrecision(num)}
                </div>
              ))}
              <div className="mx-2 text-muted-foreground">→</div>
              {result.nextElements.map((num, index) => (
                <div key={`predicted-${index}`} className="sequence-number predicted">
                  {formatNumberWithPrecision(num)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
