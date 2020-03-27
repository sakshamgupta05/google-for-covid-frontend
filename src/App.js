import React from 'react';
import queryString from 'query-string'

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

const url = "https://61026ca5.ngrok.io/"

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

const text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

const useStylesRoot = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  highlights: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  progress: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  }
}));

function App() {
  const classes = useStylesRoot();
  const [articles, setArticles] = React.useState([])
  const [highlights, setHighlights] = React.useState([])

  React.useEffect(() => {
    var q = queryString.parse(window.location.search);
    if (q.search) {
      postData(url, JSON.stringify(q.search))
        .then((data) => {
          console.log(data); // JSON data parsed by `response.json()` call
          setArticles(data.results.results.Articles)
          setHighlights(data.results.results.Highlights)
        });
    }
  }, [])
  return (
    <div>
      <PrimarySearchAppBar setArticles={setArticles} setHighlights={setHighlights} />
      {/* <CircularProgress /> */}
      {
        highlights && highlights.length > 0 && (
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} md={8}>
              <div className={classes.highlights}>
                <Typography variant="h5" component="h2">
                  Highlights
                </Typography>
                <ul>
                  {
                    highlights && highlights.map(hl => (
                      <li>{hl}</li>
                    ))
                  }
                </ul>
              </div>
            </Grid>
          </Grid>
        )
      }
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} md={8}>
          {
            articles && articles.map(article => (
              <div key={article.Id} className={classes.container}>
                <SimpleCard className={classes.card} article={article} />
              </div>
            ))
          }
        </Grid>
      </Grid>
    </div>
  );
}



const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function PrimarySearchAppBar({setArticles, setHighlights}) {
  const classes = useStyles();

  React.useEffect(() => {
    var input = document.getElementById("myInput");
    var q = queryString.parse(window.location.search);
    if (q.search) {
      input.value = q.search
    }
    input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      // document.getElementById("myBtn").click();
      // const res = getRes(input.value)

      const val = input.value
      var q = queryString.parse(window.location.search);
      // set the `row` property
      q.search = val;
      // convert the object to a query string
      // and overwrite the existing query string
      window.location.search = queryString.stringify(q);
      postData(url, JSON.stringify(val))
        .then((data) => {
          console.log(data); // JSON data parsed by `response.json()` call
          setArticles(data.results.results.Articles)
          setHighlights(data.results.results.Highlights)
        });
    }
  });
  }, [setArticles, setHighlights])

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Google for COVID-19
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              id="myInput"
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>

    </div>
  );
}

const useStylesCard = makeStyles({
  root: {
    minWidth: 275,
    // display: 'inline-block'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function SimpleCard({article}) {
  const classes = useStylesCard();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {text_truncate(article.Authors, 60)}
        </Typography>
        <a href={article.Reference}>
          <Typography variant="h6" component="h2">
            {text_truncate(article.Title)}
          </Typography>
        </a>
        <Typography className={classes.pos} color="textSecondary">
          {article.Published}
        </Typography>
        <Typography variant="body2" component="p">
          {article.Publication}
        </Typography>
        {
          article.Relevant && article.Relevant.length > 0 &&
            <div>
              <br />
              <Typography variant="subtitle1" gutterBottom>
                Relevant
              </Typography>
              <ul>
                {
                  article.Relevant.map(rel => (
                    <li>{rel}</li>
                  ))
                }
              </ul>
            </div>
        }
      </CardContent>
    </Card>
  );
}



export default App;
