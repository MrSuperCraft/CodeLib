"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";
import { Card } from "@/components/ui/card";


const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <Card>
            <div>
                <div className="flex items-center w-full justify-center">
                    {!success && !error && <BeatLoader />}
                    <FormSuccess message={success} />
                    {!success && <FormError message={error} />}
                </div>
            </div>
        </Card>

    );
};


const NewVerificationPage = () => {
    return (
        <>
            <div className="h-screen w-full flex justify-center items-center">
                <NewVerificationForm />

            </div>
        </>
    )
}

export default NewVerificationPage;