import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError = params.error ? decodeURIComponent(params.error) : "";
  return <LoginForm initialError={initialError} />;
}
