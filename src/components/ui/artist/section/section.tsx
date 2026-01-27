import ArtistSectionHeader, { ArtistSectionHeaderProps } from "./header";

export type ArtistSectionProps = ArtistSectionHeaderProps & {
    children: React.ReactNode;
};

export default function ArtistSection({
    children,
    title,
    link,
}: ArtistSectionProps) {
    return (
        <section className="space-y-4">
            <ArtistSectionHeader title={title} link={link} />
            {children}
        </section>
    );
}
