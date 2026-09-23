import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z])/, {
    message: 'Include an uppercase letter, a lowercase letter, and a number or symbol',
  });

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Too short').max(50),
    lastName: z.string().min(2, 'Too short').max(50),
    email: z.string().email('Enter a valid email'),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
