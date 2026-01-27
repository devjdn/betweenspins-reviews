import ShaderBackground from "@/components/shaders/global-shader";

export default function NonMusicRootLayout({children}: {children: React.ReactNode}) {
    return(
        <div className="flex-1 flex px-4 py-8 md:px-8 relative">
            {children}
        </div>
    )
}