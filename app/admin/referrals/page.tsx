import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { saveRevolutReferralForm, saveWiseReferralForm } from "@/app/admin/referrals/actions";
import { loadRevolutReferralLive } from "@/lib/partners/revolut-referral-store";
import { loadWiseReferralLive } from "@/lib/partners/wise-referral-store";
import type { RevolutReferralKind } from "@/lib/partners/revolut-referral";

export const dynamic = "force-dynamic";

function RevolutOfferForm({
  kind,
  label,
  url,
  endsOn,
  enabled,
}: {
  kind: RevolutReferralKind;
  label: string;
  url: string;
  endsOn: string;
  enabled: boolean;
}) {
  return (
    <form action={saveRevolutReferralForm} className="rounded-xl border border-slate-200 bg-white p-5">
      <input type="hidden" name="kind" value={kind} />
      <h2 className="font-semibold text-slate-900">{label}</h2>
      <label className="mt-4 block text-sm font-medium text-slate-700">
        URL
        <input
          name="url"
          type="url"
          required
          defaultValue={url}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </label>
      <label className="mt-4 block text-sm font-medium text-slate-700">
        Действует до (включительно, Lisbon)
        <input
          name="ends_on"
          type="date"
          required
          defaultValue={endsOn}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
        <input name="enabled" type="checkbox" defaultChecked={enabled} className="h-4 w-4" />
        Показывать блок
      </label>
      <button type="submit" className="mt-5 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white">
        Сохранить {label.toLowerCase()}
      </button>
    </form>
  );
}

export default async function AdminReferralsPage() {
  const [revolut, wise] = await Promise.all([loadRevolutReferralLive(), loadWiseReferralLive()]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-500">
          <Link href="/admin" className="text-corridor-600 hover:underline">
            ← Admin
          </Link>
        </p>
        <h1 className="mt-3 text-2xl font-bold">Реферальные ссылки</h1>
        <p className="mt-2 text-sm text-slate-600">
          Меняются в Supabase без деплоя. Гайды читают URL при открытии страницы (кэш ~30 сек).
        </p>
        <div className="mt-8 grid gap-6">
          <RevolutOfferForm
            kind="personal"
            label="Revolut · физлицо"
            url={revolut.personal.url}
            endsOn={revolut.personal.endsOn}
            enabled={revolut.personal.enabled}
          />
          <RevolutOfferForm
            kind="business"
            label="Revolut · юрлицо / ИП"
            url={revolut.business.url}
            endsOn={revolut.business.endsOn}
            enabled={revolut.business.enabled}
          />
          <form action={saveWiseReferralForm} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Wise · физлицо</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              URL
              <input
                name="url"
                type="url"
                required
                defaultValue={wise.url}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Действует до (пусто = пока не выключишь)
              <input
                name="ends_on"
                type="date"
                defaultValue={wise.endsOn}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input name="enabled" type="checkbox" defaultChecked={wise.enabled} className="h-4 w-4" />
              Показывать блок
            </label>
            <button type="submit" className="mt-5 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white">
              Сохранить wise
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
