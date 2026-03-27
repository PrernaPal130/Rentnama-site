import SearchResultsClient from "./SearchResultsClient";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";

  return <SearchResultsClient initialQuery={query} />;
}
