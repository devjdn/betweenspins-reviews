type BetweenSpinsLogoProps = {
    size?: number; // size in px (width & height)
};

export const BetweenSpinsLogo = ({ size = 30 }: BetweenSpinsLogoProps) => {
    // scale stroke width based on size (relative to 30 base size)
    const strokeWidth = (2.5 / 30) * size;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 30 30"
        >
            <mask id="cutout">
                {/* Full outer circle */}
                <circle cx="15" cy="15" r="12" fill="white" />

                {/* Center hole */}
                <circle cx="15" cy="15" r="3" fill="black" />

                {/* Diagonal cut line */}
                <path
                    d="M23.49 6.51 L16.82 13.18"
                    stroke="black"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </mask>

            {/* Circle with cutouts (foreground color) */}
            <circle
                cx="15"
                cy="15"
                r="12"
                fill="currentColor"
                mask="url(#cutout)"
            />
        </svg>
    );
};

export default BetweenSpinsLogo;
