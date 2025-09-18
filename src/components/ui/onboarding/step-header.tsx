interface StepHeaderProps {
    title: string;
    description: string;
}

export default function StepHeader({ title, description }: StepHeaderProps) {
    return (
        <header className="space-y-2">
            <h1 className="font-semibold tracking-tight text-2xl md:text-3xl">
                {title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-snug max-4-prose">
                {description}
            </p>
        </header>
    );
}
