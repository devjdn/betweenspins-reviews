import { SignIn } from "@clerk/nextjs";
import ShaderBackground from "@/components/gradients/mesh";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="grid place-items-center pt-16">
            <ShaderBackground />
            <Suspense>
                <SignIn />
            </Suspense>
        </div>
    );
}
