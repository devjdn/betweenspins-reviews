interface CircularCharacterCounterProps {
    current: number;
    max: number;
    size?: number;
}

export function CircularCharacterCounter({
    current,
    max,
    size = 32, // smaller default
}: CircularCharacterCounterProps) {
    const percentage = Math.min((current / max) * 100, 100);
    const remaining = Math.max(max - current, 0);
    const radius = (size - 4) / 2; // thinner margin
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getStrokeColor = () => {
        if (percentage <= 50) return "stroke-green-500";
        if (percentage <= 80) return "stroke-yellow-500";
        return "stroke-red-500";
    };

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-muted-foreground/20"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-300 ease-in-out ${getStrokeColor()}`}
                    strokeLinecap="round"
                />
            </svg>
            {/* Center text showing remaining characters */}
            <div className="absolute -translate-1/2 left-1/2 top-1/2 flex items-center justify-center text-[10px] font-medium text-muted-foreground tabular-nums">
                {remaining}
            </div>
        </div>
    );
}
