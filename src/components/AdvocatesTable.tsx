// Third Party
import { FC } from "react";
import { useRouter } from "next/router";

// Components
import SpecialtiesDisplay from "./Specialties";
import TableSortingIndicator from "./TableSortingIndicator";

// Utils
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

// Types
import { AdvocateDataResponse } from "@/app/api/advocates/route";
import { SortableColumns } from "@/app/api/advocates/route";

interface IProps {
  advocateSearchData: AdvocateDataResponse;
}

const AdovcatesTable: FC<IProps> = ({ advocateSearchData }) => {
  const router = useRouter();

  const handleColumnSortClick = (colName: SortableColumns) => {
    const sortBy = router.query.sort;
    const order = router.query.order;

    let queryObject: { [key: string]: string | string[] | undefined } = {
      ...router.query,
    };

    if (sortBy === colName && order === "asc") {
      queryObject = { ...queryObject, sort: colName, order: "desc" };
    } else if (sortBy === colName && order === "desc") {
      delete queryObject.sort;
      delete queryObject.order;
    } else if (sortBy !== colName) {
      queryObject = { ...queryObject, sort: colName, order: "asc" };
    }

    router.push({ pathname: "/", query: queryObject }, undefined, {
      shallow: true,
    });
  };

  const handlePaginationClick = (page: number) => {
    let queryObject: { [key: string]: string } = {
      ...router.query,
      page: page.toString(),
    };

    router.push({ pathname: "/", query: queryObject }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-xs rounded-base border border-slate-200 rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-body">
        <thead className="text-white text-body bg-solaceGreen border-b rounded-base border-slate-200 font-medium">
          <tr>
            <th
              scope="col"
              className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 group cursor-pointer"
              onClick={() => handleColumnSortClick("firstName")}
            >
              <div className="flex gap-1 items-center">
                <span>First Name</span>
                <TableSortingIndicator colName="firstName" />
              </div>
            </th>
            <th
              scope="col"
              className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 group cursor-pointer"
              onClick={() => handleColumnSortClick("lastName")}
            >
              <div className="flex gap-1 items-center">
                <span>Last Name</span>
                <TableSortingIndicator colName="lastName" />
              </div>
            </th>
            <th
              scope="col"
              className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 group cursor-pointer"
              onClick={() => handleColumnSortClick("city")}
            >
              <div className="flex gap-1 items-center">
                <span>City</span>
                <TableSortingIndicator colName="city" />
              </div>
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
              className="xl:px-6 lg:px-4 px-2 xl:py-3 lg:py-2 py-1 group cursor-pointer"
              onClick={() => handleColumnSortClick("yearsOfExperience")}
            >
              <div className="flex gap-1 items-center">
                <span>Years of Experience</span>
                <TableSortingIndicator colName="yearsOfExperience" />
              </div>
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
          {advocateSearchData.data.map((advocate) => {
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
                  <SpecialtiesDisplay specialtiesList={advocate.specialties} />
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
      <div className="bg-slate-100 flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6 ">
        {advocateSearchData.totalResults === 0 && (
          <div className="flex-1 py-2">
            <p className="text-center">
              No advocates found matching search criteria.
            </p>
          </div>
        )}

        {advocateSearchData.totalResults > 0 && (
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="font-light">
                Showing{" "}
                <span className="font-medium">{advocateSearchData.start}</span>{" "}
                to <span className="font-medium">{advocateSearchData.end}</span>{" "}
                of{" "}
                <span className="font-medium">
                  {advocateSearchData.totalResults}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="flex gap-2 items-center">
                <button
                  className="relative border disabled:opacity-30 disabled:pointer-events-none border-slate-500 inline-flex  items-center rounded-lg px-2 py-2 inset-ring inset-ring-gray-700 hover:bg-slate-200 focus:z-20 focus:outline-offset-0"
                  onClick={() =>
                    handlePaginationClick(advocateSearchData.currentPage - 1)
                  }
                  disabled={advocateSearchData.currentPage === 1}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    data-slot="icon"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="">Previous</span>
                </button>

                <button
                  className="relative border disabled:opacity-30 disabled:pointer-events-none border-slate-500 inline-flex items-center rounded-lg px-2 py-2 inset-ring inset-ring-gray-700 hover:bg-slate-200 focus:z-20 focus:outline-offset-0"
                  onClick={() =>
                    handlePaginationClick(advocateSearchData.currentPage + 1)
                  }
                  disabled={
                    advocateSearchData.end === advocateSearchData.totalResults
                  }
                >
                  <span className="">Next</span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    data-slot="icon"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdovcatesTable;
