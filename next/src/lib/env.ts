const REQUIRED_ENV_KEYS = ['NEXT_PUBLIC_SITE_URL'] as const;

export type PublicEnv = {
  NEXT_PUBLIC_SITE_URL: string;
};

function assertNonEmpty(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicEnv(source: NodeJS.ProcessEnv = process.env): PublicEnv {
  return {
    NEXT_PUBLIC_SITE_URL: assertNonEmpty('NEXT_PUBLIC_SITE_URL', source.NEXT_PUBLIC_SITE_URL)
  };
}

export function getMissingRequiredEnvKeys(source: NodeJS.ProcessEnv = process.env): string[] {
  return REQUIRED_ENV_KEYS.filter((key) => !source[key] || source[key]?.trim() === '');
}
