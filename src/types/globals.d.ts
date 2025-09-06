export {};

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            onboardingStatus?: "not_started" | "completed" | "skipped";
        };
    }
}
