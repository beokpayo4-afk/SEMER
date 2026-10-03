import { type FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/Button.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Input } from "../../components/Input.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Select } from "../../components/Select.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { deleteCoupon, getCoupons, saveCoupon, type Coupon } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise, rupeesToPaise } from "../../utils/money.ts";

export function CouponsPage() {
  usePageTitle("Admin coupons");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<Coupon["discount_type"]>("percent");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(true);
  const [expires, setExpires] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getCoupons()
      .then((next) => {
        setCoupons(next);
        setError("");
      })
      .catch((reason: unknown) => setError(apiErrorMessage(reason, "Coupons could not be loaded.")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function reset() {
    setEditing(null);
    setCode("");
    setDiscountType("percent");
    setValue("");
    setActive(true);
    setExpires("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const discountValue = discountType === "percent" ? Number(value) : rupeesToPaise(value);
    if (discountValue === undefined || !Number.isInteger(discountValue) || discountValue < 1) {
      setError(discountType === "percent" ? "Enter a percent from 1 to 100." : "Enter a fixed amount in rupees.");
      return;
    }
    try {
      await saveCoupon(
        {
          code,
          discount_type: discountType,
          discount_value: discountValue,
          is_active: active,
          expires_at: expires ? `${expires}T00:00:00Z` : null,
        },
        editing ?? undefined,
      );
      reset();
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The coupon could not be saved."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Coupons</h1>
      <p className="mt-2 text-sm text-muted">A percent is 1–100. A fixed discount is entered in rupees and stored in paise.</p>
      <form onSubmit={(event) => void submit(event)} className="mt-6 grid max-w-xl gap-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input label="Code" value={code} onChange={(event) => setCode(event.target.value)} required />
        <Select
          label="Type"
          value={discountType}
          onChange={(event) => setDiscountType(event.target.value as Coupon["discount_type"])}
          options={[
            { value: "percent", label: "Percent" },
            { value: "fixed", label: "Fixed amount" },
          ]}
        />
        <Input
          label={discountType === "percent" ? "Percent" : "Amount (₹)"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
        />
        <Input label="Expires" type="date" value={expires} onChange={(event) => setExpires(event.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active
        </label>
        <div className="flex gap-3">
          <Button type="submit">{editing ? "Update coupon" : "Add coupon"}</Button>
          {editing ? (
            <button type="button" className="text-sm text-muted" onClick={reset}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      {loading ? <Loading label="Loading coupons" /> : null}
      <ul className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
        {coupons.map((coupon) => (
          <li key={coupon.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p>{coupon.code}</p>
              <p className="text-muted">
                {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : formatPaise(coupon.discount_value)} ·{" "}
                {coupon.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="space-x-3">
              <button
                type="button"
                className="text-wine"
                onClick={() => {
                  setEditing(coupon.id);
                  setCode(coupon.code);
                  setDiscountType(coupon.discount_type);
                  setValue(
                    coupon.discount_type === "percent" ? String(coupon.discount_value) : String(coupon.discount_value / 100),
                  );
                  setActive(coupon.is_active);
                  setExpires(coupon.expires_at ? coupon.expires_at.slice(0, 10) : "");
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-wine"
                onClick={() => {
                  if (!window.confirm(`Delete ${coupon.code}?`)) {
                    return;
                  }
                  void deleteCoupon(coupon.id).then(load).catch((reason: unknown) => {
                    setError(apiErrorMessage(reason, "The coupon could not be deleted."));
                  });
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
