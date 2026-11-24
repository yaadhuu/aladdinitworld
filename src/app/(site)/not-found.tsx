import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-24 sm:py-36">
      <div className="wrap grid gap-5 justify-items-start">
        <h1 className="t-h1 !text-[clamp(30px,2.4vw+20px,52px)]">This page is not available.</h1>
        <p className="lead max-w-[48ch]">A MacBook may have just been sold. See what is on the shelf now.</p>
        <Link href="/products" className="btn btn--primary">See all MacBooks</Link>
      </div>
    </section>
  );
}
