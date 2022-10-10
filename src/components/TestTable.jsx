import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";



export default function TestTable(props) {
  const [applicants, setApplicants] = useState(null);
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/testApplicants/${props.testId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setApplicants(response.data.applicants);
    });
  }, []);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Enrolment Number</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applicants ? applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              role="checkbox"
              tabIndex={-1}
              aria-checked={true}
              selected={true}
            >
              <TableCell component="th" scope="row" align="center">
                {applicant.id}
              </TableCell>
              <TableCell align="center">{applicant.name}</TableCell>
              <TableCell align="center">{applicant.enrolment_number}</TableCell>
              <TableCell align="center">{applicant.mobile}</TableCell>
              <TableCell align="center">{applicant.status}</TableCell>
            </TableRow>
          )) : <></>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
