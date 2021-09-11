import React from "react";
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

let session:Session;
let attendeeCount:number;
let user:User;
let classes:ClassNameMap;
let errMsgTag:HTMLElement;


const startTime = (datetime:string):string => {
  return DateTime.fromISO(datetime).toFormat("DDDD, t");
};

const attendeeCountLabel = ():string => {
  if (attendeeCount <= 0) return `Be the first to join!`;
  if (attendeeCount === 1) return `${attendeeCount} person attending!`;
  return `${attendeeCount} people attending!`;
}

const updateSignups = (cache:any) => {
  const newSignups = cache.data.data[`Session:${session.id}`].signups.filter((signup:User) => signup.id !== user.id)
  cache.data.data[`Session:${session.id}`].signups = newSignups;

  attendeeCount = newSignups.length;
}

const UpdateAttendeeCountLabel = () =>  {
  document.querySelector(`#attendeeCount${session.id}`)!.textContent = attendeeCountLabel();
}

const updateErrMsg = (msg:string) => {
  if (errMsgTag) errMsgTag.textContent = msg;
}

const SessionCard = ({currentSession}:{currentSession:Session}) => {
  session = currentSession;
  attendeeCount = session.signups.length;
  user = useAuth().user;
  classes = useStyles(theme);
  errMsgTag = document.querySelector(`#errMsg${session.id}`)!;

  const isAttending = (session.signups.some(signup => signup.user === user.id)) ? true : false;
  const [registerDisabled, setRegisterDisabled] = React.useState(isAttending);
  const [register, { error: registerError }] = useMutation(REGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update(_) {
            UpdateAttendeeCountLabel();
          }
        });
  const [unregisterDisabled, setUnregisterDisabled] = React.useState(!registerDisabled);
  const [unregister, { error: unregisterError }] = useMutation(UNREGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update(cache) {
            updateSignups(cache);
            UpdateAttendeeCountLabel();
          }
        });

  if (registerError) {
    updateErrMsg(registerError.message);
    return null;
  }
  if (unregisterError) {
    updateErrMsg(unregisterError.message);
    return null;
  }

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
            { startTime(session.startTime) }
          </UI.Typography>
          <UI.Typography variant="body1" color="textSecondary" align="center" gutterBottom component="p" id={`attendeeCount${session.id}`}>
            { attendeeCountLabel() }
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
              updateErrMsg("");
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
              updateErrMsg("");
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
