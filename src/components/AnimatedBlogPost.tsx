export default function AnimatedBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-700">{children}</div>
  );
}
