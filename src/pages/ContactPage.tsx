import { type FormEvent, useState } from "react";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { useToast } from "../hooks/useToast.ts";

export function ContactPage() {
  usePageTitle("Contact");
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      showToast("Add your name, email, and a short message.");
      return;
    }
    showToast("The contact desk is not on the API yet, so this message was not sent.");
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Write to the team.</h1>
        <p className="mt-4 max-w-md leading-7 text-muted">
          Use this for catalogue questions and event briefs. Delivery starts when the contact
          endpoint is available.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-line bg-white p-6">
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-ink"
            required
          />
        </label>
        <Button type="submit">Send message</Button>
      </form>
    </section>
  );
}
