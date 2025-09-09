interface CircularCharacterCounterProps {
    current: number;
    max: number;
    size?: number;
}

export function CircularCharacterCounter({
    current,
    max,
    size = 60,
}: CircularCharacterCounterProps) {
    const percentage = Math.min((current / max) * 100, 100);
    const remaining = Math.max(max - current, 0);
    const radius = (size - 8) / 2;
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
                    strokeWidth="4"
                    fill="transparent"
                    className="text-muted-foreground/20"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-300 ease-in-out ${getStrokeColor()}`}
                    strokeLinecap="round"
                />
            </svg>
            {/* Center text showing remaining characters */}
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground">
                {remaining}
            </div>
        </div>
    );
}
