import {FilterAltSharp} from "@mui/icons-material"
import { useNotes } from "../../context"
import { useState } from "react";
import { FilterDrawerPortal } from "./FilterDrawer/FilterDrawerPortal";

const SearchBar = ({notetype}) => {

    const {filterByLabel, notesDispatch, sortBy} = useNotes();

    const displayNotes = notetype === "archives" ? "archives" : "notes"

    const [showFilterModal, setShowFilterModal] = useState(false)

    const handleChangeShowFilterModal = (action) => {
        switch (action) {
            case  "OPEN_FILTER_MODAL":
                setShowFilterModal(false);
               break;
            case "CLOSE_FILTER_MODAL":
                setShowFilterModal(false)
        }
    }

    const handleClearFilters = () => 
        notesDispatch({
            action:{
                type: "RESET_FILTERS",
                payload: {
                    sortBy: "",
                    filterByLabel: filterByLabel.map((filter) => ({
                        ...filter,
                        filtered: false
                    }))
                }
            }
        })
    
    return (
        <div className="my-3 serach-filter-sort-wrapper">
            <div className="search-bar-wrapper mx-auto text-center px-0-75 py-0-5">
                <input
                    type="section"
                    className="input-search-note text-lg"
                    placeholder="Enter Search Text"
                    // onChange={handleChangeSearchText}
                    // value={searchText}
                />
                {displayNotes.length > 0 && (
                    <button     
                    className="btn btn-secondary btn-icon btn-filter"
                    onClick={(e) => handleChangeShowFilterModal("OPEN_FILTER_MODAL")}
                    >
                        <span className="icon mui-icon">
                            <FilterAltSharp/>
                        </span>
                    </button>
                )}
            </div>
            {showFilterModal && <FilterDrawerPortal handleChangeShowFilterModal={handleChangeShowFilterModal}/>}
            <div className="text-clear-button-wrapper flex-row flex-justify-between flex-align-start mx-auto mt-1">
                <div className="sort-filter-text">
                    {sortBy && (<p className="sort-options-text">Sort by- {sortBy}</p>)}
                    {filterByLabel.some((filter) => filter.filtered) && (
                    <div className="filter-options-text flex-row flex-row flex-align-center flex-justify-start">
                        Filter by - {" "}
                        {filterByLabel.map(({id, label, filtered}) => filtered && <span key={id}>{label}</span>)}
                    </div>
                    )}
                </div>
                {sortBy || filterByLabel.some((filter) => filter.filtered) ? (
                    <button
                        className="btn btn-secondary text-sm px-0-5 py-0-25"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export { SearchBar };
