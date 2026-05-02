# `<FormField>` and `<ControlledFormField>` — the canonical form-row primitive

Open this when you need a label + control + (error|hint|helper-text)
triplet. Anywhere a developer is hand-rolling
`<label>` + `<input>` + `<p className="text-destructive">` is a smell
this primitive is supposed to absorb.

Source:
[`@/components/base/forms/form-field`](../../../src/components/base/forms/form-field.tsx).

There are two components and they share the same chrome:

| Component | Use when | Key prop |
| --- | --- | --- |
| `<FormField>` | Pure presentation. Custom controls, autocompletes, third-party widgets, non-controlled inputs. | `error?: string` |
| `<ControlledFormField>` | Bound to react-hook-form. Auto-merges backend + validation errors. | `error?: (name) => string \| undefined` (backend getter), `control`, `rules`, `name` |

## Chrome props (shared)

| Prop | Effect |
| --- | --- |
| `label` | Renders `<Label htmlFor=…>` above the control. Pass `htmlFor` so the click target is correct. |
| `required` / `isRequired` | Shows the red `*` after the label. Both names accepted; pick one. |
| `hint` | Secondary line below when there's no error. |
| `helperText` | Helper line below when there's no error. Wins over `hint` if both set. |
| `error` | (FormField) Error message string. Overrides hint/helper. Renders with `role="alert"` + `aria-live="polite"`. |
| `error` | (ControlledFormField) `(name) => string \| undefined` — backend error getter. **Wins over the validation message** so server-side validation is authoritative. |
| `className` | Wrapper class. The wrapper is `space-y-2.5`; don't override that unless you mean it. |

## Canonical shapes

### Pure presentational form row

```tsx
import { FormField } from '@/components/base/forms';
import { Input } from '@/components/base/forms/fields';

<FormField label="Email" htmlFor="email" required hint="We never share this">
  <Input id="email" value={value} onChange={setValue} />
</FormField>
```

### react-hook-form-bound row

```tsx
import { ControlledFormField } from '@/components/base/forms';
import { Input } from '@/components/base/forms/fields';

<ControlledFormField
  name="email"
  control={control}
  error={getError}                                  /* backend getter */
  rules={{ required: true, pattern: /^\S+@\S+$/i }} /* RHF rules */
  label="Email"
  required
>
  {(field, error, invalid) => (
    <Input
      placeholder="you@example.com"
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      invalid={invalid}
    />
  )}
</ControlledFormField>
```

The render function gets `(field, error, invalid, fieldState)`:

- `field` — react-hook-form's `ControllerRenderProps`: `{ value, onChange, onBlur, name, ref }`. Spread or destructure.
- `error` — the merged error string (backend wins, otherwise validation message). Already shown by the wrapper; useful if your control renders inline error styling.
- `invalid` — boolean. **Pass to the input as `invalid={invalid}`** and let the field wrapper flip border + ring. Don't apply error styling yourself.
- `fieldState` — escape hatch with `touched`, `dirty`, `isTouched`, `isDirty`, etc.

### Custom control (combobox, file picker, autocomplete)

```tsx
<ControlledFormField
  name="ownerId"
  control={control}
  error={getError}
  label="Owner"
  required
>
  {(field, _error, invalid) => (
    <UserCombobox
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      invalid={invalid}
    />
  )}
</ControlledFormField>
```

Anything that exposes a controlled `value` / `onChange` plays.

## When to reach for it

- Every form input the library renders. No exceptions for "small" forms.
- Inline edit cells inside tables (use `FormField`, not the controlled
  variant — the table already manages state).
- Dialog forms: pair with `<Dialog formId="…">` so the Confirm button
  submits the form.

## When NOT to reach for it

- **Buttons / links / actions** — those aren't fields.
- **Read-only display rows** — that's `<Item>` /
  [`item-pattern.md`](item-pattern.md).
- **Search inputs in command-menu popovers** — use the existing
  command-menu primitive (`base/command/Command`) which has its own
  search input contract.

## Errors come from where?

`ControlledFormField` resolves the error in this order:

1. `errorGetter(name)` — the backend / Inertia error getter, if it returns a non-empty string.
2. `fieldState.error?.message` — react-hook-form validation message.
3. `'<label> is required'` if `fieldState.error.type === 'required'` (auto-generated from `label` prop).
4. `'Invalid value'` fallback for any other validation type without a message.

So **backend errors authoritatively override validation**. Always wire
`error={getError}` for forms that submit to a server.

## Don'ts

- Don't hand-roll `<label>` + `<input>` + `<p className="text-destructive">…</p>`
  triplets. That's exactly what this exists to absorb.
- Don't pass `aria-invalid` or `data-invalid` to the input — pass
  `invalid={invalid}` and the field wrapper does it.
- Don't mix `<FormField>` and `<ControlledFormField>` for the same
  input — pick one based on whether you have an RHF `control` to bind.
- Don't reach for shadcn `<Field>` directly. The shadcn `Field` primitive
  is there but our wrapper is the canonical entry point per rule 1.
- Don't put the label inside the children render-prop of
  `<ControlledFormField>` — pass `label` as a chrome prop. The wrapper
  renders it with the right `htmlFor` automatically.

## Pairs with the strings pattern (rule 8)

Form labels and validation messages flow through `useStrings` at the
**call site**. The form field doesn't own them. Example:

```tsx
const strings = useStrings(defaultUserFormStrings, stringsProp);

<ControlledFormField
  name="email"
  control={control}
  error={getError}
  label={strings.emailLabel}
  required
>
  {(field, _e, invalid) => (
    <Input value={field.value ?? ''} onChange={field.onChange} invalid={invalid} />
  )}
</ControlledFormField>
```
