"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        const response = await fetch("/api/cook-history");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load cooking history");
        if (active) setEntries(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load cooking history");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF2DF] px-6 py-10 md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-[#D17368]">Past Dishes</p>
            <h1 className="mt-2 text-6xl font-bold text-[#D17368]">MY COOKING LOG</h1>
            <p className="mt-4 text-lg text-gray-600">Every recipe you finish in Cook Mode appears here.</p>
          </div>
          <Link href="/profilepage" className="rounded-xl bg-[#E7DEDB] px-7 py-3 font-bold text-[#D17368] transition hover:bg-gray-300">
            Back to Profile
          </Link>
        </div>

        {loading ? (
          <p className="py-20 text-center text-xl font-semibold text-[#D17368]">Loading your cooking log...</p>
        ) : error ? (
          <p className="mt-10 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-red-700">{error}</p>
        ) : entries.length === 0 ? (
          <div className="mt-12 rounded-3xl border-4 border-[#E7DEDB] bg-white px-8 py-16 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-[#D17368]">No completed recipes yet</h2>
            <p className="mt-3 text-gray-600">Finish a recipe in Cook Mode to create your first entry.</p>
            <Link href="/profilepage" className="mt-7 inline-block rounded-xl bg-[#D17368] px-8 py-3 font-bold text-white transition hover:bg-[#b5645b]">
              Start Cooking
            </Link>
          </div>
        ) : (
          <section className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <article key={entry.id} className="overflow-hidden rounded-3xl border-4 border-[#D17368] bg-white shadow-lg">
                <div className="h-64 bg-[#E7DEDB]">
                  {entry.image ? (
                    <img
                      src={`data:${entry.imageType || "image/png"};base64,${entry.image}`}
                      alt={`Completed ${entry.recipeName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center font-semibold text-gray-500">
                      No dish photo was uploaded
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <time className="text-sm font-bold uppercase tracking-wide text-[#D17368]" dateTime={entry.completedAt}>
                    {new Date(entry.completedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-2 text-3xl font-bold text-[#D17368]">{entry.recipeName}</h2>
                  <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">{entry.review}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
