export interface DesignToken {
  name: string;
  value: string;
  source: string;
  scope: string;
}

export interface CssRecipe {
  selector: string;
  declarations: Array<{
    property: string;
    value: string;
  }>;
}

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactCssValue(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function extractDesignTokens(
  css: string,
  scope: string,
  source: string,
): DesignToken[] {
  const selector = escapeForRegExp(scope);
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`));

  if (!block?.[1]) {
    return [];
  }

  const withoutComments = block[1].replace(/\/\*[\s\S]*?\*\//g, "");

  return Array.from(
    withoutComments.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi),
    ([, name = "", value = ""]) => ({
      name,
      value: compactCssValue(value),
      source,
      scope,
    }),
  );
}

export function extractCssRecipe(css: string, selector: string): CssRecipe {
  const escapedSelector = escapeForRegExp(selector);
  const block = css.match(
    new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`),
  );
  const declarations = block?.[1]
    ? Array.from(
        block[1].matchAll(/([a-z-]+)\s*:\s*([^;]+);/gi),
        ([, property = "", value = ""]) => ({
          property,
          value: compactCssValue(value),
        }),
      )
    : [];

  return { selector, declarations };
}

export function getComponentExports(source: string, fallbackName: string) {
  const names = Array.from(
    source.matchAll(/export\s*\{([\s\S]*?)\}(?:\s*from\s*["'][^"']+["'])?;/g),
  ).flatMap(([, exportList = ""]) =>
    exportList
      .split(",")
      .map((item) => item.replace(/\/\/.*$/g, "").trim())
      .filter(Boolean)
      .map((item) => {
        const alias = item.match(/\bas\s+([A-Za-z0-9_$]+)$/)?.[1];
        return alias ?? item.replace(/^type\s+/, "").trim();
      })
      .filter((item) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(item)),
  );

  return names.length > 0 ? Array.from(new Set(names)) : [fallbackName];
}
