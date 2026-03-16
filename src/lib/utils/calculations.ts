
export type ResultStatus = 'pending' | 'won' | 'lost' | 'void';

export interface PerformanceStats {
  hitRate: number;
  avgOdds: string;
  roi: string;
  winCount: number;
  lossCount: number;
  voidCount: number;
  totalSettled: number;
  streak: {
    type: 'win' | 'loss' | null;
    count: number;
  };
}

/**
 * Standardizes performance calculations across the platform.
 * Handles void picks, pending statuses, and mixed result states.
 */
export function calculatePerformance(picks: any[]): PerformanceStats {
  if (!picks || picks.length === 0) {
    return {
      hitRate: 0,
      avgOdds: '0.00',
      roi: '0.0',
      winCount: 0,
      lossCount: 0,
      voidCount: 0,
      totalSettled: 0,
      streak: { type: null, count: 0 }
    };
  }

  const settledPicks = picks.filter(p => p.result_status !== 'pending');
  const wonPicks = settledPicks.filter(p => p.result_status === 'won');
  const lostPicks = settledPicks.filter(p => p.result_status === 'lost');
  const voidPicks = settledPicks.filter(p => p.result_status === 'void');
  
  const totalSettled = wonPicks.length + lostPicks.length; // ROI/HitRate usually exclude voids
  const hitRate = totalSettled > 0 ? Math.round((wonPicks.length / totalSettled) * 100) : 0;
  
  const avgOdds = wonPicks.length > 0 
    ? (wonPicks.reduce((acc, p) => acc + Number(p.odds), 0) / wonPicks.length).toFixed(2) 
    : '0.00';

  // ROI Calculation: ((Total Returns - Total Stakes) / Total Stakes) * 100
  // Returns: Sum of odds for won picks (assuming 1 unit stake)
  // Stakes: Total settled picks (won + lost)
  const totalReturn = wonPicks.reduce((acc, p) => acc + Number(p.odds), 0);
  const totalStake = totalSettled;
  const roiValue = totalStake > 0 ? ((totalReturn - totalStake) / totalStake) * 100 : 0;
  const roi = roiValue.toFixed(1);

  // Current Streak Calculation
  let streakType: 'win' | 'loss' | null = null;
  let streakCount = 0;
  
  // Sort by date descending to get latest first
  const sortedPicks = [...settledPicks].sort((a, b) => 
    new Date(b.created_at || b.settled_at).getTime() - new Date(a.created_at || a.settled_at).getTime()
  );

  for (const pick of sortedPicks) {
    if (pick.result_status === 'void') continue;
    
    if (streakType === null) {
      streakType = pick.result_status === 'won' ? 'win' : 'loss';
      streakCount = 1;
    } else if (
      (streakType === 'win' && pick.result_status === 'won') || 
      (streakType === 'loss' && pick.result_status === 'lost')
    ) {
      streakCount++;
    } else {
      break;
    }
  }

  return {
    hitRate,
    avgOdds,
    roi,
    winCount: wonPicks.length,
    lossCount: lostPicks.length,
    voidCount: voidPicks.length,
    totalSettled,
    streak: { type: streakType, count: streakCount }
  };
}
