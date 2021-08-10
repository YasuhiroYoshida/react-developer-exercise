import React from 'react';
import * as UI from "@material-ui/core";
import { gql, useMutation } from '@apollo/client';
import { DateTime } from "luxon";
import { Sessions_sessions as Session } from "../types/Sessions";
import { CurrentUser_currentUser as User } from '../types/CurrentUser';
import { useAuth } from "auth";
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import "./session-card.scss";
import theme from "../theme";

let session:Session;
let attendeeCount:number;
let user:User;
let classes:ClassNameMap;

const useStyles = UI.makeStyles((customTheme:UI.Theme) => {
  return UI.createStyles({
    root: {
      maxWidth: 345,
      height: "100%",
    },
    header: {
      height: "5em",
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    registerBtn: {
      margin: customTheme.spacing(1),
      display: 'inline-block',
      paddingLeft: customTheme.spacing(3),
      paddingRight: customTheme.spacing(3),

    },
    unregisterBtn: {
      margin: customTheme.spacing(1),
    },
    buttonGroup: {
      justifyContent: 'center',
    }
  });
});

const REGISTER_SESSION_MUTATION = gql`
  mutation Register($sessionId:ID!) {
    register(sessionId:$sessionId) {
      session {
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
  }
`;

const UNREGISTER_SESSION_MUTATION = gql`
  mutation Unregister($sessionId:ID!) {
    unregister(sessionId:$sessionId)
  }
`;

const startTime = (datetime:string):string => {
  return DateTime.fromISO(datetime).toFormat("DDDD, t")
};

const attendeeCountAsMsg = (attendeeCount:number):string => {
  if (attendeeCount <= 0) return `Be the first to join!`;
  if (attendeeCount === 1) return `${attendeeCount} person attending!`;
  return `${attendeeCount} people attending!`;
}

const updateSignups = (cache:any) => {
  const newSignups = cache.data.data[`Session:${session.id}`].signups.filter((signup:User) => signup.id !== user.id)
  cache.data.data[`Session:${session.id}`].signups = newSignups;

  attendeeCount = newSignups.length;
}

const replaceAttendeeCountAsMsg = () =>  {
  document.querySelector(`#attendeeCount${session.id}`)!.textContent = attendeeCountAsMsg(attendeeCount);
}

const removeErrMsg = () => {
  document.querySelector(`#errMsg${session.id}`)!.textContent = "";
}

const SessionCard = ({currentSession}:{currentSession:Session}) => {
  session = currentSession;
  attendeeCount = session.signups.length;
  user = useAuth().user;
  classes = useStyles(theme);

  const isAttending = (session.signups.some(signup => signup.user === user.id)) ? true : false;
  const [registerDisabled, setRegisterDisabled] = React.useState(isAttending);
  const [register, { error: registerError }] = useMutation(REGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update(_) {
            replaceAttendeeCountAsMsg();
          }
        });
  const [unregisterDisabled, setUnregisterDisabled] = React.useState(!registerDisabled);
  const [unregister, { error: unregisterError }] = useMutation(UNREGISTER_SESSION_MUTATION, {
          variables: { sessionId: session.id },
          update(cache) {
            updateSignups(cache);
            replaceAttendeeCountAsMsg();
          }
        });

  const errMsgTag = document.querySelector(`#errMsg${session.id}`);
  if (errMsgTag) {
    if (registerError) {
      errMsgTag.textContent = registerError.message;
      return null;
    }
    if (unregisterError) {
    errMsgTag.textContent = unregisterError.message;
    return null;
    }
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
            { attendeeCountAsMsg(attendeeCount) }
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
              removeErrMsg();
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
              removeErrMsg();
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
