import { BetweenSpinsLogo } from "@/components/logo";

export default function NotFound() {
    return (
        <div className="flex-1 grid place-items-center @container">
            <div className="">
                <BetweenSpinsLogo size={64} />
            </div>
            <div>
                <h1 className="font-semibold @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty"></h1>
            </div>
        </div>
    );
}
