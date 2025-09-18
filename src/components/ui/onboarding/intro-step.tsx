"use client";

import React from "react";
import { motion } from "motion/react";
import StepHeader from "./step-header";

export type IntroStepHandle = {
    submit: () => void;
    canSubmit: boolean;
};

interface IntroStepProps {
    onComplete: () => void;
    onValidityChange?: (isValid: boolean) => void;
}

const IntroStep = React.forwardRef<IntroStepHandle, IntroStepProps>(
    function IntroStep({ onComplete, onValidityChange }: IntroStepProps, ref) {
        // Always allow continue; submission just calls onComplete
        React.useImperativeHandle(
            ref,
            () => ({
                submit: () => onComplete(),
                get canSubmit() {
                    return true;
                },
            }),
            [onComplete]
        );
        React.useEffect(() => {
            onValidityChange?.(true);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return (
            <motion.div
                className="flex flex-col flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                key={"intro"}
            >
                <StepHeader
                    title="Make Your Profile Yours"
                    description={
                        "Personalize your appearance on Between Spins. You can give yourself a bio, as well as pick 5 your favourite artists to appear on your profile (powered by Spotify)."
                    }
                />
                <div className="flex-1" />
            </motion.div>
        );
    }
);

export default IntroStep;
