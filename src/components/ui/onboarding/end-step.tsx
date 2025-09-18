"use client";

import React from "react";
import { Loader2, FastForward, Play, Rewind } from "lucide-react";
import { motion } from "motion/react";
import StepHeader from "./step-header";

export type EndStepHandle = {
    submit: () => void;
    canSubmit: boolean;
};

type EndStepProps = {
    onComplete: () => void;
    onValidityChange?: (isValid: boolean) => void;
};

const EndStep = React.forwardRef<EndStepHandle, EndStepProps>(function EndStep(
    { onComplete, onValidityChange }: EndStepProps,
    ref
) {
    const handleSubmit = () => {
        onComplete();
    };
    React.useImperativeHandle(
        ref,
        () => ({
            submit: handleSubmit,
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
            className="flex flex-col flex-1 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            key={"bio"}
        >
            <StepHeader
                title={"You're all set"}
                description={
                    "Go take a look at your profile, or get straight to rating!"
                }
            />
            <div className="flex-1"></div>
        </motion.div>
    );
});

export default EndStep;
