import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import { Button } from 'react-bootstrap'; // Import Button from react-bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchMenu = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log(
          "Búsqueda:",
          searchTerm,
          "Fecha:",
          startDate,
          "Page:",
          currentPage
        );
        // Realizar la lógica de búsqueda utilizando searchTerm, startDate y currentPage
      };


    return (
        <div className="menu-pill ml-4">
            <div className="d-flex flex-row bd-highlight">

                <div className="p-2 bd-highlight">
                    <input
                        placeholder="Buscar"
                        className="form-control border-end-0 border rounded-pill"
                        style={{ marginRight: "10px" }}
                    />
                </div>
                <div className="p-2 bd-highlight">
                    <Button
                        type="button"
                        className="btn btn-primary border-start-0 rounded-pill"
                        onClick={handleSearchSubmit}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SearchMenu;
