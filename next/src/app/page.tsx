import { getMissingRequiredEnvKeys } from '@/lib/env';

export default function HomePage() {
  const missingEnv = getMissingRequiredEnvKeys();

  return (
    <section>
      <h1>Next.js Foundation Ready</h1>
      <p>
        This app is the canonical deployable foundation for De Origen Coffee Shop. Existing template versions
        remain untouched for parity comparison.
      </p>
      {missingEnv.length > 0 ? (
        <p role="status" className="env-warning">
          Missing environment keys: {missingEnv.join(', ')}
        </p>
      ) : (
        <p role="status">Environment schema check passed.</p>
      )}
    </section>
  );
}
