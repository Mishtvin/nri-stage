'use client';

import { useState } from 'react';
import { InputField } from '@/components/ui/form-fields/input-field';
import { TextareaField } from '@/components/ui/form-fields/textarea-field';
import { AddButton } from '@/components/ui/form-fields/add-button';
import { DeleteButton } from '@/components/ui/form-fields/delete-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Character {
  goals?: Goal[];
}

interface GoalsTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function GoalsTab({ character, onChange }: GoalsTabProps) {
  const goals = character.goals || [];

  const updateGoals = (newGoals: Goal[]) => {
    const newCharacter = { ...character, goals: newGoals };
    onChange(newCharacter);
  };

  const updateGoal = (index: number, field: keyof Goal, value: any) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    updateGoals(newGoals);
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: 'Новая цель',
      description: '',
      completed: false,
      priority: 'medium'
    };
    updateGoals([...goals, newGoal]);
  };

  const removeGoal = (index: number) => {
    const newGoals = goals.filter((_, i) => i !== index);
    updateGoals(newGoals);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Цели</h3>
        <AddButton onClick={addGoal} label="Добавить цель" />
      </div>

      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div key={goal.id} className="p-4 bg-[#23262D] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={(checked) => updateGoal(index, 'completed', checked)}
                    className="border-gray-500"
                  />
                  <h4 className={`font-semibold ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {goal.title || 'Новая цель'}
                  </h4>
                  <Badge className={getPriorityColor(goal.priority)}>
                    {getPriorityLabel(goal.priority)}
                  </Badge>
                </div>
                <DeleteButton onClick={() => removeGoal(index)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  label="Название цели"
                  value={goal.title}
                  onChange={(value) => updateGoal(index, 'title', value)}
                  placeholder="Название цели"
                />
                <select
                  value={goal.priority}
                  onChange={(e) => updateGoal(index, 'priority', e.target.value)}
                  className="bg-[#1F2128] border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="low">Низкий приоритет</option>
                  <option value="medium">Средний приоритет</option>
                  <option value="high">Высокий приоритет</option>
                </select>
              </div>
              
              <TextareaField
                label="Описание"
                value={goal.description}
                onChange={(value) => updateGoal(index, 'description', value)}
                placeholder="Подробное описание цели..."
                rows={3}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>В этом разделе пока нет данных</p>
          <AddButton onClick={addGoal} label="Добавить цель" className="mt-4" />
        </div>
      )}
    </div>
  );
}