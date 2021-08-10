import React from "react";
import * as UI from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LuxonUtils from "@date-io/luxon";
import { DateTime } from "luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Sessions_sessions as Session } from "../types/Sessions"
import SessionCard from "components/session-card";
import theme from "../theme";

const useStyles = UI.makeStyles((customTheme: UI.Theme) => {
  return UI.createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    registerButton: {
      margin: customTheme.spacing(1),
      display: 'inline-block',
      paddingLeft: customTheme.spacing(3),
      paddingRight: customTheme.spacing(3),

    },
    unregisterButton: {
      margin: customTheme.spacing(1),
    },
    buttonGroup: {
      justifyContent: 'center',
    },
    box: {
    },
    inputField: {
    },
    item: {
    },
    datepicker: {
    }
  });
});

const SESSIONS_QUERY = gql`
  query Sessions {
    sessions {
      id
      title
      strapline
      image
      startTime
      signups {
        user: id
        name
        avatar
      }
    }
  }
`;

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
  const classes = useStyles(theme);
  const { loading, error, data } = useQuery<{sessions:Session[]}>(SESSIONS_QUERY);

  if (loading) {
    return (<p>Loading ...</p>);
  } else if(error) {
    return (<p>`Error! ${error.message}`</p>);
  }

  return (
    <>
      <UI.Box m={4} className={classes.box}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <UI.Grid container alignContent="space-around" spacing={4}>
            <UI.Grid item xs={12} sm={6} md={4} className={classes.item}>
              <UI.TextField
                id="standard-basic"
                label="Search for events"
                placeholder="Search for events..."
                className={classes.inputField}
                margin="normal"
                fullWidth
                onChange={(e) => (setSearchWord(e.target.value))}
              />
            </UI.Grid>
              <UI.Grid item xs={12} sm={6} md={4}>
                <KeyboardDatePicker
                  id="start-date-picker-dialog"
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
                  id="end-date-picker-dialog"
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
      <UI.Box m={4}>
        <UI.Grid container direction="row" alignContent="space-around" spacing={4}>
          { QuerySession(searchWord, startDate!, endDate!, data!.sessions) }
        </UI.Grid>
      </UI.Box>
    </>
  );
};

export default Solution;
