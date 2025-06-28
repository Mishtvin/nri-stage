'use client';

import { Plus, Minus } from 'lucide-react';

interface Attack {
  name: string;
  type: 'melee' | 'ranged' | 'spell';
  attackBonus: number;
  damage: string;
  damageType: string;
  notes: string;
}

interface Character {
  combat: {
    attacks: Attack[];
  };
}

interface AttacksTabProps {
  character: Character;
  onChange: (character: Character) => void;
}

export function AttacksTab({ character, onChange }: AttacksTabProps) {
  const updateAttack = (index: number, field: keyof Attack, value: any) => {
    const newCharacter = { ...character };
    newCharacter.combat.attacks[index] = { ...newCharacter.combat.attacks[index], [field]: value };
    onChange(newCharacter);
  };

  const addAttack = () => {
    const newAttack: Attack = {
      name: 'Копье дракона',
      type: 'melee',
      attackBonus: 10,
      damage: '1d12+5+2',
      damageType: 'piercing',
      notes: ''
    };
    const newCharacter = { ...character };
    newCharacter.combat.attacks = [...newCharacter.combat.attacks, newAttack];
    onChange(newCharacter);
  };

  const removeAttack = (index: number) => {
    const newCharacter = { ...character };
    newCharacter.combat.attacks = newCharacter.combat.attacks.filter((_, i) => i !== index);
    onChange(newCharacter);
  };

  return (
    <div className="p-3">
      {/* Заголовок с кнопкой добавить */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">АТАКИ И ЗАКЛИНАНИЯ</h3>
        <button
          onClick={addAttack}
          className="w-6 h-6 bg-[#5F7ADB] hover:bg-[#4C6EF5] text-white rounded flex items-center justify-center"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {character.combat.attacks.length > 0 ? (
        <div className="space-y-1">
          {/* Заголовок таблицы */}
          <div className="grid grid-cols-12 gap-1 text-xs text-gray-400 font-medium pb-1">
            <div className="col-span-5">НАЗВАНИЕ</div>
            <div className="col-span-2 text-center">БОНУС</div>
            <div className="col-span-4 text-center">УРОН / ВИД</div>
            <div className="col-span-1"></div>
          </div>

          {/* Атаки */}
          {character.combat.attacks.map((attack, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={attack.name}
                  onChange={(e) => updateAttack(index, 'name', e.target.value)}
                  className="w-full bg-[#4C566A] border-0 rounded px-2 py-1 text-white text-xs"
                />
              </div>
              
              <div className="col-span-2">
                <div className="bg-[#4C566A] rounded px-2 py-1 text-center">
                  <span className="text-white font-mono text-sm font-bold">
                    {attack.attackBonus >= 0 ? '+' : ''}{attack.attackBonus}
                  </span>
                </div>
              </div>

              <div className="col-span-4">
                <input
                  type="text"
                  value={attack.damage}
                  onChange={(e) => updateAttack(index, 'damage', e.target.value)}
                  className="w-full bg-[#4C566A] border-0 rounded px-2 py-1 text-white text-xs text-center"
                />
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => removeAttack(index)}
                  className="w-4 h-4 text-red-400 hover:text-red-300 flex items-center justify-center"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm mb-3">В этом разделе пока нет данных</p>
          <button
            onClick={addAttack}
            className="px-4 py-2 bg-[#5F7ADB] hover:bg-[#4C6EF5] text-white rounded text-sm"
          >
            Добавить атаку
          </button>
        </div>
      )}

      {/* Блок "Умения и способности" */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">УМЕНИЯ И СПОСОБНОСТИ</h3>
          <button className="w-6 h-6 bg-[#5F7ADB] hover:bg-[#4C6EF5] text-white rounded flex items-center justify-center">
            <Plus className="h-3 w-3" />
          </button>
        </div>
        
        <div className="bg-[#23262D] rounded p-3">
          <div className="text-xs text-gray-300 leading-relaxed">
            <div className="mb-2">
              <strong>Пассивка:</strong> «Воинское Усердие» (1d6 каждую после 3х усп. атак)
            </div>
            <div className="mb-2">
              <strong>Умение:</strong> «Копье дракона » (60ft)
            </div>
            <div className="mb-2">
              <strong>Умение:</strong> «Удар с наскоком» (30ft) радиус 5ft урон 1d12+1d4 огнем
            </div>
            <div className="mb-2">
              <strong>Умение:</strong> «Драконий Щит» снаряды -10 , если в пределах 10фт пиздят контратака ,есть спас перемещение больше 10 фт отменяет
            </div>
            <div>
              <strong>Умение:</strong> «Драконопад» 30ft up 30ft vpеred 4d6 огнем провал - падение, есть спас
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}