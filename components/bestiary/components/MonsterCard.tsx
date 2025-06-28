'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Eye } from 'lucide-react';
import { Monster } from '../types';
import { getChallengeRatingColor } from '../utils/monster-utils';
import { GAME_SYSTEMS } from '../constants';

interface MonsterCardProps {
  monster: Monster;
  onClick?: (monster: Monster) => void;
  className?: string;
}

/**
 * MonsterCard - Displays a monster in card format with key stats
 * 
 * @param monster - The monster data to display
 * @param onClick - Callback when card is clicked
 * @param className - Additional CSS classes
 */
export const MonsterCard = ({ monster, onClick, className }: MonsterCardProps) => {
  const handleClick = () => {
    onClick?.(monster);
  };

  const systemLabel = GAME_SYSTEMS.find(s => s.value === monster.system)?.label || monster.system;

  return (
    <Card 
      className={`bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {monster.imageUrl && (
        <div 
          className="h-32 bg-cover bg-center rounded-t-lg" 
          style={{ backgroundImage: `url(${monster.imageUrl})` }}
        >
          <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-3">
            <Badge className={getChallengeRatingColor(monster.challengeRating)}>
              CR {monster.challengeRating}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-cinzel text-lg group-hover:text-primary transition-colors line-clamp-1">
              {monster.name}
            </CardTitle>
            <CardDescription>
              {monster.size} {monster.type}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/50">
            {systemLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-blue-500" />
            <span>AC {monster.armorClass}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span>{monster.hitPoints.split(' ')[0]} HP</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {monster.alignment}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            {monster.source}
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};