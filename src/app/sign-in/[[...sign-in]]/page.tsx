import { SignIn } from "@clerk/nextjs";
import ShaderBackground from "@/components/gradients/mesh";

export default function Page() {
    return (
        <div className="grid place-items-center">
            <ShaderBackground />
            <SignIn />
        </div>
    );
}
