
import React, { useState } from 'react';
import SequenceForm from '@/components/SequenceForm';
import PredictionResult from '@/components/PredictionResult';
import { PredictionResult as PredictionResultType } from '@/utils/sequenceUtils';
import { predictSequence } from '@/utils/dummyPredictor';

const Index: React.FC = () => {
  const [sequence, setSequence] = useState<number[] | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);

  const handleSequenceSubmit = (inputSequence: number[]) => {
    setSequence(inputSequence);
    const result = predictSequence(inputSequence);
    setPredictionResult(result);
  };

  return (
    <div className="min-h-screen math-grid">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
            Mathematical Sequences Prediction
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze numeric sequences, identify patterns, and predict the next elements using advanced algorithms.
          </p>
        </div>

        <SequenceForm onSubmit={handleSequenceSubmit} />
        
        {sequence && predictionResult && (
          <PredictionResult sequence={sequence} result={predictionResult} />
        )}

        <div className="mt-16 border-t border-gray-200 pt-8 text-sm text-center text-muted-foreground">
          <p>
            A frontend prototype for a mathematical pattern recognition system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
