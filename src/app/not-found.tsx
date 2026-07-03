import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">404</p>
        <h1 className="mt-3 text-3xl font-semibold">This page is not available</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          The business, module, or item could not be found for this workspace.
        </p>
        <Link className="mt-6 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800" href="/">
          Back to platform
        </Link>
      </div>
    </main>
  );
}
