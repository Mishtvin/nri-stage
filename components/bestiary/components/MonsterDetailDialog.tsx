'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Heart, Zap, ExternalLink } from 'lucide-react';
import { Monster } from '../types';
import { getChallengeRatingColor, getAbilityModifier } from '../utils/monster-utils';
import { GAME_SYSTEMS } from '../constants';

interface MonsterDetailDialogProps {
  monster: Monster | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MonsterDetailDialog - Detailed view of a monster in a modal dialog
 */
export const MonsterDetailDialog = ({ monster, isOpen, onClose }: MonsterDetailDialogProps) => {
  if (!monster) return null;

  const systemLabel = GAME_SYSTEMS.find(s => s.value === monster.system)?.label || monster.system;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="font-cinzel text-2xl">{monster.name}</DialogTitle>
              <DialogDescription className="text-lg">
                {monster.size} {monster.type}, {monster.alignment}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getChallengeRatingColor(monster.challengeRating)}>
                CR {monster.challengeRating}
              </Badge>
              <Badge variant="outline">
                {systemLabel}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Armor Class:</span>
                <span>{monster.armorClass}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-semibold">Hit Points:</span>
                <span>{monster.hitPoints}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Speed:</span>
                <span>{monster.speed}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ability Scores */}
          <div>
            <h3 className="font-cinzel font-semibold text-lg mb-3">Характеристики</h3>
            <div className="grid grid-cols-6 gap-4">
              {Object.entries(monster.stats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <div className="font-semibold uppercase text-sm">{stat}</div>
                  <div className="text-lg font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground">({getAbilityModifier(value)})</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Stats */}
          <div className="space-y-2 text-sm">
            {monster.savingThrows && (
              <div><span className="font-semibold">Saving Throws:</span> {monster.savingThrows}</div>
            )}
            {monster.skills && (
              <div><span className="font-semibold">Skills:</span> {monster.skills}</div>
            )}
            {monster.damageResistances && (
              <div><span className="font-semibold">Damage Resistances:</span> {monster.damageResistances}</div>
            )}
            {monster.damageImmunities && (
              <div><span className="font-semibold">Damage Immunities:</span> {monster.damageImmunities}</div>
            )}
            {monster.conditionImmunities && (
              <div><span className="font-semibold">Condition Immunities:</span> {monster.conditionImmunities}</div>
            )}
            <div><span className="font-semibold">Senses:</span> {monster.senses}</div>
            <div><span className="font-semibold">Languages:</span> {monster.languages}</div>
          </div>

          <Separator />

          {/* Abilities */}
          {monster.abilities.length > 0 && (
            <div>
              <h3 className="font-cinzel font-semibold text-lg mb-3">Способности</h3>
              <div className="space-y-3">
                {monster.abilities.map((ability, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{ability.name}</h4>
                    <p className="text-sm text-muted-foreground">{ability.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div>
            <h3 className="font-cinzel font-semibold text-lg mb-3">Действия</h3>
            <div className="space-y-3">
              {monster.actions.map((action, index) => (
                <div key={index}>
                  <h4 className="font-semibold">{action.name}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legendary Actions */}
          {monster.legendaryActions && monster.legendaryActions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-cinzel font-semibold text-lg mb-3">Легендарные действия</h3>
                <div className="space-y-3">
                  {monster.legendaryActions.map((action, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">{action.name}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Source */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Источник: {monster.source}
            </div>
            {monster.sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={monster.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть источник
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};