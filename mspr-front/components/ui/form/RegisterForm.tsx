// components/ui/LoginForm.tsx
import { Lock, Mail } from 'lucide-react';
import InputField from '@/components/ui/input/InputField';
import Button from '@/components/ui/button/Button';

export default function RegisterForm() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">
        Register
      </h1>
      <form className="space-y-4">

        <InputField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          placeholder="email@exemple.com"
          required
        />

        <InputField
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
        />
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
        />
        <p className="px-8 text-center text-sm text-stone-400">
          <a href="#" className="hover:text-neutral-200 duration-300 underline underline-offset-4">
            Already have an account ?
          </a>
        </p>
        <Button
          title="Sign Up"
        />
      </form>

    </div>
  );
}
