import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

async function setAdminCookie(secret: string) {
  "use server";
  const expected = process.env.EMIGRO_ADMIN_SECRET?.trim();
  if (!expected || secret !== expected) return { ok: false as const };
  cookies().set("emigro_admin", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return { ok: true as const };
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  const secretConfigured = Boolean(process.env.EMIGRO_ADMIN_SECRET?.trim());

  async function login(formData: FormData) {
    "use server";
    const secret = String(formData.get("secret") ?? "");
    const from = String(formData.get("from") ?? "/admin");
    const result = await setAdminCookie(secret);
    if (!result.ok) {
      redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
    }
    redirect(from.startsWith("/admin") ? from : "/admin");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Вход в админку</h1>
        {!secretConfigured ? (
          <p className="mt-4 text-sm text-amber-800">EMIGRO_ADMIN_SECRET не настроен на сервере.</p>
        ) : (
          <form action={login} className="mt-6 space-y-4">
            <input type="hidden" name="from" value={searchParams.from ?? "/admin"} />
            <label className="block text-sm font-medium">
              Секрет
              <input
                type="password"
                name="secret"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                autoComplete="current-password"
              />
            </label>
            {searchParams.error && <p className="text-sm text-red-600">Неверный секрет</p>}
            <button type="submit" className="rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white">
              Войти
            </button>
          </form>
        )}
        <p className="mt-8 text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            ← На сайт
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
