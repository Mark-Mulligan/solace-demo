// Third Party
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Select, { SingleValue } from "react-select";

// Utils
import { debounce } from "@/utils/debounce";

// Types
import { SpecialtyDataResponse } from "@/app/api/specialties/route";

interface SelectOption {
  value: string;
  label: string;
}

const AdovcatesSearchForm = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [specialtyOptions, setSpecialtiesOptions] = useState<SelectOption[]>(
    []
  );
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SingleValue<SelectOption | null>>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        let queryObject: { [key: string]: string } = {
          ...router.query,
          search: val,
          page: "1",
        };

        if (val === "") {
          queryObject = {};
        }

        router.push({ pathname: "/", query: queryObject }, undefined, {
          shallow: true,
        });
      }, 750),
    [router]
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const queryObject = {};
    router.push({ pathname: "/", query: queryObject }, undefined, {
      shallow: true,
    });
  };

  const handleSpecialtySelect = (
    newValue: SingleValue<SelectOption> | null
  ) => {
    console.log({ newValue });
    let queryObject: { [key: string]: string } = {
      ...router.query,
      page: "1",
    };

    if (newValue) {
      queryObject.specialty = newValue.value;
    } else {
      delete queryObject.specialty;
    }

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
    if (router.query) {
      const specialtyParam = router.query.specialty;

      if (typeof specialtyParam === "string") {
        const foundSpecialty = specialtyOptions.find(
          (specialty) => specialty.value === specialtyParam
        );

        if (foundSpecialty) {
          setSelectedSpecialty(foundSpecialty);
        } else {
          setSelectedSpecialty(null);
        }
      } else {
        setSelectedSpecialty(null);
      }
    }
  }, [router.query, specialtyOptions]);

  useEffect(() => {
    const getSpecialties = async () => {
      try {
        const { data } = await axios.get<SpecialtyDataResponse>(
          "/api/specialties"
        );

        const formattedSpecialties = data.data.map((specialty) => {
          return { value: specialty.id.toString(), label: specialty.name };
        });
        setSpecialtiesOptions(formattedSpecialties);
      } catch (error) {
        console.log(error);
      }
    };

    getSpecialties();
  }, []);

  return (
    <div className="flex justify-between">
      <form className="max-w-md mb-8 flex-1">
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

      <div className="flex-1 max-w-sm">
        <Select
          options={specialtyOptions}
          value={selectedSpecialty}
          onChange={handleSpecialtySelect}
          isClearable
        />
      </div>
    </div>
  );
};

export default AdovcatesSearchForm;
