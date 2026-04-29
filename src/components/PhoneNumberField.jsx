"use client";

function getLocalPhoneValue(value = "") {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length > 10) {
    return digits.slice(2, 12);
  }

  return digits.slice(-10);
}

export function buildIndianPhoneNumber(localNumber = "") {
  const digits = localNumber.replace(/\D/g, "").slice(0, 10);
  return digits ? `+91${digits}` : "";
}

export function PhoneNumberField({
  label = "Phone number",
  value,
  onChange,
  required = false,
  placeholder = "98765 43210",
  name,
}) {
  const localNumber = getLocalPhoneValue(value);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
        {label}
      </label>
      <div className="flex overflow-hidden rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] transition focus-within:border-[#d88b76] focus-within:ring-4 focus-within:ring-[#f4dfd7]">
        <div className="flex min-w-[76px] items-center justify-center border-r border-[#e6d3cb] bg-[#fbf3ef] px-4 text-sm font-semibold text-[#7c6057]">
          +91
        </div>
        <input
          type="tel"
          name={name}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          required={required}
          value={localNumber}
          onChange={(event) =>
            onChange(event.target.value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder={placeholder}
          className="w-full px-4 py-3.5 text-[#2f2622] outline-none"
        />
      </div>
    </div>
  );
}
