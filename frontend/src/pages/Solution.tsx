import React from "react";
import * as UI from "@material-ui/core";
import { useQuery } from "@apollo/client";
import LuxonUtils from "@date-io/luxon";
import { DateTime } from "luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Sessions_sessions as Session } from "../types/Sessions"
import SessionCard from "components/SessionCard/session-card";
import { SESSIONS_QUERY } from "./gqls/queries";

const QuerySession = (searchWord:string, startDate:DateTime|null, endDate:DateTime|null, sessions:Session[]) => {
  return sessions.filter((session:Session) => {
    const wordMatched = (!searchWord) ? true :
      (
        (session.strapline.toLowerCase().includes(searchWord.toLowerCase())) ||
        (session.title.toLowerCase().includes(searchWord.toLowerCase()))
      );
    const startTime = DateTime.fromISO(session.startTime);
    const startDateMatched = (!startDate) ? true : (startDate.startOf("day") <= startTime)
    const endDateMatched = (!endDate) ? true : (startTime <= endDate.endOf("day"))
    return wordMatched && startDateMatched && endDateMatched;
  }).map((session:Session) => {
    return (
      <SessionCard key={session.id} currentSession={session} />
    );
  });
}

const Solution = () => {
  const [searchWord, setSearchWord] = React.useState("");
  const [startDate, setStartDate] = React.useState<DateTime | null>(null);
  const [endDate, setEndDate] = React.useState<DateTime | null>(null);
  const { loading, error, data } = useQuery<{sessions:Session[]}>(SESSIONS_QUERY);

  if (loading) {
    return (<p>Loading...</p>);
  } else if(error) {
    return (<p>`Error! ${error.message}`</p>);
  }

  return (
    <React.Fragment>
      <UI.Box>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <UI.Grid container alignContent="space-around" spacing={4}>
            <UI.Grid item xs={12} sm={6} md={4}>
              <UI.TextField
                id="search-by-word"
                label="Search for events"
                placeholder="Search for events..."
                margin="normal"
                fullWidth
                onChange={(e) => (setSearchWord(e.target.value))}
              />
            </UI.Grid>
              <UI.Grid item xs={12} sm={6} md={4}>
                <KeyboardDatePicker
                  id="search-by-start-date"
                  label="Start date dd.MM.yyyy"
                  value={startDate}
                  format="dd.MM.yyyy"
                  margin="normal"
                  fullWidth
                  onChange={(dateISO) => setStartDate(dateISO)}
                  KeyboardButtonProps={{
                    'aria-label': 'change start date',
                  }}
                />
            </UI.Grid>
            <UI.Grid item xs={12} sm={6} md={4}>
                <KeyboardDatePicker
                  id="search-by-start-end"
                  label="End date dd.MM.yyyy"
                  value={endDate}
                  format="dd.MM.yyyy"
                  margin="normal"
                  fullWidth
                  onChange={(dateISO) => setEndDate(dateISO)}
                  KeyboardButtonProps={{
                    'aria-label': 'change end date',
                  }}
                />
            </UI.Grid>
          </UI.Grid>
        </MuiPickersUtilsProvider>
      </UI.Box>
      <UI.Box>
        <UI.Grid container direction="row" alignContent="space-around" spacing={4}>
          { QuerySession(searchWord, startDate!, endDate!, data!.sessions) }
        </UI.Grid>
      </UI.Box>
    </React.Fragment>
  );
};

export default Solution;
