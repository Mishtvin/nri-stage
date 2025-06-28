'use client';

import { NumberField } from '@/components/ui/form-fields/number-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Sword, Heart, Brain, Eye, MessageSquare } from 'lucide-react';

interface AbilityScore {
  base: number;
  modifier: number;
  temp: number;
}

interface AbilitiesData {
  str: AbilityScore;
  dex: AbilityScore;
  con: AbilityScore;
  int: AbilityScore;
  wis: AbilityScore;
  cha: AbilityScore;
}

interface AbilitiesEditorProps {
  data: AbilitiesData;
  onChange: (data: AbilitiesData) => void;
}

const ABILITY_CONFIG = [
  { key: 'str', label: 'Сила', icon: Sword, color: 'text-red-500' },
  { key: 'dex', label: 'Ловкость', icon: Zap, color: 'text-green-500' },
  { key: 'con', label: 'Телосложение', icon: Heart, color: 'text-pink-500' },
  { key: 'int', label: 'Интеллект', icon: Brain, color: 'text-blue-500' },
  { key: 'wis', label: 'Мудрость', icon: Eye, color: 'text-purple-500' },
  { key: 'cha', label: 'Харизма', icon: MessageSquare, color: 'text-yellow-500' }
];

export function AbilitiesEditor({ data, onChange }: AbilitiesEditorProps) {
  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const updateAbility = (ability: keyof AbilitiesData, field: keyof AbilityScore, value: number) => {
    const newData = { ...data };
    newData[ability] = { ...newData[ability], [field]: value };
    
    // Автоматически пересчитываем модификатор при изменении базового значения
    if (field === 'base') {
      newData[ability].modifier = calculateModifier(value);
    }
    
    onChange(newData);
  };

  const getTotalScore = (ability: AbilityScore): number => {
    return ability.base + ability.temp;
  };

  const getTotalModifier = (ability: AbilityScore): number => {
    return calculateModifier(getTotalScore(ability));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Характеристики</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABILITY_CONFIG.map(({ key, label, icon: Icon, color }) => {
              const ability = data[key as keyof AbilitiesData];
              const totalScore = getTotalScore(ability);
              const totalModifier = getTotalModifier(ability);
              
              return (
                <div key={key} className="space-y-4 p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <h3 className="font-semibold">{label}</h3>
                    </div>
                    <Badge variant="outline" className="text-lg font-bold">
                      {totalModifier >= 0 ? '+' : ''}{totalModifier}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <NumberField
                      label="Базовое значение"
                      value={ability.base}
                      onChange={(value) => updateAbility(key as keyof AbilitiesData, 'base', value)}
                      min={1}
                      max={30}
                      showControls={true}
                    />
                    
                    <NumberField
                      label="Временный бонус"
                      value={ability.temp}
                      onChange={(value) => updateAbility(key as keyof AbilitiesData, 'temp', value)}
                      min={-10}
                      max={10}
                      showControls={true}
                    />
                    
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-sm text-muted-foreground">Итого</div>
                      <div className="text-2xl font-bold">{totalScore}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Сводка модификаторов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ABILITY_CONFIG.map(({ key, label, icon: Icon, color }) => {
              const ability = data[key as keyof AbilitiesData];
              const totalModifier = getTotalModifier(ability);
              
              return (
                <div key={key} className="text-center p-3 border border-border/50 rounded-lg">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                  <div className="text-xs text-muted-foreground uppercase">{key}</div>
                  <div className="text-lg font-bold">
                    {totalModifier >= 0 ? '+' : ''}{totalModifier}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}