"use client";

import { ChangeEvent, useEffect, useState } from "react";

// Types
import { Advocate } from "@/db/schema";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="mb-6">
      <h1>Solace Advocates</h1>
      <form>
        <div className="max-w-sm">
          <label
            htmlFor="visitors"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Search
          </label>
          <input
            type="text"
            id="visitors"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
            placeholder=""
            onChange={onChange}
            required
          />
        </div>
        <button className="btn btn-primary" onClick={onClick}>Reset Search</button>
      </form>

      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                First Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                City
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Degree
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Specialties
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Years of Experience
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr
                  className="bg-neutral-primary border-b border-default"
                  key={advocate.id}
                >
                  <td className="px-6 py-4">{advocate.firstName}</td>
                  <td className="px-6 py-4">{advocate.lastName}</td>
                  <td className="px-6 py-4">{advocate.city}</td>
                  <td className="px-6 py-4">{advocate.degree}</td>
                  <td className="px-6 py-4">
                    <ul>
                      {advocate.specialties.map((s) => (
                        <li key={`${advocate.id}-${s}`}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
