import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  );
}
