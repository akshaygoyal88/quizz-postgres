"use client";
import React, { useState, useEffect, ComponentType } from "react";
import { useFetch } from "@/hooks/useFetch";
import InputWithLabel from "./InputWithLabel";

interface WrapperProps {
  WrappedComponent: ComponentType<any>;
  url: string;
}

const SelectWrapper = (WrappedComponent: WrapperProps) => {
  return (props: any) => {
    const [list, setList] = useState<any[]>([]);
    const [selectedList, setSelectedList] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredList, setFilteredList] = useState<any[]>([]);

    const { data, error, isLoading } = useFetch({
      url: props.url,
    });

    useEffect(() => {
      if (data && !data.error) {
        setList(data);
      }
    }, [data]);

    useEffect(() => {
      if (!data?.error && selectedList.length === data?.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    }, [selectedList]);

    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedList([]);
      } else {
        setSelectedList(data);
      }
      setSelectAll(!selectAll);
    };

    const handleSubscriberSelection = (Id) => {
      const index = selectedList.findIndex((i) => i.id === Id);
      if (index === -1) {
        setSelectedList([...selectedList, data.find((i) => i.id === Id)]);
      } else {
        setSelectedList([
          ...selectedList.slice(0, index),
          ...selectedList.slice(index + 1),
        ]);
      }
    };

    useEffect(() => {
      const filteredList = data?.filter((i) =>
        i.user.first_name.includes(searchTerm)
      );
      setFilteredList(filteredList);
    }, [searchTerm]);

    return (
      <div className="sm:px-8">
        <h2 className="text-xl font-bold">{props.heading}</h2>
        <div className="flex items-center justify-between">
          <input
            type="text"
            name="search"
            id="search"
            placeholder={props.placeholder}
            className="my-4 p-1 border-2 rounded border-gray-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          {selectAll && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              // onClick={handleDeleteAll}
            >
              Delete All
            </button>
          )}
        </div>

        <WrappedComponent
          list={list}
          selectedList={selectedList}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          handleSubscriberSelection={handleSubscriberSelection}
          filteredList={filteredList}
          searchTerm={searchTerm}
        />
      </div>
    );
  };
};

export default SelectWrapper;
