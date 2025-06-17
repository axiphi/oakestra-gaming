import * as React from "react";
import { LabelHTMLAttributes } from "react";
import { Radio } from "@base-ui-components/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui-components/react/radio-group";

import { cn } from "~/lib/cn";
import { Card } from "~/components/ui/card";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseRadioGroup>
>(({ className, ...props }, ref) => (
  <BaseRadioGroup
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Radio.Root>
>(({ className, ...props }, ref) => (
  <Radio.Root
    ref={ref}
    className={cn(
      "peer flex size-4 items-center justify-center rounded-full border focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary",
      className,
    )}
    {...props}
  >
    <Radio.Indicator className="flex before:size-2.5 before:rounded-full before:bg-primary data-unchecked:hidden" />
  </Radio.Root>
));
RadioGroupItem.displayName = "RadioGroupItem";

const RadioGroupCardItem = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Radio.Root>, "render">
>(({ className, ...props }, ref) => (
  <Radio.Root
    ref={ref}
    className={cn(
      "focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary",
      className,
    )}
    render={(cardProps) => (
      <Card
        render={(buttonProps) => <button {...buttonProps} />}
        {...cardProps}
      />
    )}
    {...props}
  />
));
RadioGroupCardItem.displayName = "RadioGroupCardItem";

const RadioGroupCardLabel = React.forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-base font-semibold", className)}
    {...props}
  />
));
RadioGroupCardLabel.displayName = "RadioGroupCardLabel";

export { RadioGroup, RadioGroupItem, RadioGroupCardItem, RadioGroupCardLabel };
