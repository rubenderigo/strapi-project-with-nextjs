"use client";

import Link from "next/link";

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { actions } from "@/actions";
import type { FormState } from "@/validations/auth";

const styles = {
    container: "w-full max-w-md",
    header: "space-y-1",
    title: "text-3xl font-bold text-pink-500",
    content: "space-y-4",
    fieldGroup: "space-y-2",
    footer: "flex flex-col",
    button: "w-full cursor-pointer",
    prompt: "mt-4 text-center text-sm",
    link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
    success: false,
    message: undefined,
    strapiErrors: null,
    zodErrors: null,
    data: { email: '', password: '' }
}

export function SigninForm() {
    const [formState, formAction] = useActionState(actions.auth.loginUserAction, INITIAL_STATE)

    return (
        <div className={styles.container}>
            <form action={formAction}>
                <Card>
                    <CardHeader className={styles.header}>
                        <CardTitle className={styles.title}>Sign In</CardTitle>
                        <CardDescription>
                            Enter your details to sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={styles.content}>
                        <div className={styles.fieldGroup}>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                defaultValue={formState.data?.email ?? ''}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                                defaultValue={formState.data?.password ?? ''}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className={styles.footer}>
                        <Button className={styles.button}>Sign In</Button>
                        {formState.strapiErrors &&
                            <p className="text-pink-500 text-xs italic mt-1 py-2">{formState.strapiErrors.message}</p>
                        }
                    </CardFooter>
                </Card>
                <div className={styles.prompt}>
                    Don&apos;t have an account?
                    <Link className={styles.link} href="signup">
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
}
