export function getElementByClassName(
  classNames: string,
  baseElement?: Element | Document | undefined,
) {
  baseElement ??= document;
  const elements = baseElement.getElementsByClassName(classNames);
  return elements.length === 0 ? undefined : (elements[0] as HTMLElement);
}

export function getElementsByClassName(
  classNames: string,
  baseElement?: Element | Document | undefined,
) {
  baseElement ??= document;
  return Array.from(baseElement.getElementsByClassName(classNames)) as HTMLElement[];
}

export const _$ = getElementByClassName;
export const _$$ = getElementsByClassName;
