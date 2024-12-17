export async function fetchText(url: string) {
  return await (await fetch(url)).text();
}

export async function fetchJson(url: string) {
  return await (await fetch(url)).json();
}
