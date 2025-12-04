import { SignUp } from "@clerk/nextjs";

export default async function Page() {
    return (
        <div className="grid place-items-center pt-16">
            <SignUp />
        </div>
    );
}
