"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up Auth.js sign in
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-center text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground focus:border-accent-light focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground focus:border-accent-light focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-accent py-2 font-medium hover:bg-accent-light"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account? Sign up with the same form.
      </p>
    </div>
  );
}
