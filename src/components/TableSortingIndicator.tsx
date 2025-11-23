import { FC, useMemo } from "react";
import { useRouter } from "next/router";

import { SortableColumns } from "@/app/api/advocates/route";

interface IProps {
  colName: SortableColumns;
}

const TableSortingIndicator: FC<IProps> = ({ colName }) => {
  const router = useRouter();

  const sortingState = useMemo(() => {
    const sortBy = router.query.sort;
    const order = router.query.order;

    if (sortBy === colName && (order === "asc" || order === "desc")) {
      return {
        col: colName,
        order: order as "asc" | "desc",
      };
    }

    return null;
  }, [router, colName]);

  return (
    <>
      {sortingState === null && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 opacity-0 group-hover:opacity-70 transition-opacity"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      )}

      {sortingState?.col === colName && sortingState.order === "asc" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      )}

      {sortingState?.col === colName && sortingState.order === "desc" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      )}
    </>
  );
};

export default TableSortingIndicator;
