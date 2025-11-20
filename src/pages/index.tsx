// Next
import Head from "next/head";
import { useRouter } from "next/router";

import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

// Components
import SpecialtiesDisplay from "@/components/Specialties";

// Utilies
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

// Types
import { Advocate } from "@/db/schema";

export default function Home() {
  const router = useRouter();

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [search, setSearch] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let queryObject: { [key: string]: string } = {
      ...router.query,
      search: e.target.value,
    };

    if (e.target.value === "") {
      queryObject = {};
    }

    router.push({ pathname: "/", query: queryObject }, undefined, {
      shallow: true,
    });
  };

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const queryObject = {};
    router.push({ pathname: "/", query: queryObject }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (router.query) {
      const searchParam = router.query.search;

      if (typeof searchParam === "string") {
        setSearch(searchParam);
      } else {
        setSearch("");
      }
    }
  }, [router.query]);

  useEffect(() => {
    const searchTerm = search.toLowerCase();

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.specialties
          .map((s) => s.toLowerCase())
          .some((s) => s.includes(searchTerm.toLowerCase())) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [search, advocates]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

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

          {/* Search Controls */}
          <form className="max-w-md mb-8">
            <label
              htmlFor="search"
              className="block mb-2.5 text-sm font-medium text-heading sr-only "
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-body"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                onChange={onChange}
                placeholder="Search"
                value={search}
              />
              <div className="absolute right-0 inset-y-0 end-0 flex items-center pe-3">
                <button onClick={onClick} type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          <div className="relative overflow-x-auto shadow-xs rounded-base border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-body">
              <thead className="text-white text-body bg-solaceGreen border-b rounded-base border-slate-200 font-medium">
                <tr>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    Degree
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    Specialties
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1"
                  >
                    Years of Experience
                  </th>
                  <th
                    scope="col"
                    className="xl:px-6 px-4 lg:py-3 py-2 whitespace-nowrap"
                  >
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-50">
                {filteredAdvocates.map((advocate) => {
                  return (
                    <tr
                      className="bg-neutral-primary border-b border-slate-200"
                      key={advocate.id}
                    >
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1">
                        {advocate.firstName}
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1">
                        {advocate.lastName}
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1">
                        {advocate.city}
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1">
                        {advocate.degree}
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 min-w-[300px]">
                        <SpecialtiesDisplay
                          specialtiesList={advocate.specialties}
                        />
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1">
                        {advocate.yearsOfExperience}
                      </td>
                      <td className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 whitespace-nowrap">
                        {formatPhoneNumber(advocate.phoneNumber)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
