'use client';

import { NumberField } from '@/components/ui/form-fields/number-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

interface CurrencyData {
  cp: number; // copper
  sp: number; // silver
  ep: number; // electrum
  gp: number; // gold
  pp: number; // platinum
}

interface CurrencyEditorProps {
  data: CurrencyData;
  onChange: (data: CurrencyData) => void;
}

const CURRENCY_CONFIG = [
  { key: 'pp', label: 'Платиновые', color: 'text-slate-400', multiplier: 10 },
  { key: 'gp', label: 'Золотые', color: 'text-yellow-500', multiplier: 1 },
  { key: 'ep', label: 'Электрумовые', color: 'text-green-500', multiplier: 0.5 },
  { key: 'sp', label: 'Серебряные', color: 'text-gray-400', multiplier: 0.1 },
  { key: 'cp', label: 'Медные', color: 'text-orange-600', multiplier: 0.01 }
];

export function CurrencyEditor({ data, onChange }: CurrencyEditorProps) {
  const updateCurrency = (currency: keyof CurrencyData, value: number) => {
    onChange({ ...data, [currency]: value });
  };

  const getTotalGoldValue = (): number => {
    return CURRENCY_CONFIG.reduce((total, { key, multiplier }) => {
      return total + (data[key as keyof CurrencyData] * multiplier);
    }, 0);
  };

  const formatGoldValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-primary" />
              <span>Валюта</span>
            </div>
            <Badge variant="outline" className="text-lg">
              Всего: {formatGoldValue(getTotalGoldValue())} зм
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CURRENCY_CONFIG.map(({ key, label, color }) => (
              <div key={key} className="space-y-2">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${color} mb-2`}>
                    <Coins className="h-8 w-8 mx-auto" />
                  </div>
                  <div className="text-sm font-medium">{label}</div>
                </div>
                <NumberField
                  label=""
                  value={data[key as keyof CurrencyData]}
                  onChange={(value) => updateCurrency(key as keyof CurrencyData, value)}
                  min={0}
                  max={999999}
                  showControls={true}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">Конвертация валют</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">1 пп =</span>
                <span className="font-medium ml-1">10 зм</span>
              </div>
              <div>
                <span className="text-muted-foreground">1 зм =</span>
                <span className="font-medium ml-1">10 см</span>
              </div>
              <div>
                <span className="text-muted-foreground">1 эм =</span>
                <span className="font-medium ml-1">5 см</span>
              </div>
              <div>
                <span className="text-muted-foreground">1 см =</span>
                <span className="font-medium ml-1">10 мм</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}