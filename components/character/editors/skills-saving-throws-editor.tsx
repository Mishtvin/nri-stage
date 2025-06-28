'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Target, Shield } from 'lucide-react';

interface SkillData {
  proficient: boolean;
  expertise: boolean;
}

interface SavingThrowData {
  proficient: boolean;
}

interface SkillsSavingThrowsData {
  proficiencyBonus: number;
  savingThrows: {
    str: SavingThrowData;
    dex: SavingThrowData;
    con: SavingThrowData;
    int: SavingThrowData;
    wis: SavingThrowData;
    cha: SavingThrowData;
  };
  skills: {
    acrobatics: SkillData;
    animalHandling: SkillData;
    arcana: SkillData;
    athletics: SkillData;
    deception: SkillData;
    history: SkillData;
    insight: SkillData;
    intimidation: SkillData;
    investigation: SkillData;
    medicine: SkillData;
    nature: SkillData;
    perception: SkillData;
    performance: SkillData;
    persuasion: SkillData;
    religion: SkillData;
    sleightOfHand: SkillData;
    stealth: SkillData;
    survival: SkillData;
  };
}

interface SkillsSavingThrowsEditorProps {
  data: SkillsSavingThrowsData;
  abilityModifiers: Record<string, number>;
  onChange: (data: SkillsSavingThrowsData) => void;
}

const SKILLS_CONFIG = [
  { key: 'acrobatics', label: 'Акробатика', ability: 'dex' },
  { key: 'animalHandling', label: 'Обращение с животными', ability: 'wis' },
  { key: 'arcana', label: 'Магия', ability: 'int' },
  { key: 'athletics', label: 'Атлетика', ability: 'str' },
  { key: 'deception', label: 'Обман', ability: 'cha' },
  { key: 'history', label: 'История', ability: 'int' },
  { key: 'insight', label: 'Проницательность', ability: 'wis' },
  { key: 'intimidation', label: 'Запугивание', ability: 'cha' },
  { key: 'investigation', label: 'Расследование', ability: 'int' },
  { key: 'medicine', label: 'Медицина', ability: 'wis' },
  { key: 'nature', label: 'Природа', ability: 'int' },
  { key: 'perception', label: 'Внимательность', ability: 'wis' },
  { key: 'performance', label: 'Выступление', ability: 'cha' },
  { key: 'persuasion', label: 'Убеждение', ability: 'cha' },
  { key: 'religion', label: 'Религия', ability: 'int' },
  { key: 'sleightOfHand', label: 'Ловкость рук', ability: 'dex' },
  { key: 'stealth', label: 'Скрытность', ability: 'dex' },
  { key: 'survival', label: 'Выживание', ability: 'wis' }
];

const SAVING_THROWS_CONFIG = [
  { key: 'str', label: 'Сила' },
  { key: 'dex', label: 'Ловкость' },
  { key: 'con', label: 'Телосложение' },
  { key: 'int', label: 'Интеллект' },
  { key: 'wis', label: 'Мудрость' },
  { key: 'cha', label: 'Харизма' }
];

export function SkillsSavingThrowsEditor({
  data,
  abilityModifiers,
  onChange
}: SkillsSavingThrowsEditorProps) {
  const updateSkill = (skillKey: string, field: keyof SkillData, value: boolean) => {
    const newData = { ...data };
    newData.skills = {
      ...newData.skills,
      [skillKey]: { ...newData.skills[skillKey as keyof typeof newData.skills], [field]: value }
    };
    onChange(newData);
  };

  const updateSavingThrow = (abilityKey: string, value: boolean) => {
    const newData = { ...data };
    newData.savingThrows = {
      ...newData.savingThrows,
      [abilityKey]: { proficient: value }
    };
    onChange(newData);
  };

  const calculateSkillBonus = (skillKey: string): number => {
    const skill = data.skills[skillKey as keyof typeof data.skills];
    const skillConfig = SKILLS_CONFIG.find(s => s.key === skillKey);
    const abilityMod = abilityModifiers[skillConfig?.ability || 'str'] || 0;
    
    let bonus = abilityMod;
    if (skill.proficient) {
      bonus += data.proficiencyBonus;
    }
    if (skill.expertise) {
      bonus += data.proficiencyBonus;
    }
    
    return bonus;
  };

  const calculateSavingThrowBonus = (abilityKey: string): number => {
    const savingThrow = data.savingThrows[abilityKey as keyof typeof data.savingThrows];
    const abilityMod = abilityModifiers[abilityKey] || 0;
    
    return abilityMod + (savingThrow.proficient ? data.proficiencyBonus : 0);
  };

  return (
    <div className="space-y-6">
      {/* Спасброски */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Спасброски</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAVING_THROWS_CONFIG.map(({ key, label }) => {
              const bonus = calculateSavingThrowBonus(key);
              const isProficient = data.savingThrows[key as keyof typeof data.savingThrows].proficient;
              
              return (
                <div key={key} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isProficient}
                      onCheckedChange={(checked) => updateSavingThrow(key, checked as boolean)}
                    />
                    <span className="font-medium">{label}</span>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Навыки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Навыки</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS_CONFIG.map(({ key, label, ability }) => {
              const skill = data.skills[key as keyof typeof data.skills];
              const bonus = calculateSkillBonus(key);
              
              return (
                <div key={key} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={skill.proficient}
                          onCheckedChange={(checked) => updateSkill(key, 'proficient', checked as boolean)}
                        />
                        <span className="text-xs text-muted-foreground">Владение</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={skill.expertise}
                          onCheckedChange={(checked) => updateSkill(key, 'expertise', checked as boolean)}
                          disabled={!skill.proficient}
                        />
                        <span className="text-xs text-muted-foreground">Экспертиза</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground uppercase">({ability})</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}