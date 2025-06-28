
'use client';

import { NumberField } from '@/components/ui/form-fields/number-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Character } from '@/components/shared/types';

interface AbilitiesColumnProps {
  character: Character;
  onChange: (character: Character) => void;
}

const ABILITIES = [
  {
    key: 'str',
    label: 'СИЛА',
    skills: [
      { key: 'athletics', label: 'АТЛЕТИКА' }
    ]
  },
  {
    key: 'dex',
    label: 'ЛОВКОСТЬ',
    skills: [
      { key: 'acrobatics', label: 'АКРОБАТИКА' },
      { key: 'sleightOfHand', label: 'ЛОВКОСТЬ РУК' },
      { key: 'stealth', label: 'СКРЫТНОСТЬ' }
    ]
  },
  {
    key: 'con',
    label: 'ТЕЛОСЛОЖЕНИЕ',
    skills: []
  },
  {
    key: 'int',
    label: 'ИНТЕЛЛЕКТ',
    skills: [
      { key: 'arcana', label: 'МАГИЯ' },
      { key: 'history', label: 'ИСТОРИЯ' },
      { key: 'investigation', label: 'РАССЛЕДОВАНИЕ' },
      { key: 'nature', label: 'ПРИРОДА' },
      { key: 'religion', label: 'РЕЛИГИЯ' }
    ]
  },
  {
    key: 'wis',
    label: 'МУДРОСТЬ',
    skills: [
      { key: 'perception', label: 'ВОСПРИЯТИЕ' },
      { key: 'survival', label: 'ВЫЖИВАНИЕ' },
      { key: 'medicine', label: 'МЕДИЦИНА' },
      { key: 'insight', label: 'ПРОНИЦАТЕЛЬНОСТЬ' },
      { key: 'animalHandling', label: 'УХОД ЗА ЖИВОТНЫМИ' }
    ]
  },
  {
    key: 'cha',
    label: 'ХАРИЗМА',
    skills: [
      { key: 'performance', label: 'ВЫСТУПЛЕНИЕ' },
      { key: 'intimidation', label: 'ЗАПУГИВАНИЕ' },
      { key: 'deception', label: 'ОБМАН' },
      { key: 'persuasion', label: 'УБЕЖДЕНИЕ' }
    ]
  }
];

export function AbilitiesColumn({ character, onChange }: AbilitiesColumnProps) {
  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const updateAbility = (ability: string, field: string, value: number) => {
    const newCharacter = { ...character };
    (newCharacter.stats as any)[ability][field] = value;
    
    // Автоматически пересчитываем модификатор при изменении базового значения
    if (field === 'base') {
      (newCharacter.stats as any)[ability].modifier = calculateModifier(value);
    }
    
    onChange(newCharacter);
  };

  const updateSavingThrow = (ability: string, proficient: boolean) => {
    const newCharacter = { ...character };
    (newCharacter.savingThrows as any)[ability].proficient = proficient;
    onChange(newCharacter);
  };

  const updateSkill = (skill: string, field: string, value: boolean) => {
    const newCharacter = { ...character };
    (newCharacter.skills as any)[skill][field] = value;
    onChange(newCharacter);
  };

  const calculateSkillBonus = (ability: string, skill: string): number => {
    const abilityMod = character.stats[ability as keyof typeof character.stats].modifier;
    const skillData = character.skills[skill as keyof typeof character.skills];
    
    let bonus = abilityMod;
    if (skillData.proficient) {
      bonus += character.proficiencyBonus;
    }
    if (skillData.expertise) {
      bonus += character.proficiencyBonus;
    }
    
    return bonus;
  };

  const calculateSavingThrowBonus = (ability: string): number => {
    const abilityMod = character.stats[ability as keyof typeof character.stats].modifier;
    const savingThrow = character.savingThrows[ability as keyof typeof character.savingThrows];
    
    return abilityMod + (savingThrow.proficient ? character.proficiencyBonus : 0);
  };

  return (
    <div className="p-2 space-y-1">
      {ABILITIES.map(({ key, label, skills }) => {
        const ability = character.stats[key as keyof typeof character.stats];
        const totalScore = ability.base + ability.temp;
        const modifier = calculateModifier(totalScore);
        const savingThrowBonus = calculateSavingThrowBonus(key);
        
        return (
          <div key={key} className="space-y-1">
            {/* Характеристика */}
            <div className="bg-[#23262D] rounded p-2">
              <div className="text-center mb-2">
                <h3 className="text-sm font-bold text-white mb-1">{label}</h3>
                <div className="text-xl font-bold text-white mb-1">{totalScore}</div>
                <div className="text-sm text-gray-300">
                  {modifier >= 0 ? '+' : ''}{modifier}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs mb-1">
                <button className="bg-[#3B4252] hover:bg-[#434C5E] px-2 py-1 rounded text-white text-xs font-medium">
                  ПРОВЕРКА
                </button>
                <span className="text-white font-mono">
                  {modifier >= 0 ? '+' : ''}{modifier}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Checkbox
                    checked={character.savingThrows[key as keyof typeof character.savingThrows].proficient}
                    onCheckedChange={(checked) => updateSavingThrow(key, checked as boolean)}
                    className="border-gray-500 w-3 h-3"
                  />
                  <button className="bg-[#3B4252] hover:bg-[#434C5E] px-2 py-1 rounded text-white text-xs font-medium">
                    СПАСБРОСОК
                  </button>
                </div>
                <span className="text-white font-mono">
                  {savingThrowBonus >= 0 ? '+' : ''}{savingThrowBonus}
                </span>
              </div>
            </div>

            {/* Навыки */}
            {skills.length > 0 && (
              <div className="space-y-1">
                {skills.map(({ key: skillKey, label: skillLabel }) => {
                  const skill = character.skills[skillKey as keyof typeof character.skills];
                  const bonus = calculateSkillBonus(key, skillKey);
                  
                  return (
                    <div key={skillKey} className="bg-[#4C566A] rounded px-2 py-1 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          checked={skill.proficient}
                          onCheckedChange={(checked) => updateSkill(skillKey, 'proficient', checked as boolean)}
                          className="border-gray-400 w-3 h-3"
                        />
                        <span className="text-white font-medium">{skillLabel}</span>
                      </div>
                      <span className="text-white font-mono">
                        {bonus >= 0 ? '+' : ''}{bonus}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Пассивные чувства */}
      <div className="bg-[#23262D] rounded p-2 mt-2">
        <h4 className="text-xs font-bold text-white mb-2">ПАССИВНЫЕ ЧУВСТВА</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-300">МУДРОСТЬ (ВОСПРИЯТИЕ)</span>
            <span className="text-white font-mono">
              {10 + calculateSkillBonus('wis', 'perception')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">МУДРОСТЬ (ПРОНИЦАТЕЛЬНОСТЬ)</span>
            <span className="text-white font-mono">
              {10 + calculateSkillBonus('wis', 'insight')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">ИНТЕЛЛЕКТ (РАССЛЕДОВАНИЕ)</span>
            <span className="text-white font-mono">
              {10 + calculateSkillBonus('int', 'investigation')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Прочие владения и языки */}
      <div className="bg-[#23262D] rounded p-2">
        <h4 className="text-xs font-bold text-white mb-2">ПРОЧИЕ ВЛАДЕНИЯ И ЯЗЫКИ</h4>
        <div className="text-xs text-gray-300">
          <div>Общий</div>
          <div>Драконий</div>
        </div>
      </div>
    </div>
  );
}
