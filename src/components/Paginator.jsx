import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { currentPageChanged } from "../app/features/paginatorSlice";

export default function Paginator() {
  const numOfPages = useSelector((state) => state.paginator.numOfPages);
  const dispatch = useDispatch();

  const handleCurrentPageChange = (e, value) => {
    dispatch(currentPageChanged(value));
  };

  return (
    <Pagination
      count={numOfPages}
      color="primary"
      onChange={handleCurrentPageChange}
    />
  );
}
