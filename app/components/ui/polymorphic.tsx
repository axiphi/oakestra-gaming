import {
  ComponentProps,
  ElementType,
  FC,
  JSXElementConstructor,
  ReactNode,
} from "react";

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

type PolymorphableComponent<
  InProps,
  OutProps,
  DefaultComponent extends PolymorphicComponentBase<
    InProps,
    OutProps,
    ComponentProps<DefaultComponent>
  >,
> = FC<
  Omit<ComponentProps<DefaultComponent>, keyof InProps | keyof OutProps> &
    InProps
> & {
  as: PolymorphicComponent<InProps, OutProps>;
};

type PolymorphicComponent<InProps, OutProps> = <
  Component extends PolymorphicComponentBase<
    InProps,
    OutProps,
    ComponentProps<Component>
  >,
>(
  component: Component,
) => FC<
  Omit<ComponentProps<Component>, keyof InProps | keyof OutProps> & InProps
>;

type PolymorphicComponentBase<InProps, OutProps, BaseProps> = Exclude<
  keyof InProps,
  keyof OutProps
> &
  keyof BaseProps extends never
  ? RequiredKeys<OutProps> extends keyof BaseProps
    ? OutProps extends Pick<BaseProps, keyof OutProps & keyof BaseProps>
      ? ElementType
      : never
    : never
  : never;

type IncompatiblePropKeys<InProps, OutProps> = keyof {
  [K in keyof InProps as K extends keyof OutProps
    ? InProps[K] extends OutProps[K]
      ? never
      : K
    : K]: K;
} &
  keyof InProps;

type Permutations<T, TInitial = T> = T extends infer TSingle
  ?
      | [TSingle]
      | (Permutations<Exclude<TInitial, TSingle>> extends infer TPermutation
          ? TPermutation extends unknown[]
            ? [T | TPermutation[number]]
            : never
          : never)
  : never;

type PropPermutations<Props, InProps, OutProps> =
  Permutations<keyof OutProps> extends infer TPermutation
    ? TPermutation extends [infer P extends keyof Props]
      ? Omit<Props, IncompatiblePropKeys<InProps, OutProps> | P> &
          Omit<
            OutProps,
            Exclude<keyof InProps, IncompatiblePropKeys<InProps, OutProps> | P>
          >
      : never
    : never;

type PolymorphicRenderFunction<InProps, OutProps> = <Props extends InProps>(
  props: Props,
  Component: JSXElementConstructor<
    | (Omit<Props, IncompatiblePropKeys<InProps, OutProps>> &
        Omit<
          OutProps,
          Exclude<keyof InProps, IncompatiblePropKeys<InProps, OutProps>>
        >)
    | PropPermutations<Props, InProps, OutProps>
  >,
) => ReactNode;

export function createPolymorphicComponent<InProps, OutProps>(
  render: PolymorphicRenderFunction<InProps, OutProps>,
): PolymorphicComponent<InProps, OutProps>;

export function createPolymorphicComponent<
  InProps,
  OutProps,
  DefaultComponent extends PolymorphicComponentBase<
    InProps,
    OutProps,
    ComponentProps<DefaultComponent>
  >,
>(
  render: PolymorphicRenderFunction<InProps, OutProps>,
  defaultComponent: DefaultComponent,
): PolymorphableComponent<InProps, OutProps, DefaultComponent>;

export function createPolymorphicComponent<
  InProps,
  OutProps,
  DefaultComponent extends PolymorphicComponentBase<
    InProps,
    OutProps,
    ComponentProps<DefaultComponent>
  >,
>(
  render: PolymorphicRenderFunction<InProps, OutProps>,
  defaultComponent?: DefaultComponent,
):
  | PolymorphicComponent<InProps, OutProps>
  | PolymorphableComponent<InProps, OutProps, DefaultComponent> {
  const polymorphic: PolymorphicComponent<InProps, OutProps> =
    (component) => (props) => {
      // @ts-expect-error there's no way to get the types actually working here because of primitive elements
      return render(component, props);
    };
  if (defaultComponent === undefined) {
    return polymorphic;
  }

  return Object.assign(polymorphic(defaultComponent), { as: polymorphic });
}
