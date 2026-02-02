// Third Party
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";

// Components
import AdovcatesSearchForm from "@/components/AdvocatesSearchForm";
import AdovcatesTable from "@/components/AdvocatesTable";

// Types
import { AdvocateDataResponse } from "@/app/api/advocates/route";

export default function Home() {
  const router = useRouter();

  const [advocateSearchData, setAdvocateSearchData] =
    useState<AdvocateDataResponse>({
      data: [],
      start: 0,
      end: 0,
      currentPage: 0,
      totalResults: 0,
    });

  useEffect(() => {
    const getAdvocates = async () => {
      const search = router.query.search;
      const page = router.query.page;
      const sort = router.query.sort;
      const order = router.query.order;
      const specialty = router.query.specialty;

      try {
        const { data } = await axios.get<AdvocateDataResponse>(
          "/api/advocates",
          {
            params: {
              search,
              page,
              sort,
              order,
              specialty: Array.isArray(specialty)
                ? specialty.join(",")
                : specialty,
            },
          },
        );
        setAdvocateSearchData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (router) {
      getAdvocates();
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Solace Candidate Assignment</title>
        <meta name="description" content="Show us what you got" />
      </Head>
      <main className="mb-6">
        <nav className="bg-solaceGreen p-6" />

        <div className="max-w-screen-2xl mx-auto px-2 mt-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Solace Advocates
            </h1>
            <p className="text-muted-foreground">
              Search our extensive list of healtcare advocates
            </p>
          </div>

          <AdovcatesSearchForm />
          <AdovcatesTable advocateSearchData={advocateSearchData} />
        </div>
      </main>
    </>
  );
}
