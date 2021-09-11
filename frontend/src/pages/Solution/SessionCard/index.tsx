import { useState, useEffect } from "react";
import * as UI from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { REGISTER_SESSION_MUTATION, UNREGISTER_SESSION_MUTATION } from "./graphql/mutations";
import { DateTime } from "luxon";
import { Sessions_sessions as Session } from "../../../types/Sessions";
import { CurrentUser_currentUser as User } from "../../../types/CurrentUser";
import { useAuth } from "../../../common/auth";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import "./styles/session-card.scss";
import useStyles from "./styles/session-card-custom";
import theme from "../../../common/theme";

const SessionCard = ({currentSession}:{currentSession:Session}) => {
  const session = currentSession;
  const user:User = useAuth().user;
  const classes:ClassNameMap = useStyles(theme);

  const [attendeeCount, setAttendeeCount] = useState(session.signups.length);
  const [attendeeCountLabel, setAttendeeCountLabel] = useState('')
  useEffect(()=>{
    let label = `${attendeeCount} people attending!`;
    if (attendeeCount === 1) label = `${attendeeCount} person attending!`;
    if (attendeeCount <= 0) label = `Be the first to join!`;
    setAttendeeCountLabel(label)
  }, [attendeeCount])

  const [registerDisabled, setRegisterDisabled] = useState(session.signups.some(signup => (signup.user === user.id)));
  const [register, { error: registerError }] = useMutation(REGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update: (_) => {
            setAttendeeCount(session.signups.length);
          },
          onError: ((err) => console.error(err))
        });
  const [unregisterDisabled, setUnregisterDisabled] = useState(!registerDisabled);
  const [unregister, { error: unregisterError }] = useMutation(UNREGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update: (cache:any) => {
            // Backend won't return a whole set of data, and therefore Apollo won't update everything.
            // Signups have to be manually updated here.
            const newSignups = cache.data.data[`Session:${session.id}`].signups.filter((signup:User) => signup.id !== user.id)
            cache.data.data[`Session:${session.id}`].signups = newSignups;
            setAttendeeCount(newSignups.length);
          },
          onError: ((err) => console.error(err))
        });
  if (registerError) return null;
  if (unregisterError) return null;

  return (
    <UI.Grid item xs={12} sm={6} md={4}>
      <UI.Card className={classes.root}>
        <UI.CardHeader className={classes.header}
          title={session.strapline}
          subheader={session.title}
        />
        <UI.CardMedia
          className={classes.media}
          image={session.image}
          title={session.title}
        />
        <UI.CardContent>
          <UI.Typography variant="h6" color="textSecondary" align="center" gutterBottom component="p">
            { DateTime.fromISO(session.startTime).toFormat("DDDD, t") }
          </UI.Typography>
          <UI.Typography variant="body1" color="textSecondary" align="center" gutterBottom component="p" id={`attendeeCount${session.id}`}>
            { attendeeCountLabel }
          </UI.Typography>
          <UI.Typography className="errMsg" variant="body2" color="primary" align="center" gutterBottom component="p" id={`errMsg${session.id}`}>
          </UI.Typography>
        </UI.CardContent>
        <UI.CardActions className={classes.buttonGroup}>
          <UI.Button
            className={classes.registerBtn}
            id={`registerBtn${session.id}`}
            variant="contained"
            size="medium"
            color="primary"
            disabled={registerDisabled}
            onClick={(e) => {
              e.preventDefault();
              setRegisterDisabled(true);
              setUnregisterDisabled(false);
              register();
            }}
          >
            Register
          </UI.Button>

          <UI.Button
            className={classes.unregisterBtn}
            id={`unregisterBtn${session.id}`}
            variant="contained"
            size="medium"
            color="default"
            disabled={unregisterDisabled}
            onClick={(e) => {
              e.preventDefault();
              setRegisterDisabled(false);
              setUnregisterDisabled(true);
              unregister();
            }}
          >
            Unregister
          </UI.Button>
        </UI.CardActions>
      </UI.Card>
    </UI.Grid>
  );
};

export default SessionCard;
