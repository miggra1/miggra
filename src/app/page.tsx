import { Suspense } from "react";
import { HomePage } from "./home-page";
import { HomePageSkeleton } from "./home-page-skeleton";

export const revalidate = 60;
export const runtime = "nodejs";

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePage />
    </Suspense>
  );
}
