export function AdminHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-stone-200 bg-white px-8 py-6">
      <h1 className="font-serif text-2xl text-stone-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      )}
    </div>
  );
}
