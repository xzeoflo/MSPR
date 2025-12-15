// components/ui/LoginForm.tsx

import { Lock, Mail } from 'lucide-react';
import Card from '@/components/ui/card/Card';
import InputField from '@/components/ui/input/InputField';
import Button from '@/components/ui/button/Button';

export default function LoginForm() {

  return (
    <Card
      title="Login"
      description="access to the dashboard"
    >
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

        <Button
          title="Login"
        />

      </form>

      <p className="px-8 text-center text-sm text-stone-400">
        <a href="#" className="hover:text-green-300 underline underline-offset-4">
          forgot password ?
        </a>
      </p>
    </Card>
  );
}
