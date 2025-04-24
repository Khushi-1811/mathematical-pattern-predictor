
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { ArrowRight } from 'lucide-react';

interface SequenceFormProps {
  onSubmit: (sequence: number[]) => void;
}

const SequenceForm: React.FC<SequenceFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove all whitespace and split by commas
    const cleaned = inputValue.replace(/\s+/g, '');
    const values = cleaned.split(',');
    
    // Convert to numbers and validate
    const numbers = values.map(val => parseFloat(val)).filter(num => !isNaN(num));
    
    if (numbers.length < 3) {
      toast.error('Please enter at least 3 numbers separated by commas');
      return;
    }
    
    if (numbers.length > 20) {
      toast.warning('Using only the first 20 numbers');
      onSubmit(numbers.slice(0, 20));
      return;
    }
    
    onSubmit(numbers);
  };

  const handleExampleClick = (example: number[]) => {
    setInputValue(example.join(', '));
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Enter a Number Sequence</CardTitle>
        <CardDescription>
          Input 3 to 20 numbers separated by commas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., 2, 4, 6, 8"
              className="font-mono"
            />
            <Button type="submit" className="whitespace-nowrap">
              Predict Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleClick([2, 4, 6, 8, 10])}
                className="text-xs"
              >
                2, 4, 6, 8, 10
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleClick([1, 2, 4, 8, 16])}
                className="text-xs"
              >
                1, 2, 4, 8, 16
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleClick([1, 1, 2, 3, 5, 8])}
                className="text-xs"
              >
                1, 1, 2, 3, 5, 8
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleClick([1, 4, 9, 16, 25])}
                className="text-xs"
              >
                1, 4, 9, 16, 25
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SequenceForm;
