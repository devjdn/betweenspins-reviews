type BetweenSpinsLogoProps = {
    size?: number; // display size in px
    className?: string;
};

export const BetweenSpinsLogo = ({
    size = 32,
    className,
}: BetweenSpinsLogoProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        className={className}
    >
        <mask id="cutout">
            {/* Full outer circle fills entire viewBox */}
            <circle cx="64" cy="64" r="64" fill="white" />
            {/* Center hole */}
            <circle cx="64" cy="64" r="16" fill="black" />
            {/* Diagonal cut */}
            <path
                d="M108 20 L72 56"
                stroke="black"
                strokeWidth="8"
                strokeLinecap="round"
            />
        </mask>

        {/* Foreground circle using the mask */}
        <circle
            cx="64"
            cy="64"
            r="64"
            fill="currentColor"
            mask="url(#cutout)"
        />
    </svg>
);
