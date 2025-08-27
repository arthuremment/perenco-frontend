import { TrendingDown, TrendingUp } from "lucide-react";

const TrendIndicator = ({ currentValue, previousValue, unit = '' }) => {
  if (previousValue === 0 || currentValue === previousValue) {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-500">Stable</span>
      </div>
    );
  }

  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  const isPositive = percentageChange > 0;

  return (
    <div className="flex items-center">
      {isPositive ? (
        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{percentageChange.toFixed(1)}%
      </span>
    </div>
  );
};

export default TrendIndicator;