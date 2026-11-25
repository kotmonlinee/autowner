export default function FaqList({
  items,
  openFirst = false,
}: {
  items: { question: string; answer: string }[];
  openFirst?: boolean;
}) {
  return (
    <div className="divide-y divide-surface-border border-y border-surface-border">
      {items.map((item, index) => (
        <details key={item.question} className="group" open={openFirst && index === 0}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-heading text-sm font-bold text-text-primary transition-colors hover:text-primary">
            <span>{item.question}</span>
            <span aria-hidden="true" className="font-mono text-xl font-normal text-primary transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-text-secondary">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
